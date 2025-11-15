import React, { useState, useCallback, useEffect, useRef } from "react";
import InputField from "../../../components/InputField";
import { 
  Plus, 
  Trash2, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  FileText,
  Building2,
  ChevronDown
} from "lucide-react";
import referenceData from "../../../util/referenceData.json";

// Import degree programs and schools from reference data
const PHILIPPINE_DEGREES = referenceData.education.degrees;
const PHILIPPINE_SCHOOLS = referenceData.education.schools;

const EducationForm = ({ data, onChange, onValidationChange }) => {
  const [educationList, setEducationList] = useState(data || []);
  const [validationErrors, setValidationErrors] = useState({});
  const [expandedEducation, setExpandedEducation] = useState(new Set());
  const [showDegreeDropdown, setShowDegreeDropdown] = useState({});
  const [degreeSearchTerm, setDegreeSearchTerm] = useState({});
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState({});
  const [institutionSearchTerm, setInstitutionSearchTerm] = useState({});
  const validationRef = useRef();
  const dropdownRef = useRef({});
  const institutionDropdownRef = useRef({});
  const latestOnChangeRef = useRef(onChange);

  // Initialize with one empty education if none exist
  useEffect(() => {
    if (!educationList || educationList.length === 0) {
      const initialEducation = {
        id: Date.now(),
        degree: "",
        institution: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: ""
      };
      setEducationList([initialEducation]);
      setExpandedEducation(new Set([initialEducation.id]));
    }
  }, []);

  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  // Update parent component when education list changes
  useEffect(() => {
    latestOnChangeRef.current?.(educationList);
  }, [educationList]);

  // Add new education
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      institution: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    };
    setEducationList([...educationList, newEducation]);
    setExpandedEducation(prev => new Set([...prev, newEducation.id]));
  };

  // Remove education
  const removeEducation = (id) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter(edu => edu.id !== id));
      setExpandedEducation(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Update education field
  const updateEducation = (id, field, value) => {
    setEducationList(educationList.map(edu => {
      if (edu.id === id) {
        const updatedEdu = { ...edu, [field]: value };
        
        // If currently studying is enabled, clear the end date
        if (field === 'is_current' && value === true) {
          updatedEdu.end_date = '';
        }
        
        return updatedEdu;
      }
      return edu;
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

  // Toggle education expansion
  const toggleExpansion = (id) => {
    setExpandedEducation(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle degree selection from dropdown
  const handleDegreeSelect = (id, degree) => {
    updateEducation(id, 'degree', degree);
    setShowDegreeDropdown(prev => ({ ...prev, [id]: false }));
    setDegreeSearchTerm(prev => ({ ...prev, [id]: '' }));
  };

  // Filter degrees based on search term
  const getFilteredDegrees = (searchTerm) => {
    if (!searchTerm) return PHILIPPINE_DEGREES;
    const term = searchTerm.toLowerCase();
    return PHILIPPINE_DEGREES.filter(degree => 
      degree.toLowerCase().includes(term)
    );
  };

  // Handle institution selection from dropdown
  const handleInstitutionSelect = (id, institution) => {
    updateEducation(id, 'institution', institution);
    setShowInstitutionDropdown(prev => ({ ...prev, [id]: false }));
    setInstitutionSearchTerm(prev => ({ ...prev, [id]: '' }));
  };

  // Filter institutions based on search term
  const getFilteredInstitutions = (searchTerm) => {
    if (!searchTerm) return PHILIPPINE_SCHOOLS;
    const term = searchTerm.toLowerCase();
    return PHILIPPINE_SCHOOLS.filter(school => 
      school.toLowerCase().includes(term)
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRef.current).forEach(id => {
        if (dropdownRef.current[id] && !dropdownRef.current[id].contains(event.target)) {
          setShowDegreeDropdown(prev => ({ ...prev, [id]: false }));
        }
      });
      Object.keys(institutionDropdownRef.current).forEach(id => {
        if (institutionDropdownRef.current[id] && !institutionDropdownRef.current[id].contains(event.target)) {
          setShowInstitutionDropdown(prev => ({ ...prev, [id]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Validate fields
  const validateField = (educationId, field, value) => {
    const requiredFields = ['degree', 'institution', 'start_date'];
    const isEmpty = !value || value.trim() === '';
    
    if (requiredFields.includes(field) && isEmpty) {
      setValidationErrors(prev => ({ ...prev, [`${educationId}-${field}`]: true }));
      return false;
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${educationId}-${field}`];
        return newErrors;
      });
      return true;
    }
  };

  // Validate all education entries
  const validateAllEducation = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    educationList.forEach(edu => {
      const requiredFields = ['degree', 'institution', 'start_date'];
      requiredFields.forEach(field => {
        const value = edu[field];
        if (!value || value.trim() === '') {
          errors[`${edu.id}-${field}`] = true;
          hasErrors = true;
        }
      });
    });

    setValidationErrors(errors);
    return !hasErrors;
  }, [educationList]);

  // Store validation function in ref and expose to parent
  useEffect(() => {
    validationRef.current = validateAllEducation;
  }, [validateAllEducation]);

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
          <div className="sm:w-12 sm:h-12 w-1/6 h-14 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">4</span>
          </div>
          <div className="w-5/6">
            <h3 className="sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Education
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
              Add your educational background and academic achievements
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4">
          <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Fields marked with <span className="text-red-500 font-semibold">*</span> are required. 
            Include relevant coursework, honors, or academic achievements.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {educationList.map((education, index) => {
          const isExpanded = expandedEducation.has(education.id);
          const isLast = index === educationList.length - 1;
          
          return (
            <div key={education.id} className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm">
              {/* Education Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {education.degree || `Education ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {education.institution || 'Institution Name'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpansion(education.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`} />
                    </button>
                    {educationList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(education.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Education Form */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Degree / Qualification
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative" ref={el => dropdownRef.current[education.id] = el}>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                            <GraduationCap className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="Bachelor of Science in Computer Science"
                            value={education.degree}
                            onChange={(e) => {
                              updateEducation(education.id, 'degree', e.target.value);
                              setDegreeSearchTerm(prev => ({ ...prev, [education.id]: e.target.value }));
                              setShowDegreeDropdown(prev => ({ ...prev, [education.id]: true }));
                            }}
                            onFocus={() => setShowDegreeDropdown(prev => ({ ...prev, [education.id]: true }))}
                            className={`w-full px-4 py-3 pl-11 pr-12 bg-white dark:bg-gray-800 border-2 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] transition-colors duration-200 ${
                              validationErrors[`${education.id}-degree`] 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowDegreeDropdown(prev => ({ ...prev, [education.id]: !prev[education.id] }))}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
                            aria-label="Toggle dropdown"
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showDegreeDropdown[education.id] ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                        {/* Dropdown */}
                        {showDegreeDropdown[education.id] && (
                          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
                            <div className="p-2">
                              {getFilteredDegrees(degreeSearchTerm[education.id] || education.degree).length > 0 ? (
                                getFilteredDegrees(degreeSearchTerm[education.id] || education.degree).map((degree, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleDegreeSelect(education.id, degree)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-[var(--primary-color)] hover:bg-opacity-10 rounded-md transition-colors duration-150"
                                  >
                                    {degree}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                  No matches found. You can still type your own degree.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        School / Institution
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative" ref={el => institutionDropdownRef.current[education.id] = el}>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                            <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <input
                            type="text"
                            placeholder="University of the Philippines"
                            value={education.institution}
                            onChange={(e) => {
                              updateEducation(education.id, 'institution', e.target.value);
                              setInstitutionSearchTerm(prev => ({ ...prev, [education.id]: e.target.value }));
                              setShowInstitutionDropdown(prev => ({ ...prev, [education.id]: true }));
                            }}
                            onFocus={() => setShowInstitutionDropdown(prev => ({ ...prev, [education.id]: true }))}
                            className={`w-full px-4 py-3 pl-11 pr-12 bg-white dark:bg-gray-800 border-2 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] transition-colors duration-200 ${
                              validationErrors[`${education.id}-institution`] 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowInstitutionDropdown(prev => ({ ...prev, [education.id]: !prev[education.id] }))}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
                            aria-label="Toggle dropdown"
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showInstitutionDropdown[education.id] ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                        {/* Dropdown */}
                        {showInstitutionDropdown[education.id] && (
                          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
                            <div className="p-2">
                              {getFilteredInstitutions(institutionSearchTerm[education.id] || education.institution).length > 0 ? (
                                getFilteredInstitutions(institutionSearchTerm[education.id] || education.institution).map((school, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleInstitutionSelect(education.id, school)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-[var(--primary-color)] hover:bg-opacity-10 rounded-md transition-colors duration-150"
                                  >
                                    {school}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                  No matches found. You can still type your own institution.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <InputField
                        type="text"
                        icon="map-pin"
                        width="w-full"
                        placeholder="Cebu, Philippines"
                        value={education.location}
                        onChange={(value) => updateEducation(education.id, 'location', value)}
                        name={`location-${education.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Start Date
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <InputField
                        type="month"
                        icon="calendar"
                        width="w-full"
                        placeholder="Start Date"
                        value={education.start_date}
                        onChange={(value) => updateEducation(education.id, 'start_date', value)}
                        hasError={validationErrors[`${education.id}-start_date`]}
                        name={`start_date-${education.id}`}
                      />
                    </div>

                    {!education.is_current && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          End Date
                        </label>
                        <InputField
                          type="month"
                          icon="calendar"
                          width="w-full"
                          placeholder="End Date"
                          value={education.end_date}
                          onChange={(value) => updateEducation(education.id, 'end_date', value)}
                          name={`end_date-${education.id}`}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Currently Studying
                      </label>
                      <div className="flex items-center gap-3 h-[48px]">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={education.is_current}
                            onChange={(e) => updateEducation(education.id, 'is_current', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-color)] peer-checked:to-[var(--accent-color)] transition-all duration-300 ease-in-out" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
                        </label>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          I currently study here
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description / Achievements */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description / Achievements
                    </label>
                    <textarea
                      placeholder="Describe your coursework, honors, GPA, or relevant achievements..."
                      value={education.description}
                      onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                      className="w-full h-24 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none focus:border-[var(--primary-color)] dark:focus:border-[var(--primary-color)] transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Education Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Another Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;

