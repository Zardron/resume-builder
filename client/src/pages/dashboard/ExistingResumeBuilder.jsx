import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Lock,
  Loader2,
  LayoutTemplateIcon,
} from "lucide-react";
import InputField from "../../components/InputField";
import FileUploader from "../../util/FileUploader";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import TemplateSelector from "../../components/TemplateSelector";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import MinimalTemplate from "../../components/templates/MinimalTemplate";
import SpotlightTemplate from "../../components/templates/SpotlightTemplate";
import ProfessionalSummary from "./forms/ProfessionalSummary";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import ProjectsForm from "./forms/ProjectsForm";
import SkillsAndLanguagesForm from "./forms/SkillsAndLanguagesForm";
import AdditionalSectionsForm from "./forms/AdditionalSectionsForm";
import ColorPicker from "../../util/ColorPicker";
import { generateResumePdf } from "../../utils/pdfUtils";
import CreditsIndicator from "../../components/CreditsIndicator";
import {
  getDefaultMarginsForPaper,
  resolvePageMargins,
} from "../../utils/marginUtils";
import { getStoredCredits } from "../../utils/creditUtils";
import ResumePreviewPanel from "../../components/builder/ResumePreviewPanel";
import {
  createInitialResumeData,
  SECTIONS,
  TEMPLATE_DISPLAY_NAMES,
  PAPER_SIZES,
  PAPER_DIMENSIONS,
  MARGIN_PRESETS,
} from "./BuilderConstants";
import { toPng } from "html-to-image";
import { createHalfBlurredPreviewImage } from "../../utils/previewImageUtils";

const getPreviewDimensions = (size) =>
  PAPER_DIMENSIONS[size] || PAPER_DIMENSIONS.A4;

const PREVIEW_PAGE_GAP = 32;

const TYPING_DELAY = 1000;
const LOADING_DELAY = 1500;

