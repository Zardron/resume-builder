import React, { useState, useCallback, useEffect, useRef } from "react";
import InputField from "../../../components/InputField";
import { 
  Plus, 
  Trash2, 
  Briefcase, 
  MapPin, 
  Calendar, 
  FileText,
  Building2,
  ChevronDown
} from "lucide-react";

const ExperienceForm = ({ data, onChange, onValidationChange }) => {
  const [experiences, setExperiences] = useState(data || []);
  const [validationErrors, setValidationErrors] = useState({});
  const [expandedExperiences, setExpandedExperiences] = useState(new Set());
  const validationRef = useRef();

  // Initialize with one empty experience if none exist
  useEffect(() => {
    if (!experiences || experiences.length === 0) {
      const initialExperience = {
        id: Date.now(),
        position: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: ""
      };
      setExperiences([initialExperience]);
      setExpandedExperiences(new Set([initialExperience.id]));
    }
  }, []);

  // Keep the latest onChange handler without retriggering downstream effects
  const latestOnChangeRef = useRef(onChange);

  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  // Update parent component when experiences change
  useEffect(() => {
    latestOnChangeRef.current?.(experiences);
  }, [experiences]);

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      position: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    };
    setExperiences([...experiences, newExperience]);
    setExpandedExperiences(prev => new Set([...prev, newExperience.id]));
  };

  // Remove experience
  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
      setExpandedExperiences(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Update experience field
  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => {
      if (exp.id === id) {
        const updatedExp = { ...exp, [field]: value };
        
        // If current position is enabled, clear the end date
        if (field === 'is_current' && value === true) {
          updatedExp.end_date = '';
        }
        
        return updatedExp;
      }
      return exp;
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[`${id}-${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${id}-${field}`];
        return newErrors;
      });
    }
  };

  // Toggle experience expansion
  const toggleExpansion = (id) => {
    setExpandedExperiences(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };


  // Validate fields
  const validateField = (experienceId, field, value) => {
    const requiredFields = ['position', 'company', 'start_date'];
    const isEmpty = !value || value.trim() === '';
    
    if (requiredFields.includes(field) && isEmpty) {
      setValidationErrors(prev => ({ ...prev, [`${experienceId}-${field}`]: true }));
      return false;
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${experienceId}-${field}`];
        return newErrors;
      });
      return true;
    }
  };

  // Validate all experiences
  const validateAllExperiences = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    experiences.forEach(exp => {
      const requiredFields = ['position', 'company', 'start_date'];
      requiredFields.forEach(field => {
        const value = exp[field];
        if (!value || value.trim() === '') {
          errors[`${exp.id}-${field}`] = true;
          hasErrors = true;
        }
      });
    });

    setValidationErrors(errors);
    return !hasErrors;
  }, [experiences]);

  // Store validation function in ref and expose to parent
  useEffect(() => {
    validationRef.current = validateAllExperiences;
  }, [validateAllExperiences]);

  // Expose validation function to parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(() => validationRef.current());
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">3</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Work Experience
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Add your professional work experience to showcase your career journey
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Fields marked with <span className="text-red-500 font-semibold">*</span> are required. 
            Be specific about your role and responsibilities.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {experiences.map((experience, index) => {
          const isExpanded = expandedExperiences.has(experience.id);
          const isLast = index === experiences.length - 1;
          
          return (
            <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm">
              {/* Experience Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {experience.position || `Experience ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {experience.company || 'Company Name'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpansion(experience.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`} />
                    </button>
                    {experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(experience.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience Form */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Job Title</span>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <InputField
                        type="text"
                        icon="briefcase"
                        width="w-full"
                        placeholder="Marketing Manager"
                        value={experience.position}
                        onChange={(value) => updateExperience(experience.id, 'position', value)}
                        hasError={validationErrors[`${experience.id}-position`]}
                        name={`position-${experience.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Company</span>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <InputField
                        type="text"
                        icon="building"
                        width="w-full"
                        placeholder="ABC Corporation"
                        value={experience.company}
                        onChange={(value) => updateExperience(experience.id, 'company', value)}
                        hasError={validationErrors[`${experience.id}-company`]}
                        name={`company-${experience.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Location</span>
                      </label>
                      <InputField
                        type="text"
                        icon="map-pin"
                        width="w-full"
                        placeholder="Cebu, Philippines"
                        value={experience.location}
                        onChange={(value) => updateExperience(experience.id, 'location', value)}
                        name={`location-${experience.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Start Date</span>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <InputField
                        type="month"
                        icon="calendar"
                        width="w-full"
                        placeholder="Start Date"
                        value={experience.start_date}
                        onChange={(value) => updateExperience(experience.id, 'start_date', value)}
                        hasError={validationErrors[`${experience.id}-start_date`]}
                        name={`start_date-${experience.id}`}
                      />
                    </div>

                    {!experience.is_current && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                          <span className="text-sm font-medium">End Date</span>
                        </label>
                        <InputField
                          type="month"
                          icon="calendar"
                          width="w-full"
                        placeholder="End Date"
                        value={experience.end_date}
                        onChange={(value) => updateExperience(experience.id, 'end_date', value)}
                        name={`end_date-${experience.id}`}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <span className="text-sm font-medium">Current Position</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={experience.is_current}
                            onChange={(e) => updateExperience(experience.id, 'is_current', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-color)] peer-checked:to-[var(--accent-color)] transition-all duration-300 ease-in-out" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          I currently work here
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                      <span className="text-sm font-medium">Job Description</span>
                    </label>
                    <textarea
                      placeholder="Describe your role and responsibilities..."
                      value={experience.description}
                      onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                      className="w-full h-24 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-xs outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Experience Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Another Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;