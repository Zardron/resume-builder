import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown, Type } from "lucide-react";
import { DEFAULT_FONT_SIZES } from "../../utils/fontSizeUtils";

const FONT_SIZE_OPTIONS = [
  { value: "extra_small", label: "Extra Small" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const SectionFontSizeDropdown = ({
  activeSectionId,
  sectionFontSizes,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sectionGroups = useMemo(() => {
    const sectionsAfter = (sectionIds) =>
      sectionIds.includes(activeSectionId) || activeSectionId === undefined;

    return [
      {
        id: "personal",
        title: "Personal Information",
        items: [
          { key: "name", label: "Name" },
          { key: "title", label: "Job Title" },
          { key: "contact_details", label: "Contact Details" },
        ],
        visible: true,
      },
      {
        id: "summary",
        title: "Professional Summary",
        items: [{ key: "summary", label: "Summary Text" }],
        visible: sectionsAfter([
          "summary",
          "experience",
          "education",
          "projects",
          "skills",
          "additional",
        ]),
      },
      {
        id: "experience",
        title: "Experience",
        items: [
          { key: "experience", label: "Job Position" },
          { key: "company_names", label: "Company Names" },
          { key: "job_descriptions", label: "Descriptions" },
          { key: "location", label: "Location" },
        ],
        visible: sectionsAfter([
          "experience",
          "education",
          "projects",
          "skills",
          "additional",
        ]),
      },
      {
        id: "education_projects",
        title: "Education & Projects",
        items: [
          { key: "section_headers", label: "Section Headers" },
          { key: "education", label: "Education" },
          { key: "projects", label: "Projects" },
        ],
        visible: sectionsAfter([
          "education",
          "projects",
          "skills",
          "additional",
        ]),
      },
      {
        id: "skills_languages",
        title: "Skills & Languages",
        items: [
          { key: "skills", label: "Technical Skills" },
          { key: "soft_skills", label: "Soft Skills" },
          { key: "languages", label: "Languages" },
        ],
        visible: sectionsAfter(["skills", "additional"]),
      },
      {
        id: "additional_sections",
        title: "Additional Sections",
        items: [
          { key: "certifications", label: "Certifications" },
          { key: "achievements", label: "Achievements" },
          { key: "volunteer_work", label: "Volunteer Work" },
        ],
        visible: sectionsAfter(["additional"]),
      },
    ].filter((group) => group.visible);
  }, [activeSectionId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleChange = (key, value) => {
    onChange(key, value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        type="button"
      >
        <Type className="w-4 h-4" />
        Font Sizes
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Section Font Sizes
          </h4>
          <div className="space-y-4">
            {sectionGroups.map((group) => (
              <div key={group.id}>
                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {group.title}
                </h5>
                <div className="space-y-2 pl-3">
                  {group.items.map((item) => (
                    <div
                      className="flex items-center justify-between"
                      key={item.key}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                      <select
                        value={
                          sectionFontSizes[item.key] ??
                          DEFAULT_FONT_SIZES[item.key] ??
                          "medium"
                        }
                        onChange={(event) =>
                          handleChange(item.key, event.target.value)
                        }
                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        {FONT_SIZE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionFontSizeDropdown;

