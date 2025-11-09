import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SparklesIcon, Loader2, FileText, RefreshCw } from 'lucide-react';

const ProfessionalSummary = ({
  data,
  onChange,
  onValidationChange,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const validationRef = useRef();
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
    if (!data?.professional_summary?.trim()) {
      return;
    }

    setIsEnhancing(true);
    
    try {
      // Simulate AI enhancement - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentSummary = data?.professional_summary;
      const currentWordCount = currentSummary.split(/\s+/).filter(word => word.length > 0).length;
      const profession = data?.personal_info?.profession || 'professional';
      
      let enhancedSummary;
      
      if (currentWordCount > 75) {
        // Summarize if too long
        enhancedSummary = `Experienced ${profession} with proven expertise in delivering exceptional results. ${currentSummary.split('.').slice(0, 2).join('.')}. Committed to driving innovation and achieving organizational excellence through strategic leadership and continuous improvement.`;
      } else if (currentWordCount < 30) {
        // Enhance if too short
        enhancedSummary = `Experienced ${profession} with a proven track record of delivering exceptional results. ${currentSummary} Skilled in strategic planning, team leadership, and driving organizational growth through innovative solutions. Committed to excellence and continuous improvement in all professional endeavors.`;
      } else {
        // Optimize if close to recommended length
        enhancedSummary = `Experienced ${profession} with a proven track record of delivering exceptional results. ${currentSummary} Skilled in strategic planning, team leadership, and driving organizational growth through innovative solutions. Committed to excellence and continuous improvement in all professional endeavors.`;
      }
      
      onChange({ ...data, professionalSummary: enhancedSummary });
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const wordCount = data?.professional_summary?.split(/\s+/).filter(word => word.length > 0).length || 0;
  const charCount = data?.professional_summary?.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">2</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Professional Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Write a compelling summary that highlights your key strengths and achievements
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
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

          {/* AI Enhance Button */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white rounded-lg text-xs font-medium">
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
            
            <button
              type="button"
              onClick={handleAIEnhance}
              disabled={isEnhancing || !data?.professional_summary?.trim()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isEnhancing || !data?.professional_summary?.trim()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white hover:opacity-90 hover:scale-105 shadow-lg'
              }`}
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Enhance
                </>
              )}
            </button>
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