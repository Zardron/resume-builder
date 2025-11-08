import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Maximize2, Minimize2 } from "lucide-react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import SpotlightTemplate from "./templates/SpotlightTemplate";

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
    "spotlight": {
      component: SpotlightTemplate,
      name: "Spotlight",
      description: "Minimalist design with space for a professional photo"
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
        width: "680px",        // Realistic screen width for 8.5" paper
        height: "880px",       // Realistic screen height for 11" paper
        aspectRatio: "8.5/11",
        maxWidth: "680px",
        maxHeight: "880px"
      },
      A4: {
        width: "660px",        // Realistic screen width for A4 paper
        height: "935px",       // Realistic screen height for A4 paper
        aspectRatio: "8.27/11.69",
        maxWidth: "660px",
        maxHeight: "935px"
      },
      legal: {
        width: "680px",        // Realistic screen width for legal paper
        height: "1120px",      // Realistic screen height for 14" paper
        aspectRatio: "8.5/14",
        maxWidth: "680px",
        maxHeight: "1120px"
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
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col ${
          isFullscreen ? 'w-full h-full max-h-none' : 'w-full max-w-7xl h-[95vh]'
        } animate__animated animate__faster ${isClosing ? 'animate__zoomOut' : 'animate__zoomIn'}`}
      >
        {/* Modal Content */}
        <div className="flex flex-col h-full gap-0">
          {/* Header */}
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: accentColor }}>
                  <FileText className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {templateName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {templateDescription}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Paper Size Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paper Size:
                  </label>
                  <select
                    value={paperSize}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPaperSize(value);
                      onPaperSizeChange?.(value);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    {paperSizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name} ({size.dimensions})
                      </option>
                    ))}
                  </select>
                </div>


                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Template Preview */}
            <div className="flex-1 template-preview-scroll bg-gray-100 dark:bg-gray-800 overflow-auto">
              <div className="p-8 min-h-full flex justify-center items-start">
                <div 
                  className={`bg-white ${totalPages === 1 ? 'shadow-lg' : 'shadow-2xl'} rounded-lg`}
                  style={{
                    ...getPaperSizeStyles(paperSize),
                    ...(totalPages === 1 && { minHeight: 'auto' })
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
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Preview shows sample data. Your actual resume content will appear when you fill out the form.
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSelectTemplate}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TemplatePreviewModal;
