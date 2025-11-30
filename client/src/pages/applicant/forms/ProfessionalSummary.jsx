import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, Loader2, FileText, RefreshCw, ChevronDown, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import AIFeatureButton from '../../../components/common/AIFeatureButton';
import { useApp } from '../../../contexts/AppContext';
import { enhanceProfessionalSummary, checkGrammarAndSpelling, getReadabilityScore } from '../../../utils/aiService';
import { hasFeatureAccess, getTierForFeature } from '../../../utils/aiFeatures';

const ProfessionalSummary = ({
  data,
  onChange,
  onValidationChange,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [isCheckingReadability, setIsCheckingReadability] = useState(false);
  const [grammarResults, setGrammarResults] = useState(null);
  const [readabilityResults, setReadabilityResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAIMenu, setShowAIMenu] = useState(false);
  const validationRef = useRef();
  const { isSubscribed, subscriptionTier, addNotification } = useApp();
  const textareaRef = useRef();
  const menuRef = useRef(null);

  // Validate professional summary field
  const validateField = (field, value) => {
    const isEmpty = !value || value.trim() === '';
    
    if (isEmpty) {
      setValidationErrors(prev => ({ ...prev, [field]: true }));
      return false;
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  // Validate all fields
  const validateAllFields = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    const value = data?.professional_summary;
    if (!value || value.trim() === '') {
      errors.professionalSummary = true;
      hasErrors = true;
    }

    setValidationErrors(errors);
    return !hasErrors;
  }, [data]);

  // Store the validation function in ref and expose to parent
  useEffect(() => {
    validationRef.current = validateAllFields;
  }, [validateAllFields]);

  // Expose validation function to parent only once on mount
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(() => validationRef.current());
    }
  }, []); // Empty dependency array - only run on mount

  // Auto-resize textarea on content change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [data?.professional_summary]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAIMenu(false);
      }
    };

    if (showAIMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAIMenu]);

  const handleChange = (value) => {
    onChange({ ...data, professionalSummary: value });
    
    // Clear validation error when user starts typing
    if (validationErrors.professionalSummary) {
      validateField('professionalSummary', value);
    }
  };

  const handleAIEnhance = async () => {
    if (!isSubscribed) {
      addNotification({
        type: 'info',
        title: 'Subscription Required',
        message: 'Subscribe to unlock AI-powered professional summary enhancement.',
      });
      return;
    }
    
    if (!data?.professional_summary?.trim()) {
      addNotification({
        type: 'warning',
        title: 'No Summary',
        message: 'Please enter a professional summary first.',
      });
      return;
    }

    setIsEnhancing(true);
    addNotification({
      type: 'info',
      title: 'Enhancing Summary',
      message: 'AI is improving your professional summary...',
    });
    
    try {
      const profession = data?.personal_info?.profession || 'professional';
      const enhancedSummary = await enhanceProfessionalSummary(data.professional_summary, profession);
      onChange({ ...data, professionalSummary: enhancedSummary });
      addNotification({
        type: 'success',
        title: 'Enhancement Complete',
        message: 'Your professional summary has been enhanced!',
      });
    } catch (error) {
      console.error('AI enhancement failed:', error);
      addNotification({
        type: 'error',
        title: 'Enhancement Failed',
        message: 'Failed to enhance summary. Please try again.',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGrammarCheck = async () => {
    if (!isSubscribed) {
      addNotification({
        type: 'info',
        title: 'Subscription Required',
        message: 'Subscribe to unlock AI-powered grammar and spell check.',
      });
      return;
    }
    
    if (!data?.professional_summary?.trim()) {
      addNotification({
        type: 'warning',
        title: 'No Summary',
        message: 'Please enter a professional summary first.',
      });
      return;
    }

    setIsCheckingGrammar(true);
    
    try {
      const results = await checkGrammarAndSpelling(data.professional_summary);
      setGrammarResults(results);
      
      if (results.errors > 0) {
        onChange({ ...data, professionalSummary: results.corrected });
        addNotification({
          type: 'success',
          title: 'Grammar Check Complete',
          message: `Found and corrected ${results.errors} error(s).`,
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Grammar Check Complete',
          message: 'No errors found! Your text is grammatically correct.',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Check Failed',
        message: 'Failed to check grammar. Please try again.',
      });
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const handleReadabilityCheck = async () => {
    if (!isSubscribed) {
      addNotification({
        type: 'info',
        title: 'Subscription Required',
        message: 'Subscribe to unlock AI-powered readability analysis.',
      });
      return;
    }
    
    if (!data?.professional_summary?.trim()) {
      addNotification({
        type: 'warning',
        title: 'No Summary',
        message: 'Please enter a professional summary first.',
      });
      return;
    }

    setIsCheckingReadability(true);
    
    try {
      const results = await getReadabilityScore(data.professional_summary);
      setReadabilityResults(results);
      addNotification({
        type: 'success',
        title: 'Readability Analysis Complete',
        message: `Readability score: ${results.score}/100 (${results.level})`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis Failed',
        message: 'Failed to analyze readability. Please try again.',
      });
    } finally {
      setIsCheckingReadability(false);
    }
  };

  const wordCount = data?.professional_summary?.split(/\s+/).filter(word => word.length > 0).length || 0;
  const charCount = data?.professional_summary?.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="sm:w-12 sm:h-12 w-1/6 h-14 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">2</span>
          </div>
          <div className="w-5/6">
            <h3 className="sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Professional Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
              Write a compelling summary that highlights your key strengths and achievements
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4">
          <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Keep your summary concise (2-3 sentences) and focus on your most relevant skills and achievements. Use action verbs and quantify your accomplishments when possible.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Professional Summary
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {wordCount} words • {charCount} characters
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Write a brief overview of your professional background, key skills, and career objectives
          </p>
        </div>

        <div className="space-y-4">
          {/* Textarea Field */}
          <div className="relative">
            <div className={`group relative bg-white dark:bg-gray-800 border-2 rounded-md overflow-hidden transition-all duration-300 ${
              validationErrors.professionalSummary
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-200 dark:border-gray-600 focus-within:border-[var(--primary-color)] dark:focus-within:border-[var(--primary-color)]"
            }`}>
              <textarea
                ref={textareaRef}
                placeholder="Write a compelling professional summary highlighting your key strengths and career objectives..."
                className="relative bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-xs outline-none text-sm w-full px-4 py-4 overflow-hidden"
                value={data?.professional_summary || ''}
                onChange={(e) => handleChange(e.target.value)}
                rows={7}
              />
            </div>
            
            {validationErrors.professionalSummary && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span>⚠️</span>
                Professional summary is required
              </p>
            )}
          </div>

          {/* AI Enhance Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white rounded-md text-xs font-medium">
                  <SparklesIcon className="w-3 h-3" />
                  AI Enhance
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Smart AI Enhancement
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {wordCount > 75 
                      ? "Summarize long text to recommended length" 
                      : wordCount < 30 
                      ? "Enhance short text with impact words" 
                      : "Optimize grammar and ATS compatibility"
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Combined AI Features Button */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowAIMenu(!showAIMenu)}
                  disabled={isEnhancing || isCheckingGrammar || !data?.professional_summary?.trim()}
                  className="group relative w-full flex items-center justify-between gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4" />
                    <span>
                      {isEnhancing ? "Enhancing..." : isCheckingGrammar ? "Checking..." : "AI Enhance"}
                    </span>
                  </div>
                  <ChevronDown className={`relative z-10 h-4 w-4 transition-transform duration-300 ${showAIMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showAIMenu && (
                  <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-1">
                      {/* Enhance with AI */}
                      {(() => {
                        const featureId = 'summary-enhancement';
                        const hasAccess = isSubscribed && hasFeatureAccess(subscriptionTier, featureId);
                        const requiredTier = getTierForFeature(featureId);
                        const tierNames = { 'basic': 'Basic', 'pro': 'Pro', 'enterprise': 'Enterprise' };
                        const tierColors = {
                          'basic': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                          'pro': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                          'enterprise': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        };

                        if (hasAccess) {
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAIMenu(false);
                                handleAIEnhance();
                              }}
                              disabled={isEnhancing || !data?.professional_summary?.trim()}
                              className="w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <SparklesIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <div className="flex-1">
                                <div className="font-semibold">Enhance with AI</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {wordCount > 75 
                                    ? "Summarize long text to recommended length" 
                                    : wordCount < 30 
                                    ? "Enhance short text with impact words" 
                                    : "Optimize grammar and ATS compatibility"}
                                </div>
                              </div>
                              {isEnhancing && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-start gap-3 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0 mt-0.5">
                              <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="mb-1 flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Enhance with AI
                                </span>
                                {requiredTier && (
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tierColors[requiredTier] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                                    {tierNames[requiredTier] || requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                {wordCount > 75 
                  ? "Summarize long text to recommended length" 
                  : wordCount < 30 
                  ? "Enhance short text with impact words" 
                                  : "Optimize grammar and ATS compatibility"}
                              </p>
                            </div>
                            <Link
                              to="/dashboard/subscription"
                              onClick={() => setShowAIMenu(false)}
                              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md flex-shrink-0 whitespace-nowrap"
                            >
                              <span>
                                {(() => {
                                  // Free account → Subscribe for Pro and Enterprise
                                  if (!isSubscribed || !subscriptionTier || subscriptionTier === 'free') {
                                    return 'Subscribe';
                                  }
                                  // Basic tier → Upgrade for Pro features
                                  if (subscriptionTier === 'basic' && requiredTier === 'pro') {
                                    return 'Upgrade';
                                  }
                                  // Pro tier → Upgrade for Enterprise features
                                  if (subscriptionTier === 'pro' && requiredTier === 'enterprise') {
                                    return 'Upgrade';
                                  }
                                  // All other cases → Subscribe
                                  return 'Subscribe';
                                })()}
                              </span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        );
                      })()}

                      {/* Grammar Check */}
                      {(() => {
                        const featureId = 'grammar-check';
                        const hasAccess = isSubscribed && hasFeatureAccess(subscriptionTier, featureId);
                        const requiredTier = getTierForFeature(featureId);
                        const tierNames = { 'basic': 'Basic', 'pro': 'Pro', 'enterprise': 'Enterprise' };
                        const tierColors = {
                          'basic': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                          'pro': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                          'enterprise': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        };

                        if (hasAccess) {
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAIMenu(false);
                                handleGrammarCheck();
                              }}
                              disabled={isCheckingGrammar || !data?.professional_summary?.trim()}
                              className="w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <div className="flex-1">
                                <div className="font-semibold">Grammar Check</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Check grammar and spelling
                                </div>
                              </div>
                              {isCheckingGrammar && <Loader2 className="h-4 w-4 animate-spin text-green-600" />}
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-start gap-3 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0 mt-0.5">
                              <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="mb-1 flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Grammar Check
                                </span>
                                {requiredTier && (
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tierColors[requiredTier] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                                    {tierNames[requiredTier] || requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Check grammar and spelling
                              </p>
                            </div>
                            <Link
                              to="/dashboard/subscription"
                              onClick={() => setShowAIMenu(false)}
                              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md flex-shrink-0 whitespace-nowrap"
                            >
                              <span>
                                {(() => {
                                  // Free account → Subscribe for Pro and Enterprise
                                  if (!isSubscribed || !subscriptionTier || subscriptionTier === 'free') {
                                    return 'Subscribe';
                                  }
                                  // Basic tier → Upgrade for Pro features
                                  if (subscriptionTier === 'basic' && requiredTier === 'pro') {
                                    return 'Upgrade';
                                  }
                                  // Pro tier → Upgrade for Enterprise features
                                  if (subscriptionTier === 'pro' && requiredTier === 'enterprise') {
                                    return 'Upgrade';
                                  }
                                  // All other cases → Subscribe
                                  return 'Subscribe';
                                })()}
                              </span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Readability Score - Separate button */}
                <AIFeatureButton
                  label={isCheckingReadability ? "Analyzing..." : "Readability Score"}
                  featureId="readability-score"
                  description="Get readability analysis"
                  onClick={handleReadabilityCheck}
                  disabled={isCheckingReadability || !data?.professional_summary?.trim()}
                />
              
              {!isSubscribed && (
                <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 text-xs dark:border-blue-900/30 dark:bg-blue-900/10">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">💡 Unlock AI Features:</span> Subscribe to enable AI-powered content suggestions, smart rewriting, and ATS optimization. 
                    <Link to="/dashboard/subscription" className="ml-1 font-semibold text-[var(--primary-color)] underline underline-offset-2 hover:no-underline">
                      Get 50% off your first month
                    </Link>
                  </p>
                </div>
              )}
              
              {grammarResults && grammarResults.errors > 0 && (
                <div className="mt-2 rounded-md border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-900/10">
                  <p className="text-xs font-semibold text-green-900 dark:text-green-300 mb-1">
                    Grammar corrections applied:
                  </p>
                  {grammarResults.suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-xs text-green-800 dark:text-green-200">{suggestion}</p>
                  ))}
                </div>
              )}
              
              {readabilityResults && (
                <div className="mt-2 rounded-md border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/10">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Readability Score: {readabilityResults.score}/100 ({readabilityResults.level})
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mb-1">
                    Avg words per sentence: {readabilityResults.avgWordsPerSentence}
                  </p>
                  {readabilityResults.suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-xs text-blue-800 dark:text-blue-200">• {suggestion}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Character and Word Count Guidelines */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className={charCount > 500 ? 'text-orange-500' : 'text-green-500'}>
                {charCount}/500 characters
              </span>
              <span className={wordCount > 75 ? 'text-orange-500' : 'text-green-500'}>
                {wordCount}/75 words recommended
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400">Ideal length: 2-3 sentences</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummary;