import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Briefcase,
  FileText,
  GraduationCap,
  Sparkles,
  User,
  Folder,
  ChevronLeftIcon,
  ChevronRightIcon,
  Lock,
  Loader2,
  LayoutTemplateIcon,
  Plus,
  ChevronDown,
  Settings,
  Eye,
  EyeOff,
  Download,
  Share2,
} from 'lucide-react';
import InputField from '../../components/InputField';
import { RandomIdGenerator } from '../../util/RandomIdGenerator';
import { DEFAULT_FONT_SIZES } from '../../utils/fontSizeUtils';
import PersonalInfoForm from "./forms/PersonalInfoForm";
import TemplateSelector from "../../components/TemplateSelector";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import MinimalTemplate from "../../components/templates/MinimalTemplate";
import MinimalImageTemplate from "../../components/templates/MinimalImageTemplate";
import ProfessionalSummary from "./forms/ProfessionalSummary";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import ProjectsForm from "./forms/ProjectsForm";
import SkillsAndLanguagesForm from "./forms/SkillsAndLanguagesForm";
import AdditionalSectionsForm from "./forms/AdditionalSectionsForm";
import ColorPicker from "../../util/ColorPicker";

const SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Professional Summary', icon: FileText },
  { id: 'experience', name: 'Professional Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'projects', name: 'Projects', icon: Folder },
  { id: 'skills', name: 'Skills & Languages', icon: Sparkles },
  { id: 'additional', name: 'Additional Sections', icon: Plus },
];

