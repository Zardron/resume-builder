import React, { useState, useCallback, useEffect, useRef } from "react";
import InputField from "../../../components/InputField";
import {
  Plus,
  Trash2,
  Award,
  Star,
  Heart,
  Calendar,
  MapPin,
} from "lucide-react";

const AdditionalSectionsForm = ({ data, onChange, onValidationChange }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const validationRef = useRef();

  // Add new certification
  const addCertification = () => {
    const newCertifications = [
      ...(data.certifications || []),
      { name: "", issuer: "", date: "", credential_id: "" },
    ];
    onChange({ ...data, certifications: newCertifications });
  };

  // Update certification
  const updateCertification = (index, field, value) => {
    const newCertifications = [...(data.certifications || [])];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    onChange({ ...data, certifications: newCertifications });
  };

  // Remove certification
  const removeCertification = (index) => {
    const newCertifications = [...(data.certifications || [])];
    newCertifications.splice(index, 1);
    onChange({ ...data, certifications: newCertifications });
  };

  // Add new achievement
  const addAchievement = () => {
    const newAchievements = [
      ...(data.achievements || []),
      { title: "", description: "", date: "" },
    ];
    onChange({ ...data, achievements: newAchievements });
  };

  // Update achievement
  const updateAchievement = (index, field, value) => {
    const newAchievements = [...(data.achievements || [])];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    onChange({ ...data, achievements: newAchievements });
  };

  // Remove achievement
  const removeAchievement = (index) => {
    const newAchievements = [...(data.achievements || [])];
    newAchievements.splice(index, 1);
    onChange({ ...data, achievements: newAchievements });
  };

  // Add new volunteer work
  const addVolunteerWork = () => {
    const newVolunteerWork = [
      ...(data.volunteer_work || []),
      {
        organization: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
      },
    ];
    onChange({ ...data, volunteer_work: newVolunteerWork });
  };

  // Update volunteer work
  const updateVolunteerWork = (index, field, value) => {
    const newVolunteerWork = [...(data.volunteer_work || [])];
    newVolunteerWork[index] = { ...newVolunteerWork[index], [field]: value };
    onChange({ ...data, volunteer_work: newVolunteerWork });
  };

  // Remove volunteer work
  const removeVolunteerWork = (index) => {
    const newVolunteerWork = [...(data.volunteer_work || [])];
    newVolunteerWork.splice(index, 1);
    onChange({ ...data, volunteer_work: newVolunteerWork });
  };

  // Validate fields - this section is optional, so always return true
  const validateAllFields = useCallback(() => {
    return true; // Additional sections are optional
  }, []);

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
          <div className="sm:w-12 sm:h-12 w-1/6 h-14 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">7</span>
          </div>
          <div className="w-5/6">
            <h3 className="sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Additional Sections
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
              Boost your resume by adding this to your resume.
            </p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            <span className="font-semibold">💡 Tip:</span> These sections are
            optional but can help differentiate you from other candidates.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Certifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Certifications
            </h4>
          </div>

          <div className="space-y-4">
            {(data.certifications || []).map((cert, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Certification Name
                  </label>
                  <InputField
                    type="text"
                    icon="award"
                    width="w-full"
                    placeholder="AWS Certified Solutions Architect"
                    value={cert.name || ""}
                    onChange={(value) =>
                      updateCertification(index, "name", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Issuing Organization
                  </label>
                  <InputField
                    type="text"
                    icon="building"
                    width="w-full"
                    placeholder="Amazon Web Services"
                    value={cert.issuer || ""}
                    onChange={(value) =>
                      updateCertification(index, "issuer", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Date Obtained
                  </label>
                  <InputField
                    type="month"
                    icon="calendar"
                    width="w-full"
                    placeholder=""
                    value={cert.date || ""}
                    onChange={(value) =>
                      updateCertification(index, "date", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Credential ID (Optional)
                  </label>
                  <InputField
                    type="text"
                    icon="hash"
                    width="w-full"
                    placeholder="AWS-123456"
                    value={cert.credential_id || ""}
                    onChange={(value) =>
                      updateCertification(index, "credential_id", value)
                    }
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCertification}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Achievements & Awards
            </h4>
          </div>

          <div className="space-y-4">
            {(data.achievements || []).map((achievement, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Achievement Title
                  </label>
                  <InputField
                    type="text"
                    icon="star"
                    width="w-full"
                    placeholder="Employee of the Year 2023"
                    value={achievement.title || ""}
                    onChange={(value) =>
                      updateAchievement(index, "title", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={achievement.description || ""}
                    onChange={(e) =>
                      updateAchievement(index, "description", e.target.value)
                    }
                    placeholder="Describe the achievement and its impact..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-xs focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Date (Optional)
                  </label>
                  <InputField
                    type="month"
                    icon="calendar"
                    width="w-full"
                    placeholder=""
                    value={achievement.date || ""}
                    onChange={(value) =>
                      updateAchievement(index, "date", value)
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAchievement}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Achievement
            </button>
          </div>
        </div>

        {/* Volunteer Work Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Volunteer Work
            </h4>
          </div>

          <div className="space-y-4">
            {(data.volunteer_work || []).map((volunteer, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Organization
                  </label>
                  <InputField
                    type="text"
                    icon="building"
                    width="w-full"
                    placeholder="Red Cross, Local Food Bank"
                    value={volunteer.organization || ""}
                    onChange={(value) =>
                      updateVolunteerWork(index, "organization", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Position/Role
                  </label>
                  <InputField
                    type="text"
                    icon="user"
                    width="w-full"
                    placeholder="Volunteer Coordinator, Event Organizer"
                    value={volunteer.position || ""}
                    onChange={(value) =>
                      updateVolunteerWork(index, "position", value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={volunteer.description || ""}
                    onChange={(e) =>
                      updateVolunteerWork(index, "description", e.target.value)
                    }
                    placeholder="Describe your volunteer work and impact..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-xs focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Start Date
                  </label>
                  <InputField
                    type="month"
                    icon="calendar"
                    width="w-full"
                    placeholder=""
                    value={volunteer.start_date || ""}
                    onChange={(value) =>
                      updateVolunteerWork(index, "start_date", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    End Date
                  </label>
                  <div className="space-y-2">
                    <InputField
                      type="month"
                      icon="calendar"
                      width="w-full"
                      placeholder=""
                      value={volunteer.end_date || ""}
                      onChange={(value) =>
                        updateVolunteerWork(index, "end_date", value)
                      }
                      disabled={volunteer.is_current}
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={volunteer.is_current || false}
                        onChange={(e) =>
                          updateVolunteerWork(
                            index,
                            "is_current",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Currently volunteering
                      </span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVolunteerWork(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVolunteerWork}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Volunteer Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalSectionsForm;
