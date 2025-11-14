import React, { useState, useCallback, useEffect, useRef } from "react";
import InputField from "../../../components/InputField";
import { Plus, Trash2, Languages, Award, Star } from "lucide-react";

const SkillsAndLanguagesForm = ({ data, onChange, onValidationChange }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const validationRef = useRef();

  // Language proficiency levels
  const proficiencyLevels = [
    { value: "native", label: "Native" },
    { value: "fluent", label: "Fluent" },
    { value: "advanced", label: "Advanced" },
    { value: "intermediate", label: "Intermediate" },
    { value: "basic", label: "Basic" },
  ];

  // Add new skill
  const addSkill = () => {
    const newSkills = [...(data.skills || []), ""];
    onChange({ ...data, skills: newSkills });
  };

  // Update skill
  const updateSkill = (index, value) => {
    const newSkills = [...(data.skills || [])];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };

  // Remove skill
  const removeSkill = (index) => {
    const newSkills = [...(data.skills || [])];
    newSkills.splice(index, 1);
    onChange({ ...data, skills: newSkills });
  };

  // Add new soft skill
  const addSoftSkill = () => {
    const newSoftSkills = [...(data.soft_skills || []), ""];
    onChange({ ...data, soft_skills: newSoftSkills });
  };

  // Update soft skill
  const updateSoftSkill = (index, value) => {
    const newSoftSkills = [...(data.soft_skills || [])];
    newSoftSkills[index] = value;
    onChange({ ...data, soft_skills: newSoftSkills });
  };

  // Remove soft skill
  const removeSoftSkill = (index) => {
    const newSoftSkills = [...(data.soft_skills || [])];
    newSoftSkills.splice(index, 1);
    onChange({ ...data, soft_skills: newSoftSkills });
  };

  // Add new language
  const addLanguage = () => {
    const newLanguages = [...(data.languages || []), { language: "", proficiency: "intermediate" }];
    onChange({ ...data, languages: newLanguages });
  };

  // Update language
  const updateLanguage = (index, field, value) => {
    const newLanguages = [...(data.languages || [])];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    onChange({ ...data, languages: newLanguages });
  };

  // Remove language
  const removeLanguage = (index) => {
    const newLanguages = [...(data.languages || [])];
    newLanguages.splice(index, 1);
    onChange({ ...data, languages: newLanguages });
  };

  // Validate fields - Skills & Languages section is optional
  const validateAllFields = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    // This section is optional, so always return true
    // Users can skip adding skills and languages if they prefer
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
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="sm:w-12 sm:h-12 w-1/6 h-14 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">6</span>
          </div>
          <div className="w-5/6">
            <h3 className="sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Skills & Languages
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
              Showcase your technical skills and language proficiency
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Add relevant skills for your profession. For languages, be honest about your proficiency level. This section is optional - you can skip it if you prefer.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Technical Skills
            </h4>
          </div>
          
          <div className="space-y-4">
            {(data.skills || []).map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <InputField
                    type="text"
                    icon="code"
                    width="w-full"
                    placeholder="JavaScript, Python, Project Management, Adobe Photoshop"
                    value={skill}
                    onChange={(value) => updateSkill(index, value)}
                    hasError={validationErrors.skills}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addSkill}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Soft Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Soft Skills
            </h4>
          </div>
          
          <div className="space-y-4">
            {(data.soft_skills || []).map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <InputField
                    type="text"
                    icon="user"
                    width="w-full"
                    placeholder="Leadership, Communication, Problem Solving, Teamwork"
                    value={skill}
                    onChange={(value) => updateSoftSkill(index, value)}
                    hasError={validationErrors.skills}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSoftSkill(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addSoftSkill}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Soft Skill
            </button>
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Language Proficiency
            </h4>
          </div>
          
          <div className="space-y-4">
            {(data.languages || []).map((language, index) => (
              <div key={index} className="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Language
                    </label>
                    <InputField
                      type="text"
                      icon="globe"
                      width="w-full"
                      placeholder="English, Spanish, French"
                      value={language.language || ""}
                      onChange={(value) => updateLanguage(index, "language", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Proficiency Level
                    </label>
                    <div className="relative">
                      <select
                        value={language.proficiency || "intermediate"}
                        onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent appearance-none cursor-pointer"
                      >
                        {proficiencyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addLanguage}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAndLanguagesForm;
