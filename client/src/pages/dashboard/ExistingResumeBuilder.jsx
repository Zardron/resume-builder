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
  Sparkles,
  Wand2,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import InputField from "../../components/InputField";
import FileUploader from "../../util/FileUploader";
import AIFeatureButton from "../../components/AIFeatureButton";
import { useApp } from "../../contexts/AppContext";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import TemplateSelector from "../../components/TemplateSelector";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import MinimalTemplate from "../../components/templates/MinimalTemplate";
import SpotlightTemplate from "../../components/templates/SpotlightTemplate";
import ExecutiveTemplate from "../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../components/templates/CreativeTemplate";
import TechnicalTemplate from "../../components/templates/TechnicalTemplate";
import ElegantTemplate from "../../components/templates/ElegantTemplate";
import CorporateTemplate from "../../components/templates/CorporateTemplate";
import ProfessionalTemplate from "../../components/templates/ProfessionalTemplate";
import BusinessTemplate from "../../components/templates/BusinessTemplate";
import FormalTemplate from "../../components/templates/FormalTemplate";
import DynamicTemplate from "../../components/templates/DynamicTemplate";
import AcademicTemplate from "../../components/templates/AcademicTemplate";
import StartupTemplate from "../../components/templates/StartupTemplate";
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
  
  // AI Features State
  const [isAIParsing, setIsAIParsing] = useState(false);
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);
  const [aiParsedData, setAIParsedData] = useState(null);
  const { addNotification, isSubscribed } = useApp();
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
      setAIParsedData(null);
    } else {
      handleInputChange("title", "");
      setIsEditable(false);
      setAIParsedData(null);
    }
  };

  // AI-Powered Resume Parsing
  const handleAIParse = async () => {
    if (!uploadedFile) {
      addNotification({
        type: 'warning',
        title: 'No File Uploaded',
        message: 'Please upload a resume file first.',
      });
      return;
    }

    if (!isSubscribed) {
      addNotification({
        type: 'info',
        title: 'Premium Feature',
        message: 'Subscribe to unlock AI-powered resume parsing.',
      });
      return;
    }

    setIsAIParsing(true);
    addNotification({
      type: 'info',
      title: 'AI Parsing Started',
      message: 'Analyzing your resume with AI...',
    });

    try {
      // Simulate AI parsing (in production, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock parsed data structure
      const parsedData = {
        personal_info: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main St, City, State 12345",
          profession: "Software Engineer",
        },
        professional_summary: "Experienced software engineer with 5+ years in full-stack development...",
        experience: [
          {
            id: "1",
            position: "Senior Software Engineer",
            company: "Tech Corp",
            start_date: "2020-01",
            end_date: "2024-12",
            is_current: false,
            description: "Led development of scalable web applications...",
          },
        ],
        education: [
          {
            id: "1",
            degree: "Bachelor of Science",
            field: "Computer Science",
            institution: "University Name",
            start_date: "2016-09",
            end_date: "2020-05",
            is_current: false,
          },
        ],
        skills: ["JavaScript", "React", "Node.js", "Python"],
      };

      setAIParsedData(parsedData);
      
      // Auto-populate form fields
      setResumeData(prev => ({
        ...prev,
        personal_info: { ...prev.personal_info, ...parsedData.personal_info },
        professional_summary: parsedData.professional_summary,
        experience: parsedData.experience,
        education: parsedData.education,
        skills: parsedData.skills,
      }));

      addNotification({
        type: 'success',
        title: 'AI Parsing Complete',
        message: 'Resume data extracted and form fields populated!',
      });
    } catch (error) {
      console.error('AI parsing error:', error);
      addNotification({
        type: 'error',
        title: 'Parsing Failed',
        message: 'Failed to parse resume. Please try again or enter data manually.',
      });
    } finally {
      setIsAIParsing(false);
    }
  };

  // AI-Powered Content Enhancement
  const handleAIEnhance = async () => {
    if (!isSubscribed) {
      addNotification({
        type: 'info',
        title: 'Premium Feature',
        message: 'Subscribe to unlock AI-powered content enhancement.',
      });
      return;
    }

    setIsAIEnhancing(true);
    addNotification({
      type: 'info',
      title: 'AI Enhancement Started',
      message: 'Enhancing your resume content with AI...',
    });

    try {
      // Simulate AI enhancement (in production, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock enhanced content
      const enhancedSummary = "Results-driven Software Engineer with 5+ years of expertise in full-stack development, specializing in scalable web applications and cloud infrastructure. Proven track record of leading cross-functional teams to deliver high-impact solutions that improve system performance by 40% and reduce operational costs by 25%.";
      
      setResumeData(prev => ({
        ...prev,
        professional_summary: enhancedSummary,
      }));

      addNotification({
        type: 'success',
        title: 'Enhancement Complete',
        message: 'Your resume content has been enhanced with AI!',
      });
    } catch (error) {
      console.error('AI enhancement error:', error);
      addNotification({
        type: 'error',
        title: 'Enhancement Failed',
        message: 'Failed to enhance content. Please try again.',
      });
    } finally {
      setIsAIEnhancing(false);
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
      executive: ExecutiveTemplate,
      creative: CreativeTemplate,
      technical: TechnicalTemplate,
      elegant: ElegantTemplate,
      corporate: CorporateTemplate,
      professional: ProfessionalTemplate,
      business: BusinessTemplate,
      formal: FormalTemplate,
      dynamic: DynamicTemplate,
      academic: AcademicTemplate,
      startup: StartupTemplate,
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header Section */}
      <header className="relative mb-12 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] p-8 text-white shadow-xl dark:border-gray-700/50">
        <div className="absolute -top-24 right-14 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <button
            type="button"
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go back
          </button>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Resume builder
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Build Existing Resume</h1>
              <p className="text-sm text-white/80">
                Build an existing resume with the help of AI
              </p>
            </div>
            <div className="flex-shrink-0">
              <CreditsIndicator availableCredits={availableCredits} />
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Sparkles className="h-5 w-5 text-[var(--primary-color)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              About Credits
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Credits are needed to fully unlock the live preview feature. When you run out of credits, downloads will include a watermark or credits footer until you purchase more. 
              <Link
                to="/dashboard/purchase"
                className="ml-1 font-medium text-[var(--primary-color)] underline underline-offset-2 hover:text-[var(--secondary-color)]"
              >
                Buy credits
              </Link>{' '}
              to unlock unlimited watermark-free downloads and full preview access.
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Section with AI Features */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-1/3">
            <FileUploader
              label="Upload your existing resume"
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024}
              onFileChange={handleFileChange}
            />
          </div>
          
          {uploadedFile && (
            <div className="w-full sm:w-2/3">
              <AIFeatureButton
                label="AI Parse Resume"
                description="Extract and auto-fill all resume data using AI"
                onClick={handleAIParse}
                disabled={isAIParsing}
                className="w-full"
              />
              {isAIParsing && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI is analyzing your resume...</span>
                </div>
              )}
              {aiParsedData && (
                <div className="mt-2 rounded-lg border border-green-200 bg-green-50/50 p-3 text-sm dark:border-green-800 dark:bg-green-900/10">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">Resume parsed successfully!</span>
                  </div>
                  <p className="mt-1 text-green-600 dark:text-green-300">
                    Form fields have been auto-populated. Review and edit as needed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Enhancement Section */}
        {isTitleConfirmed && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    AI Content Enhancement
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Enhance your resume content with AI-powered suggestions
                  </p>
                </div>
              </div>
              <AIFeatureButton
                label={isAIEnhancing ? "Enhancing..." : "Enhance Content"}
                description="Improve your resume with AI-powered content suggestions"
                onClick={handleAIEnhance}
                disabled={isAIEnhancing}
              />
            </div>
            {isAIEnhancing && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is enhancing your resume content...</span>
              </div>
            )}
          </div>
        )}
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
              <div className="bg-white rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 dark:bg-gray-900">
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
              templateBadgeClassName="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md"
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
