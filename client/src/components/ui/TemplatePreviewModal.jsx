import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Maximize2, Minimize2 } from "lucide-react";
import ClassicTemplate from "../templates/ClassicTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import SpotlightTemplate from "../templates/SpotlightTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import TechnicalTemplate from "../templates/TechnicalTemplate";
import ElegantTemplate from "../templates/ElegantTemplate";
import CorporateTemplate from "../templates/CorporateTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import BusinessTemplate from "../templates/BusinessTemplate";
import FormalTemplate from "../templates/FormalTemplate";
import DynamicTemplate from "../templates/DynamicTemplate";
import AcademicTemplate from "../templates/AcademicTemplate";
import StartupTemplate from "../templates/StartupTemplate";

const TemplatePreviewModal = ({ 
  isOpen, 
  onClose, 
  templateId, 
  templateName, 
  templateDescription, 
  accentColor, 
  sampleData,
  onTemplateSelect,
  initialPaperSize = "A4",
  onPaperSizeChange
}) => {
  const [paperSize, setPaperSize] = useState(initialPaperSize);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPaperSize(initialPaperSize);
    }
  }, [isOpen, initialPaperSize]);

  useEffect(() => {
    if (isOpen) {
      console.log('🎬 Modal opening - starting animation');
      setShouldRender(true);
      setIsClosing(false);
      // Prevent body scroll
      document.body.classList.add('modal-open');
    } else {
      // Cleanup when isOpen becomes false
      document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);


  const templates = {
    classic: {
      component: ClassicTemplate,
      name: "Classic",
      description: "Traditional, professional layout perfect for corporate environments"
    },
    modern: {
      component: ModernTemplate,
      name: "Modern", 
      description: "Contemporary design with bold headers and clean typography"
    },
    minimal: {
      component: MinimalTemplate,
      name: "Minimal",
      description: "Clean, minimalist design focusing on content and readability"
    },
    spotlight: {
      component: SpotlightTemplate,
      name: "Spotlight",
      description: "Minimalist design with space for a professional photo"
    },
    executive: {
      component: ExecutiveTemplate,
      name: "Executive",
      description: "Two-column layout with sidebar for executive positions"
    },
    creative: {
      component: CreativeTemplate,
      name: "Creative",
      description: "Colorful, artistic design perfect for creative professionals"
    },
    technical: {
      component: TechnicalTemplate,
      name: "Technical",
      description: "Code-focused design ideal for developers and engineers"
    },
    elegant: {
      component: ElegantTemplate,
      name: "Elegant",
      description: "Sophisticated, refined design with elegant typography"
    },
    corporate: {
      component: CorporateTemplate,
      name: "Corporate",
      description: "Structured, formal layout perfect for corporate environments"
    },
    professional: {
      component: ProfessionalTemplate,
      name: "Professional",
      description: "Clean, ATS-friendly design optimized for applicant tracking systems"
    },
    business: {
      component: BusinessTemplate,
      name: "Business",
      description: "Professional design with subtle accent bars and structured layout"
    },
    formal: {
      component: FormalTemplate,
      name: "Formal",
      description: "Very formal, traditional layout with centered sections"
    },
    dynamic: {
      component: DynamicTemplate,
      name: "Dynamic",
      description: "Energetic design with bold sections and modern styling"
    },
    academic: {
      component: AcademicTemplate,
      name: "Academic",
      description: "Perfect for researchers, academics, and PhD holders"
    },
    startup: {
      component: StartupTemplate,
      name: "Startup",
      description: "Modern, fresh design perfect for startup culture"
    }
  };

  const paperSizes = [
    { id: "short", name: "Short", dimensions: "8.5\" × 11\"", description: "Standard US Letter" },
    { id: "A4", name: "A4", dimensions: "8.27\" × 11.69\"", description: "International Standard" },
    { id: "legal", name: "Legal", dimensions: "8.5\" × 14\"", description: "Extended Length" }
  ];

  const getPaperSizeStyles = (size) => {
    const styles = {
      short: {
        width: "816px",        // 8.5" × 11" at 96 DPI
        height: "1056px",
        aspectRatio: "8.5/11",
        maxWidth: "100%",
        maxHeight: "none"
      },
      A4: {
        width: "794px",        // 210mm × 297mm at 96 DPI
        height: "1123px",
        aspectRatio: "8.27/11.69",
        maxWidth: "100%",
        maxHeight: "none"
      },
      legal: {
        width: "816px",        // 8.5" × 14" at 96 DPI
        height: "1344px",
        aspectRatio: "8.5/14",
        maxWidth: "100%",
        maxHeight: "none"
      }
    };
    return styles[size] || styles.A4;
  };

  // Simplified - always show all content on one page
  const calculatePageBreaks = (size, data) => {
    return 1; // Always show all content
  };

  // Simplified - always show all content
  const getPageContent = (data, paperSize, pageNumber) => {
    return {
      showHeader: true,
      showProfessionalSummary: true,
      showExperience: true,
      showProjects: true,
      showEducation: true,
      showSkills: true,
      experienceEntries: data.experience || [],
      projectEntries: data.project || [],
      educationEntries: data.education || []
    };
  };

  // Update total pages when paper size or data changes
  useEffect(() => {
    const pages = calculatePageBreaks(paperSize, sampleData);
    setTotalPages(pages);
    if (currentPage > pages) {
      setCurrentPage(1);
    }
  }, [paperSize, sampleData, currentPage]);

  // Calculate preview scale for mobile responsiveness
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container || !isOpen) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      const paperStyles = getPaperSizeStyles(paperSize);
      const paperWidth = parseFloat(paperStyles.width) || 794;
      const padding = window.innerWidth < 640 ? 16 : 32; // Account for padding
      const availableWidth = containerWidth - padding;
      const calculatedScale = Math.min(availableWidth / paperWidth, 1);
      setPreviewScale(calculatedScale > 0 ? calculatedScale : 1);
    };

    updateScale();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(container);
      window.addEventListener("resize", updateScale);
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateScale);
      };
    } else {
      window.addEventListener("resize", updateScale);
      return () => {
        window.removeEventListener("resize", updateScale);
      };
    }
  }, [paperSize, isOpen]);

  // Component to render template with page breaks
  const PageBasedTemplate = ({ data, accentColor, paperSize, currentPage, totalPages }) => {
    const TemplateComponent = templates[templateId]?.component;
    
    if (!TemplateComponent) return null;

    // If only one page, show full template with endless scroll
    if (totalPages === 1) {
      return (
        <div className="relative">
          <TemplateComponent 
            data={data} 
            accentColor={accentColor}
            paperSize={paperSize}
            showHeader={true}
            showProfessionalSummary={true}
            showExperience={true}
            showProjects={true}
            showEducation={true}
            showSkills={true}
          />
          
          {/* Single page indicator */}
          <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg text-sm font-medium shadow-lg">
            Single Page
          </div>
        </div>
      );
    }

    // Multi-page view with page breaks
    const pageContent = getPageContent(data, paperSize, currentPage);

    // Create modified data with only current page content
    const pageData = {
      ...data,
      professional_summary: pageContent.showProfessionalSummary ? data.professional_summary : null,
      experience: pageContent.experienceEntries,
      project: pageContent.projectEntries,
      education: pageContent.educationEntries,
      skills: pageContent.showSkills ? data.skills : []
    };

    return (
      <div className="relative">
        <TemplateComponent 
          data={pageData} 
          accentColor={accentColor}
          showHeader={pageContent.showHeader}
          showProfessionalSummary={pageContent.showProfessionalSummary}
          showExperience={pageContent.showExperience}
          showProjects={pageContent.showProjects}
          showEducation={pageContent.showEducation}
          showSkills={pageContent.showSkills}
        />
        
      </div>
    );
  };

  const TemplateComponent = templates[templateId]?.component;

  if (!mounted || !shouldRender || !TemplateComponent) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    // Restore body scroll immediately
    document.body.classList.remove('modal-open');
    setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose();
    }, 500); // Half second for fast animation
  };

  const handleSelectTemplate = () => {
    onTemplateSelect && onTemplateSelect(templateId);
    handleClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          !isClosing ? 'opacity-60' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative bg-white dark:bg-gray-900 rounded-md sm:rounded-md shadow-2xl flex flex-col ${
          isFullscreen ? 'w-full h-full max-h-none' : 'w-full max-w-7xl h-[95vh] max-h-[95vh]'
        } animate__animated animate__faster ${isClosing ? 'animate__zoomOut' : 'animate__zoomIn'}`}
      >
        {/* Close Button - Fixed position in upper right corner of modal */}
        {!isFullscreen && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-2 lg:right-2 p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors z-50 bg-white dark:bg-gray-900 shadow-lg"
            title="Close"
          >
            <X className="size-4 sm:size-5" />
          </button>
        )}
        
        {/* Modal Content */}
        <div className="flex flex-col h-full gap-0">
          {/* Header */}
          {!isFullscreen && (
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 lg:p-8 pr-12 sm:pr-14 ">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg flex-shrink-0" style={{ backgroundColor: accentColor }}>
                    <FileText className="size-5 sm:size-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                      {templateName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {templateDescription}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3">
                  {/* Paper Size Selector */}
                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Paper Size:
                    </label>
                    <select
                      value={paperSize}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPaperSize(value);
                        onPaperSizeChange?.(value);
                      }}
                      className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-0"
                    >
                      {paperSizes.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.name} ({size.dimensions})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Fullscreen Header - Minimal controls when in fullscreen */}
          {isFullscreen && (
            <div className="absolute top-0 right-0 z-50 flex items-center gap-2 p-4">
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors bg-white dark:bg-gray-900 shadow-lg"
                title="Exit Fullscreen"
              >
                <Minimize2 className="size-5" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors bg-white dark:bg-gray-900 shadow-lg"
                title="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Template Preview */}
            <div 
              ref={previewContainerRef}
              className="flex-1 template-preview-scroll bg-gray-100 dark:bg-gray-800 overflow-auto relative"
            >
              {/* Fullscreen Toggle - Sticky position in upper right of preview area */}
              {!isFullscreen && (
                <div className="sticky top-0 right-0 z-20 flex justify-end pointer-events-none" style={{ padding: '8px' }}>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors bg-white dark:bg-gray-900 shadow-lg pointer-events-auto"
                    title="Enter Fullscreen"
                  >
                    <Maximize2 className="size-4 sm:size-5" />
                  </button>
                </div>
              )}
              
              <div className="py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 min-h-full flex justify-center items-center">
                <div 
                  className={`bg-white ${totalPages === 1 ? 'shadow-lg' : 'shadow-2xl'} rounded-md`}
                  style={{
                    ...getPaperSizeStyles(paperSize),
                    ...(totalPages === 1 && { minHeight: 'auto' }),
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top center',
                    maxWidth: '100%'
                  }}
                >
                  <PageBasedTemplate 
                    data={sampleData} 
                    accentColor={accentColor}
                    paperSize={paperSize}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </div>
              </div>

              <div className="sticky top-0 right-0 z-20 flex justify-end pointer-events-none" style={{ padding: '8px' }}>
               &nbsp;
                </div>
            </div>
          </div>

          {/* Footer */}
          {!isFullscreen && (
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Preview shows sample data. Your actual resume content will appear when you fill out the form.
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={handleClose}
                      className="flex-1 sm:flex-initial px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSelectTemplate}
                      className="flex-1 sm:flex-initial px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-sm shadow-sm"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TemplatePreviewModal;