const ExistingResumeBuilder = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [resumeData, setResumeData] = useState(createInitialResumeData);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [validationFunctions, setValidationFunctions] = useState({});
  const [isTitleConfirmed, setIsTitleConfirmed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(getStoredCredits);
  const [lockedPreviewImage, setLockedPreviewImage] = useState(null);
  const formSectionRef = useRef(null);
  const previewRef = useRef(null);
  const previewContainerRef = useRef(null);
  const exportRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewContentHeight, setPreviewContentHeight] = useState(0);
  useEffect(() => {
    const handleStorageChange = () => {
      setAvailableCredits(getStoredCredits());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isPreviewLocked = availableCredits <= 0;
  const captureInFlightRef = useRef(false);
  const lastLockedDataSignatureRef = useRef(null);

  const handleDownload = async () => {
    if (isDownloading) return;

    const targetNode = exportRef.current || previewRef.current;
    if (!targetNode) return;

    setIsDownloading(true);

    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const fileName = resumeData.title
        ? `${resumeData.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_resume.pdf`
        : `resume_${new Date().getTime()}.pdf`;

      await generateResumePdf({
        node: targetNode,
        fileName,
        paperSize,
        pageMargins: currentPageMargins,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setResumeData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
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

  const handlePaperSizeChange = (size) => {
    setResumeData((prev) => {
      const prevDefaults = getDefaultMarginsForPaper(prev.paper_size);
      const nextDefaults = getDefaultMarginsForPaper(size);
      const currentMargins = resolvePageMargins(
        prev.page_margins,
        prevDefaults
      );
      const isUsingDefaults = ["top", "right", "bottom", "left"].every(
        (side) => currentMargins[side] === prevDefaults[side]
      );

      return {
        ...prev,
        paper_size: size,
        page_margins: isUsingDefaults
          ? { ...nextDefaults }
          : { ...currentMargins },
      };
    });
  };

  const handleFileChange = (file) => {
    setUploadedFile(file);

    if (file) {
      const filename = file.name.replace(/\.[^/.]+$/, "");
      handleInputChange("title", filename);
    } else {
      handleInputChange("title", "");
      setIsEditable(false);
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      input?.focus();
    }, 10);
  };

  const updateSectionFontSize = (section, fontSize) => {
    setResumeData((prev) => ({
      ...prev,
      section_font_sizes: {
        ...prev.section_font_sizes,
        [section]: fontSize,
      },
    }));
  };

  const handleNextClick = () => {
    const currentSection = SECTIONS[activeSectionIndex];

    if (validationFunctions[currentSection.id]) {
      const isValid = validationFunctions[currentSection.id]();
      if (!isValid) return;
    }

    setActiveSectionIndex((prevIndex) =>
      Math.min(prevIndex + 1, SECTIONS.length - 1)
    );
  };

  const handlePreviousClick = () => {
    setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
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
    if (isTypingComplete && formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 200);
    }
  }, [isTypingComplete]);

  const activeSection = SECTIONS[activeSectionIndex];
  const calculateProgressPercentage = () =>
    Math.round((activeSectionIndex * 100) / (SECTIONS.length - 1));
  const paperSize = resumeData.paper_size || "A4";
  const defaultPageMargins = getDefaultMarginsForPaper(paperSize);
  const currentPageMargins = resolvePageMargins(
    resumeData.page_margins,
    defaultPageMargins
  );

  const getMarginPresetId = (margins) => {
    const preset = MARGIN_PRESETS.find(({ value }) =>
      ["top", "right", "bottom", "left"].every(
        (side) => margins[side] === value
      )
    );
    return preset?.id || "custom";
  };

  const currentMarginPresetId = getMarginPresetId(currentPageMargins);

  const handleMarginPresetChange = (presetId) => {
    const preset = MARGIN_PRESETS.find((option) => option.id === presetId);
    if (!preset) {
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      page_margins: {
        top: preset.value,
        right: preset.value,
        bottom: preset.value,
        left: preset.value,
      },
    }));
  };

  const renderTemplate = (isDownloadMode = false, _useLockedData = false) => {
    const templateProps = {
      data: resumeData,
      accentColor: resumeData.accent_color || "#3B82F6",
      sectionFontSizes: resumeData.section_font_sizes || {},
      paperSize,
      pageMargins: currentPageMargins,
      availableCredits,
      isDownloadMode,
    };

    const templates = {
      classic: ClassicTemplate,
      modern: ModernTemplate,
      minimal: MinimalTemplate,
      spotlight: SpotlightTemplate,
    };

    const Template = templates[resumeData.template] || ClassicTemplate;
    return <Template {...templateProps} />;
  };

  const parsePxValue = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value.replace("px", "").trim());
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const previewDimensions = getPreviewDimensions(paperSize);
  const isFullHeightTemplate = resumeData.template === "spotlight";
  const basePreviewWidth = parsePxValue(previewDimensions.width);
  const pageHeightPx = parsePxValue(previewDimensions.height);
  const marginTopPx =
    typeof currentPageMargins?.top === "number"
      ? currentPageMargins.top
      : 0;
  const marginBottomPx =
    typeof currentPageMargins?.bottom === "number"
      ? currentPageMargins.bottom
      : 0;
  const contentAreaHeight =
    pageHeightPx > 0
      ? Math.max(pageHeightPx - marginTopPx - marginBottomPx, 0)
      : 0;
  const rawPageCount =
    contentAreaHeight > 0 && previewContentHeight > marginTopPx + marginBottomPx
      ? Math.ceil(
          (previewContentHeight - marginTopPx - marginBottomPx) /
            contentAreaHeight
        )
      : 1;
  const previewPageCount = Math.max(1, rawPageCount);
  const fallbackHeight =
    pageHeightPx || parsePxValue(previewDimensions.width) || 0;
  const totalUnscaledPreviewHeight =
    pageHeightPx > 0
      ? Math.max(
          pageHeightPx,
          previewPageCount * pageHeightPx +
            (previewPageCount - 1) * PREVIEW_PAGE_GAP
        )
      : Math.max(previewContentHeight, fallbackHeight);

  useEffect(() => {
    const container = previewContainerRef.current;
    const previewWidth = basePreviewWidth;

    if (!container || !previewWidth) {
      setPreviewScale(1);
      return;
    }

    const updateScale = () => {
      const availableWidth = container.clientWidth;
      if (!availableWidth) return;
      const calculatedScale = Math.min(availableWidth / previewWidth, 1);
      setPreviewScale(calculatedScale > 0 ? calculatedScale : 1);
    };

    updateScale();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [basePreviewWidth, isTemplateSelected]);

  useLayoutEffect(() => {
    const previewNode = previewRef.current;
    if (!previewNode) {
      return;
    }

    const updateHeight = () => {
      const height = previewNode.offsetHeight;
      if (height !== previewContentHeight) {
        setPreviewContentHeight(height);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(previewNode);

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [
    basePreviewWidth,
    isFullHeightTemplate,
    previewContentHeight,
    resumeData,
    paperSize,
  ]);

  const scaledWrapperWidth =
    basePreviewWidth && previewScale
      ? `${basePreviewWidth * previewScale}px`
      : previewDimensions.width;

  const scaledWrapperHeight =
    totalUnscaledPreviewHeight > 0 && previewScale
      ? `${totalUnscaledPreviewHeight * previewScale}px`
      : previewDimensions.height;

  const captureLockedPreviewImage = useCallback(
    async (nextSignature) => {
      if (!isPreviewLocked) {
        return;
      }
      if (captureInFlightRef.current) {
        return;
      }
      const node = previewRef.current;
      if (!node) {
        return;
      }

      captureInFlightRef.current = true;
      try {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const dataUrl = await toPng(node, {
          pixelRatio: window.devicePixelRatio || 2,
          cacheBust: true,
          backgroundColor: "#ffffff",
        });
        const blurredDataUrl = await createHalfBlurredPreviewImage(dataUrl);
        setLockedPreviewImage(blurredDataUrl);
        lastLockedDataSignatureRef.current = nextSignature;
      } catch (error) {
        console.error("Failed to capture locked preview:", error);
      } finally {
        captureInFlightRef.current = false;
      }
    },
    [isPreviewLocked]
  );

  useEffect(() => {
    if (!isPreviewLocked) {
      setLockedPreviewImage(null);
      lastLockedDataSignatureRef.current = null;
      return;
    }

    const signature = JSON.stringify(resumeData);
    const hasDataChanged = lastLockedDataSignatureRef.current !== signature;

    if (!lockedPreviewImage || hasDataChanged) {
      captureLockedPreviewImage(signature);
    }
  }, [
    isPreviewLocked,
    captureLockedPreviewImage,
    lockedPreviewImage,
    resumeData,
  ]);

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="mx-auto px-16 pt-8">
      <header className="w-full mt-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:from-[var(--accent-color)] hover:to-[var(--primary-color)] transition-all duration-300 cursor-pointer"
            >
              <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" />
              Go back
            </button>

            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Build Existing Resume
              </h1>
              <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                Build an existing resume with the help of AI
              </p>
            </div>
          </div>
          <CreditsIndicator availableCredits={availableCredits} />
        </div>
        <hr className="border-gray-200 dark:border-gray-700 my-4" />
      </header>

      <div className="w-1/4 mb-4">
        <FileUploader
          label="Upload your existing resume"
          accept=".pdf,.doc,.docx"
          maxSize={10 * 1024 * 1024}
          onFileChange={handleFileChange}
        />
      </div>

      <div className="mb-4">
        <InputField
          readOnly={!uploadedFile && !resumeData.title}
          type="text"
          icon="title"
          width="w-1/4"
          placeholder="Resume title"
          value={resumeData.title}
          onChange={(value) => handleInputChange("title", value)}
          showEditIcon={!isEditable && resumeData.title !== ""}
          onEditClick={handleEditClick}
          onBlur={() => setIsEditable(false)}
          isTyping={isTyping}
          isTypingComplete={isTypingComplete}
          isTitleConfirmed={isTitleConfirmed}
        />
        <p className="w-3/4 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className="font-semibold">Note:</span>{" "}
          <span className="font-light">
            Title auto-extracted from filename. Click pencil icon to edit.
          </span>
        </p>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-4" />

      <div ref={formSectionRef} className="w-full flex items-center mt-2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Side - Form Sections */}
          <div className="w-full ">
            <div className="w-full relative rounded-md lg:col-span-5 overflow-hidden mb-4">
              <div className="bg-white rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 dark:bg-gray-900">
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

                {/* Controls Bar */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-4">
                  <div className="flex items-center gap-3 overflow-x-auto">
                    <button
                      onClick={() => setIsTemplateSelected(!isTemplateSelected)}
                      className="flex items-center gap-1 p-2 rounded-md text-sm font-medium text-white transition-all bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] cursor-pointer hover:opacity-80 flex-shrink-0"
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border flex-shrink-0 ${
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
                      selectedPaperSize={resumeData.paper_size}
                      onPaperSizeSelect={handlePaperSizeChange}
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
                        : "Upload a file or enter a resume title to continue."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="w-full">
            <ResumePreviewPanel
              paperSizes={PAPER_SIZES}
              selectedPaperSize={resumeData.paper_size}
              onPaperSizeChange={handlePaperSizeChange}
              templateDisplayName={
                TEMPLATE_DISPLAY_NAMES[resumeData.template] ||
                resumeData.template
              }
              templateBadgeClassName="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg"
              isPublic={resumeData.public}
              onTogglePublic={() =>
                setResumeData((prev) => ({
                  ...prev,
                  public: !prev.public,
                }))
              }
              onDownload={handleDownload}
              isDownloading={isDownloading}
              isDownloadDisabled={false}
              downloadTitle={
                isDownloading
                  ? "Generating PDF..."
                  : "Download Resume"
              }
              marginPresets={MARGIN_PRESETS}
              currentMarginPresetId={currentMarginPresetId}
              onMarginPresetChange={handleMarginPresetChange}
              activeSectionId={activeSection.id}
              sectionFontSizes={resumeData.section_font_sizes}
              onSectionFontSizeChange={updateSectionFontSize}
              alertMessage="Downloading a resume immediately deducts one credit. Make sure you have credits remaining—otherwise your downloaded resume will include a watermark."
              previewDimensions={previewDimensions}
              previewScale={previewScale}
              scaledWrapperWidth={scaledWrapperWidth}
              scaledWrapperHeight={scaledWrapperHeight}
              previewPageCount={previewPageCount}
              pageHeightPx={pageHeightPx}
              pageGap={PREVIEW_PAGE_GAP}
              pageMargins={currentPageMargins}
              isFullHeightTemplate={isFullHeightTemplate}
              previewContainerRef={previewContainerRef}
              previewRef={previewRef}
              renderTemplate={renderTemplate}
              isPreviewLocked={isPreviewLocked}
              lockedPreviewImage={lockedPreviewImage}
              onPurchaseCredits={() => navigate("/dashboard/purchase")}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            visibility: "hidden",
            zIndex: -1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "32px",
            overflow: "hidden",
          }}
        >
          <div
            ref={exportRef}
            className="origin-top-left text-[1em] resume-preview-export-content"
            style={{
              width: previewDimensions.width,
              height: isFullHeightTemplate ? previewDimensions.height : "auto",
              margin: "0 auto",
            }}
          >
            {renderTemplate(true, isPreviewLocked)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingResumeBuilder;
