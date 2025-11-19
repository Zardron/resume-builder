import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, Loader2, FileText, RefreshCw } from 'lucide-react';
import AIFeatureButton from '../../../components/AIFeatureButton';
import { useApp } from '../../../contexts/AppContext';
import { enhanceProfessionalSummary, checkGrammarAndSpelling, getReadabilityScore } from '../../../utils/aiService';

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
  const validationRef = useRef();
  const { isSubscribed, addNotification } = useApp();
  const textareaRef = useRef();

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
              <AIFeatureButton
                label="Enhance with AI"
                description={wordCount > 75 
                  ? "Summarize long text to recommended length" 
                  : wordCount < 30 
                  ? "Enhance short text with impact words" 
                  : "Optimize grammar and ATS compatibility"
                }
                onClick={handleAIEnhance}
                disabled={isEnhancing || !data?.professional_summary?.trim()}
              />
              
              <div className="grid grid-cols-1 gap-2">
                <AIFeatureButton
                  label={isCheckingGrammar ? "Checking..." : "Grammar Check"}
                  description="Check grammar and spelling"
                  onClick={handleGrammarCheck}
                  disabled={isCheckingGrammar || !data?.professional_summary?.trim()}
                />
                
                <AIFeatureButton
                  label={isCheckingReadability ? "Analyzing..." : "Readability Score"}
                  description="Get readability analysis"
                  onClick={handleReadabilityCheck}
                  disabled={isCheckingReadability || !data?.professional_summary?.trim()}
                />
              </div>
              
              {!isSubscribed && (
                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs dark:border-blue-900/30 dark:bg-blue-900/10">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">💡 Unlock AI Features:</span> Subscribe to enable AI-powered content suggestions, smart rewriting, and ATS optimization. 
                    <Link to="/dashboard/subscription" className="ml-1 font-semibold text-[var(--primary-color)] underline underline-offset-2 hover:no-underline">
                      Get 50% off your first month
                    </Link>
                  </p>
                </div>
              )}
              
              {grammarResults && grammarResults.errors > 0 && (
                <div className="mt-2 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-900/10">
                  <p className="text-xs font-semibold text-green-900 dark:text-green-300 mb-1">
                    Grammar corrections applied:
                  </p>
                  {grammarResults.suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-xs text-green-800 dark:text-green-200">{suggestion}</p>
                  ))}
                </div>
              )}
              
              {readabilityResults && (
                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/10">
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