const TYPING_DELAY = 1000;
const LOADING_DELAY = 1500;

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    _id: RandomIdGenerator(),
    title: '',
    personal_info: {
      name: '',
      email: '',
      phone: '',
      address: '',
      profession: '',
      linkedin: '',
      website: '',
      summary: '',
    },
    professional_summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    soft_skills: [],
    languages: [],
    certifications: [],
    achievements: [],
    volunteer_work: [],
    template: 'classic',
    accent_color: '#3B82F6',
    font_size: 'medium',
    section_font_sizes: { ...DEFAULT_FONT_SIZES },
    public: false,
  });
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [validationFunctions, setValidationFunctions] = useState({});
  const [isTitleConfirmed, setIsTitleConfirmed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formSectionRef = useRef(null);

  const handleDownload = () => {
    const resumeContent = document.getElementById('resume-print-content');
    if (!resumeContent) {
      console.error('Resume content not found');
      return;
    }

    // Store original styles and image sources using Maps for better performance
    const originalElements = resumeContent.querySelectorAll('*');
    const styleMap = new Map();
    const imageMap = new Map();
    
    originalElements.forEach((el, index) => {
      const computedStyle = window.getComputedStyle(el);
      const bgColor = computedStyle.backgroundColor;
      const bgImage = computedStyle.backgroundImage;
      
      // Only store non-default values
      if (bgColor !== 'rgba(0, 0, 0, 0)' || bgImage !== 'none') {
        styleMap.set(index, { bgColor, bgImage });
      }
      
      // Store image sources
      if (el.tagName === 'IMG') {
        imageMap.set(index, { src: el.src, currentSrc: el.currentSrc });
      }
    });

    // Clone and apply styles
    const clone = resumeContent.cloneNode(true);
    const clonedElements = clone.querySelectorAll('*');
    
    clonedElements.forEach((el, index) => {
      // Apply background styles
      const styles = styleMap.get(index);
      if (styles) {
        if (styles.bgColor !== 'rgba(0, 0, 0, 0)') {
          el.style.setProperty('background-color', styles.bgColor, 'important');
          el.style.setProperty('box-shadow', `inset 0 0 0 9999px ${styles.bgColor}`, 'important');
        }
        if (styles.bgImage !== 'none') {
          el.style.setProperty('background-image', styles.bgImage, 'important');
        }
      }
      
      // Restore images
      const imgData = imageMap.get(index);
      if (el.tagName === 'IMG' && imgData) {
        el.src = imgData.src;
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
      }
    });
    
    // Create print container with optimized style assignment
    const printContainer = document.createElement('div');
    printContainer.id = 'temp-print-container';
    Object.assign(printContainer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '9999'
    });
    printContainer.appendChild(clone);
    
    // Setup print environment
    document.body.style.visibility = 'hidden';
    document.body.appendChild(printContainer);
    document.body.classList.add('printing-resume');
    
    // Trigger print
    window.print();
    
    // Cleanup
    setTimeout(() => {
      document.body.classList.remove('printing-resume');
      document.body.style.visibility = 'visible';
      printContainer?.remove();
    }, 100);
  };

  const handleInputChange = (name, value) => {
    setResumeData(prev => ({ ...prev, [name]: value }));

    if (name === 'title') {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (value.trim()) {
        setIsTyping(true);
        setIsTypingComplete(false);
        setIsLoading(false);

        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setIsTypingComplete(true);
          setIsLoading(true);

          setTimeout(() => {
            setIsLoading(false);
            setIsTitleConfirmed(true);
          }, LOADING_DELAY);
        }, TYPING_DELAY);
      } else {
        setIsTyping(false);
        setIsTypingComplete(false);
        setIsLoading(false);
        setIsTitleConfirmed(false);
      }
    }
  };

  const updateSectionFontSize = (section, fontSize) => {
    setResumeData(prev => ({
      ...prev,
      section_font_sizes: {
        ...prev.section_font_sizes,
        [section]: fontSize
      }
    }));
  };

  const handleNextClick = () => {
    const currentSection = SECTIONS[activeSectionIndex];

    if (validationFunctions[currentSection.id]) {
      const isValid = validationFunctions[currentSection.id]();
      if (!isValid) return;
    }

    setActiveSectionIndex(prevIndex => Math.min(prevIndex + 1, SECTIONS.length - 1));
  };

  const handlePreviousClick = () => {
    setActiveSectionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const handleValidationChange = useCallback((sectionId, validationFn) => {
    setValidationFunctions((prev) => ({
      ...prev,
      [sectionId]: validationFn,
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFontSizeDropdown && !event.target.closest('.font-size-dropdown')) {
        setShowFontSizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFontSizeDropdown]);

  useEffect(() => {
    if (isTypingComplete && formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, 200);
    }
  }, [isTypingComplete]);

  const activeSection = SECTIONS[activeSectionIndex];
  const calculateProgressPercentage = () => Math.round((activeSectionIndex * 100) / (SECTIONS.length - 1));

  const renderTemplate = () => {
    const templateProps = {
      data: resumeData,
      accentColor: resumeData.accent_color || '#3B82F6',
      sectionFontSizes: resumeData.section_font_sizes || {}
    };

    const templates = {
      classic: ClassicTemplate,
      modern: ModernTemplate,
      minimal: MinimalTemplate,
      'minimal-image': MinimalImageTemplate,
    };

    const Template = templates[resumeData.template] || ClassicTemplate;
    return <Template {...templateProps} />;
  };

  return (
    <div className="mx-auto px-16 pt-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:from-[var(--accent-color)] hover:to-[var(--primary-color)] transition-all duration-300"
      >
        <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" />
        Back to dashboard
      </Link>

      <header className="w-full mt-2">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Create Resume
        </h1>
        <p className="text-sm font-light text-gray-900 dark:text-gray-100">
          Craft a professional, standout resume in minutes — powered by AI
        </p>
        <div className="mt-2 space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
            Resume Title
          </label>
          <InputField
            type="text"
            icon="title"
            width="w-1/4"
            placeholder="Enter your resume title"
            value={resumeData.title}
            onChange={(value) => handleInputChange("title", value)}
            isTyping={isTyping}
            isTypingComplete={isTypingComplete}
            isTitleConfirmed={isTitleConfirmed}
          />
        </div>
        <hr className="border-gray-200 dark:border-gray-700 my-2" />
      </header>

      <div ref={formSectionRef} className="w-full flex items-center mt-2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Side */}
          <div className="w-full">
            {/* Section Navigation */}
            <div className="w-full relative rounded-md lg:col-span-5 overflow-hidden mb-4">
              <div
                className={`bg-white rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300`}
              >
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Step {activeSectionIndex + 1} of {SECTIONS.length}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {calculateProgressPercentage()}% Complete
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${calculateProgressPercentage()}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsTemplateSelected(!isTemplateSelected)}
                      className="flex items-center gap-1 p-2 rounded-md text-sm font-medium text-white transition-all bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] cursor-pointer hover:opacity-80"
                    >
                      {isTemplateSelected ? (
                        <>
                          <ArrowLeftIcon className="size-4" /> Back to Form
                        </>
                      ) : (
                        <>
                          <LayoutTemplateIcon className="size-4" /> Templates
                        </>
                      )}
                    </button>
                    {!isTemplateSelected && (
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                          showColorPicker
                            ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600"
                            : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                          style={{
                            backgroundColor:
                              resumeData.accent_color || "#3B82F6",
                          }}
                        ></div>
                        Theme Color
                      </button>
                    )}
                  </div>
                  {!isTemplateSelected && (
                    <div className="flex items-center">
                      {activeSectionIndex !== 0 && (
                        <button
                          onClick={handlePreviousClick}
                          className="flex items-center gap-1 p-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                          disabled={activeSectionIndex === 0}
                        >
                          <ChevronLeftIcon className="size-4" /> Previous
                        </button>
                      )}
                      {activeSectionIndex !== SECTIONS.length - 1 && (
                        <button
                          onClick={handleNextClick}
                          className="flex items-center gap-1 p-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                        >
                          Next <ChevronRightIcon className="size-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Section Content */}
                <div className="space-y-6">
                  {showColorPicker && (
                    <ColorPicker
                      selectedColor={resumeData.accent_color}
                      onColorSelect={(color) => {
                        setResumeData((prev) => ({
                          ...prev,
                          accent_color: color,
                        }));
                      }}
                    />
                  )}
                  {isTemplateSelected ? (
                    <TemplateSelector
                      selectedTemplate={resumeData.template}
                      onTemplateSelect={(templateId) => {
                        setResumeData((prev) => ({
                          ...prev,
                          template: templateId,
                        }));
                      }}
                      selectedColor={resumeData.accent_color}
                      onColorSelect={(color) => {
                        setResumeData((prev) => ({
                          ...prev,
                          accent_color: color,
                        }));
                      }}
                    />
                  ) : (
                    <>
                      {activeSection.id === "personal" && (
                        <div>
                          <PersonalInfoForm
                            data={resumeData.personal_info}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                personal_info: data,
                              }));
                            }}
                            removeBackground={removeBackground}
                            setRemoveBackground={setRemoveBackground}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("personal", validationFn)
                            }
                          />
                        </div>
                      )}
                      {activeSection.id === "summary" && (
                        <div>
                          <ProfessionalSummary
                            data={resumeData}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                professional_summary: data.professionalSummary,
                              }));
                            }}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("summary", validationFn)
                            }
                          />
                        </div>
                      )}
                      {activeSection.id === "experience" && (
                        <div>
                          <ExperienceForm
                            data={resumeData.experience}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                experience: data,
                              }));
                            }}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("experience", validationFn)
                            }
                          />
                        </div>
                      )}
                      {activeSection.id === "education" && (
                        <div>
                          <EducationForm
                            data={resumeData.education}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                education: data,
                              }));
                            }}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("education", validationFn)
                            }
                          />
                        </div>
                      )}
                      {activeSection.id === "projects" && (
                        <div>
                          <ProjectsForm
                            data={resumeData.projects}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                projects: data,
                              }));
                            }}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("projects", validationFn)
                            }
                          />
                        </div>
                      )}
                      {activeSection.id === "skills" && (
                        <div>
                          <SkillsAndLanguagesForm
                            data={resumeData}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                skills: data.skills,
                                soft_skills: data.soft_skills,
                                languages: data.languages,
                              }));
                            }}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("skills", validationFn)
                            }
                          />
                        </div>
                      )}
                      {activeSection.id === "additional" && (
                        <div>
                          <AdditionalSectionsForm
                            data={resumeData}
                            onChange={(data) => {
                              setResumeData((prev) => ({
                                ...prev,
                                certifications: data.certifications,
                                achievements: data.achievements,
                                volunteer_work: data.volunteer_work,
                              }));
                            }}
                            onValidationChange={(validationFn) =>
                              handleValidationChange("additional", validationFn)
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Overlay for entire section when title is empty or loading */}
              {!isTitleConfirmed && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 dark:bg-gray-900/95 backdrop-blur-xs rounded-md border border-gray-200 dark:border-gray-700">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full flex items-center justify-center">
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <Lock className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isLoading
                        ? "Loading please wait..."
                        : "Enter a resume title to continue with the form."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full">
            {/* Section Navigation */}
            <div className="w-full relative rounded-md lg:col-span-5 overflow-hidden mb-4 sticky top-18">
              <div
                className={`bg-white rounded-md shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300`}
              >
                {/* Resume Preview Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Live Preview
                      </h3>
                      
                      {/* Public/Private Toggle */}
                      <button
                        onClick={() => setResumeData(prev => ({ ...prev, public: !prev.public }))}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
                        style={resumeData.public ? {
                          backgroundColor: 'rgba(var(--primary-color-rgb, 59, 130, 246), 0.1)',
                          color: 'var(--primary-color)',
                          border: '1px solid rgba(var(--primary-color-rgb, 59, 130, 246), 0.2)'
                        } : {
                          backgroundColor: 'rgba(156, 163, 175, 0.1)',
                          color: '#6b7280',
                          border: '1px solid rgba(156, 163, 175, 0.2)'
                        }}
                      >
                        {resumeData.public ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Private
                          </>
                        )}
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80 cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(var(--accent-color-rgb, 139, 92, 246), 0.1)',
                          color: 'var(--accent-color)',
                          border: '1px solid rgba(var(--accent-color-rgb, 139, 92, 246), 0.2)'
                        }}
                        title="Download Resume"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>

                      {/* Share Button */}
                      <button
                        className="flex items-center justify-center px-2 py-1.5 rounded-lg transition-colors hover:opacity-80 cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(var(--primary-color-rgb, 59, 130, 246), 0.1)',
                          color: 'var(--primary-color)',
                          border: '1px solid rgba(var(--primary-color-rgb, 59, 130, 246), 0.2)'
                        }}
                        title="Share Resume"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Section Font Size Controls */}
                      <div className="relative font-size-dropdown">
                        <button
                          onClick={() =>
                            setShowFontSizeDropdown(!showFontSizeDropdown)
                          }
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Font Sizes
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              showFontSizeDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {showFontSizeDropdown && (
                          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                              Section Font Sizes
                            </h4>
                            <div className="space-y-4">
                              {/* Personal Information Category - Always show */}
                              <div>
                                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                  Personal Information
                                </h5>
                                <div className="space-y-2 pl-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      Name
                                    </span>
                                    <select
                                      value={resumeData.section_font_sizes.name}
                                      onChange={(e) =>
                                        updateSectionFontSize(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                      <option value="small">Small</option>
                                      <option value="medium">Medium</option>
                                      <option value="large">Large</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      Job Title
                                    </span>
                                    <select
                                      value={
                                        resumeData.section_font_sizes.title
                                      }
                                      onChange={(e) =>
                                        updateSectionFontSize(
                                          "title",
                                          e.target.value
                                        )
                                      }
                                      className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                      <option value="small">Small</option>
                                      <option value="medium">Medium</option>
                                      <option value="large">Large</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      Contact Details
                                    </span>
                                    <select
                                      value={
                                        resumeData.section_font_sizes
                                          .contact_details
                                      }
                                      onChange={(e) =>
                                        updateSectionFontSize(
                                          "contact_details",
                                          e.target.value
                                        )
                                      }
                                      className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                      <option value="small">Small</option>
                                      <option value="medium">Medium</option>
                                      <option value="large">Large</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Professional Summary Category - Show when on summary or later sections */}
                              {(activeSection.id === "summary" ||
                                activeSection.id === "experience" ||
                                activeSection.id === "education" ||
                                activeSection.id === "projects" ||
                                activeSection.id === "skills") && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Professional Summary
                                  </h5>
                                  <div className="space-y-2 pl-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Summary Text
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes.summary
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "summary",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Experience Category - Show when on experience or later sections */}
                              {(activeSection.id === "experience" ||
                                activeSection.id === "education" ||
                                activeSection.id === "projects" ||
                                activeSection.id === "skills") && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Experience
                                  </h5>
                                  <div className="space-y-2 pl-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Job Position
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes
                                            .experience
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "experience",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Company Names
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes
                                            .company_names
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "company_names",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Job Descriptions
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes
                                            .job_descriptions
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "job_descriptions",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Location
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes.location
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "location",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Other Sections Category - Show when on education, projects, or skills */}
                              {(activeSection.id === "education" ||
                                activeSection.id === "projects" ||
                                activeSection.id === "skills") && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Other Sections
                                  </h5>
                                  <div className="space-y-2 pl-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Section Headers
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes
                                            .section_headers
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "section_headers",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Education
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes
                                            .education
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "education",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Projects
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes.projects
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "projects",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Skills
                                      </span>
                                      <select
                                        value={
                                          resumeData.section_font_sizes.skills
                                        }
                                        onChange={(e) =>
                                          updateSectionFontSize(
                                            "skills",
                                            e.target.value
                                          )
                                        }
                                        className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                      >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {resumeData.template.charAt(0).toUpperCase() +
                          resumeData.template.slice(1).replace("-", " ")}{" "}
                        Template
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resume Preview Content */}
                <div className="p-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div className="max-h-[600px] overflow-y-auto">
                      <div className="scale-75 origin-top-left w-[133%] h-[133%] text-[1em] resume-preview-content">
                        {renderTemplate()}
                      </div>
                    </div>
                  </div>

                  {/* Preview Footer */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Preview updates in real-time as you fill out the form
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
