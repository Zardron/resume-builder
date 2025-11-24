import React, { useState, useEffect, useMemo, startTransition } from 'react';
import { LayoutGrid, Sparkles, Eye, CheckCircle2, Zap, Award, TrendingUp, Rocket, ArrowRight, Star, FileText, Loader2 } from 'lucide-react';
import SectionBadge from './SectionBadge';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import SpotlightTemplate from '../templates/SpotlightTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import TechnicalTemplate from '../templates/TechnicalTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import BusinessTemplate from '../templates/BusinessTemplate';
import FormalTemplate from '../templates/FormalTemplate';
import DynamicTemplate from '../templates/DynamicTemplate';
import AcademicTemplate from '../templates/AcademicTemplate';
import StartupTemplate from '../templates/StartupTemplate';
import TemplatePreviewModal from '../ui/TemplatePreviewModal';
import { templateDummyData } from '../../utils/templateDummyData';

const TEMPLATE_GROUPS = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless professional layout trusted by Fortune 500 companies. Perfect for corporate environments and traditional industries.',
    accent: 'from-slate-600/90 to-slate-800/80',
    highlights: ['Traditional design', 'ATS optimized', 'Corporate ready'],
    icon: Award,
  },
  {
    id: 'modern',
    name: 'Modern Edge',
    description: 'Bold typography with adaptive sections designed for product managers, designers, and tech professionals.',
    accent: 'from-blue-500/90 to-cyan-500/80',
    highlights: ['ATS friendly', 'Skills spotlight band', 'Version history ready'],
    icon: Zap,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean two-column layout engineered to keep recruiters focused on your strongest experience and achievements.',
    accent: 'from-slate-800/90 to-slate-600/80',
    highlights: ['2-column grid', 'Auto-adjusting typography', 'PDF perfect spacing'],
    icon: TrendingUp,
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Visual-first template with a hero banner perfect for portfolios and creative work.',
    accent: 'from-violet-500/90 to-fuchsia-500/80',
    highlights: ['Photo ready', 'Color-accent blocks', 'Adaptive for long form content'],
    icon: Sparkles,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Two-column layout with sidebar designed for executive positions and leadership roles.',
    accent: 'from-indigo-600/90 to-purple-600/80',
    highlights: ['Sidebar layout', 'Executive focused', 'Leadership emphasis'],
    icon: Award,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful, artistic design perfect for creative professionals and designers.',
    accent: 'from-pink-500/90 to-rose-500/80',
    highlights: ['Artistic design', 'Color accents', 'Creative portfolio ready'],
    icon: Sparkles,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-focused design ideal for developers, engineers, and technical professionals.',
    accent: 'from-emerald-500/90 to-teal-500/80',
    highlights: ['Tech focused', 'Code-friendly', 'Developer optimized'],
    icon: Zap,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated, refined design with elegant typography for professional roles.',
    accent: 'from-amber-500/90 to-orange-500/80',
    highlights: ['Refined design', 'Elegant typography', 'Professional polish'],
    icon: Award,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Structured, formal layout perfect for corporate environments and business roles.',
    accent: 'from-blue-600/90 to-indigo-600/80',
    highlights: ['Structured layout', 'Formal design', 'Business ready'],
    icon: Award,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, ATS-friendly design optimized for applicant tracking systems.',
    accent: 'from-cyan-500/90 to-blue-500/80',
    highlights: ['ATS optimized', 'Clean layout', 'System friendly'],
    icon: CheckCircle2,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Professional design with subtle accent bars and structured layout for business roles.',
    accent: 'from-teal-600/90 to-cyan-600/80',
    highlights: ['Accent bars', 'Structured design', 'Business focused'],
    icon: TrendingUp,
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Very formal, traditional layout with centered sections for conservative industries.',
    accent: 'from-gray-600/90 to-slate-700/80',
    highlights: ['Traditional layout', 'Centered sections', 'Formal design'],
    icon: Award,
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Energetic design with bold sections and modern styling perfect for tech professionals.',
    accent: 'from-orange-500/90 to-red-500/80',
    highlights: ['Bold sections', 'Modern styling', 'Tech focused'],
    icon: Zap,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Perfect for researchers, academics, and PhD holders with emphasis on publications.',
    accent: 'from-blue-600/90 to-indigo-700/80',
    highlights: ['Research focused', 'Publication ready', 'Academic style'],
    icon: Award,
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Modern, fresh design perfect for startup culture and entrepreneurial roles.',
    accent: 'from-green-500/90 to-emerald-600/80',
    highlights: ['Startup culture', 'Modern design', 'Entrepreneurial'],
    icon: Rocket,
  },
];

// Template ID to dummy data index mapping
const TEMPLATE_DATA_MAP = {
  classic: 0,        // Software Engineer (Sarah Chen)
  modern: 1,         // Product Designer (Marcus Johnson)
  technical: 2,      // Data Scientist (Dr. Emily Rodriguez)
  business: 3,       // Marketing Manager (Jessica Williams)
  corporate: 4,      // Financial Analyst (David Kim)
  creative: 5,       // UX Researcher (Alexandra Taylor)
  minimal: 6,        // DevOps Engineer (Michael Brown)
  professional: 7,   // Project Manager (Rachel Green)
  elegant: 8,        // Content Writer (Olivia Martinez)
  executive: 9,      // Business Analyst (James Wilson)
  spotlight: 10,     // Sales Manager (Robert Anderson)
  formal: 11,        // HR Manager (Lisa Thompson)
  dynamic: 12,       // Full Stack Developer (Jordan Mitchell)
  academic: 13,      // Research Scientist (Dr. Christopher Lee)
  startup: 14,       // Product Manager & Entrepreneur (Taylor Morgan)
};

// Get template-specific dummy data
const getTemplateData = (templateId) => {
  const dataIndex = TEMPLATE_DATA_MAP[templateId];
  if (dataIndex !== undefined && templateDummyData[dataIndex]) {
    const data = templateDummyData[dataIndex];
    return {
      ...data,
      // Ensure all required fields are present
      experience: data.experience || [],
      education: data.education || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
    };
  }
  // Fallback to first template data if mapping not found
  return templateDummyData[0];
};


// Combined unique colors for template selection (6 colors including monochrome)
const AVAILABLE_COLORS = [
  '#6b7280', // Gray (Monochrome)
  '#3b82f6', // Blue (default)
  '#10b981', // Green
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

// Template mapping
const templateComponents = {
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

// A4 Paper Dimensions Constants (at 96 DPI)
// A4: 210mm × 297mm = 8.27" × 11.69"
const A4_WIDTH = 794;  // 8.27 * 96 = 793.92px
const A4_HEIGHT = 1123; // 11.69 * 96 = 1122.24px
const A4_ASPECT_RATIO = A4_HEIGHT / A4_WIDTH; // ≈ 1.414

// Fixed scale for uniform A4 preview sizing across all templates
const PREVIEW_SCALE = 0.35; // 35% scale for consistent sizing

// Large Template Preview Component - Hero of the card
// Memoized for performance since all templates load immediately
const TemplatePreview = React.memo(({ templateId, onPreviewClick, templateName, accentColor }) => {
  const TemplateComponent = templateComponents[templateId];

  if (!TemplateComponent) {
    return null;
  }

  // Get template-specific dummy data
  const templateData = getTemplateData(templateId);
  const finalAccentColor = accentColor || templateData.accent_color || "#3B82F6";

  // Fixed dimensions based on A4 size and scale
  const scaledWidth = A4_WIDTH * PREVIEW_SCALE;
  const scaledHeight = A4_HEIGHT * PREVIEW_SCALE;

  return (
    <div 
      className="relative w-full rounded-t-md overflow-hidden transition-all duration-500"
    >
      {/* Clean padding wrapper with consistent spacing on all sides */}
      <div className="relative p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 bg-gradient-to-br from-blue-600/10 via-cyan-500/8 to-purple-600/10 dark:from-blue-600/5 dark:via-cyan-500/4 dark:to-purple-600/5 rounded-t-md overflow-hidden">
        <div 
          className="relative flex items-center justify-center w-full"
          style={{ 
            pointerEvents: 'none',
            minHeight: `${scaledHeight}px`,
          }}
        >
          {/* Container that shows full A4 template - fixed size */}
          <div 
            className="relative bg-white rounded-md shadow-xl overflow-hidden transform transition-all duration-500"
            style={{ 
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              flexShrink: 0,
            }}
          >
            <div 
              className="absolute"
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                transform: `scale(${PREVIEW_SCALE})`,
                transformOrigin: 'top left',
                overflow: 'hidden', // Ensure content doesn't overflow A4 bounds
              }}
            >
              <div
                style={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  overflow: 'hidden', // Constrain content to A4 size
                  position: 'relative',
                }}
              >
                <TemplateComponent
                  data={templateData}
                  accentColor={finalAccentColor}
                  paperSize="A4"
                  pageMargins={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  sectionFontSizes={{}}
                  availableCredits={0}
                  isDownloadMode={false}
                  showHeader={true}
                  showProfessionalSummary={true}
                  showExperience={true}
                  showProjects={true}
                  showEducation={true}
                  showSkills={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if templateId or accentColor changes
  return prevProps.templateId === nextProps.templateId && 
         prevProps.accentColor === nextProps.accentColor;
});

// Template Controls Component - Shows below each template
const TemplateControls = ({ templateId, templateName, onPreviewClick, selectedColor, onColorChange }) => {
  // Get template default color
  const templateData = getTemplateData(templateId);
  const defaultColor = templateData.accent_color || "#3b82f6";
  
  // Use all 6 colors from available colors
  const displayColors = AVAILABLE_COLORS;
  
  // Get current selected color (user-selected or default)
  const currentColor = selectedColor || defaultColor;
  
  // Normalize color for comparison (lowercase)
  const normalizeColor = (color) => color?.toLowerCase();
  const currentColorNormalized = normalizeColor(currentColor);
  
  // Check if monochrome is selected
  const isMonochrome = currentColorNormalized === "#6b7280";

  const handleColorClick = (color) => {
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleMonochromeClick = () => {
    if (onColorChange) {
      onColorChange("#6B7280"); // Gray for monochrome
    }
  };

  // Get colors to display (exclude the currently selected one from the list)
  // Always show 5 colors on the right, excluding the selected one
  const colorsToDisplay = displayColors
    .filter(color => normalizeColor(color) !== currentColorNormalized);

  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      {/* Selected Color Display - Left Side with Circle Border */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={isMonochrome ? handleMonochromeClick : () => handleColorClick(currentColor)}
          className="w-7 h-7 rounded-full border-4 border-slate-300 dark:border-slate-400 hover:border-slate-400 dark:hover:border-slate-300 transition-all shadow-sm"
          style={{ backgroundColor: currentColor }}
          title={isMonochrome ? "Monochrome (Selected)" : "Selected Color"}
        />
      </div>

      {/* Color Palette - Display other available colors (5 colors) */}
      <div className="flex items-center gap-1.5">
        {colorsToDisplay.map((color, index) => {
          const isColorMonochrome = normalizeColor(color) === "#6b7280";
          return (
            <button
              key={index}
              onClick={() => isColorMonochrome ? handleMonochromeClick() : handleColorClick(color)}
              className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all"
              style={{ backgroundColor: color }}
              title={isColorMonochrome ? "Monochrome" : `Color ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Template Name */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {templateName}
        </span>
      </div>
    </div>
  );
};

const TemplateShowcase = () => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateAccentColors, setTemplateAccentColors] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [gridColumns, setGridColumns] = useState(1); // 1, 2, or 3
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previousVisibleCount, setPreviousVisibleCount] = useState(0);

  // Detect grid layout based on window size
  useEffect(() => {
    const updateGridColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) { // lg breakpoint (3 columns)
        setGridColumns(3);
      } else if (width >= 768) { // md breakpoint (2 columns)
        setGridColumns(2);
      } else { // sm and below (1 column)
        setGridColumns(1);
      }
    };

    // Set initial grid columns
    updateGridColumns();
    setIsMounted(true);

    // Update on window resize
    window.addEventListener('resize', updateGridColumns);
    return () => window.removeEventListener('resize', updateGridColumns);
  }, []);

  // Calculate initial visible count based on grid layout
  useEffect(() => {
    if (isMounted) {
      let initialCount;
      
      if (gridColumns === 3) {
        initialCount = 3;
      } else if (gridColumns === 2) {
        initialCount = 2;
      } else {
        initialCount = 1;
      }

      // Set initial visible count on mount or adjust when grid changes
      setVisibleCount(prev => {
        // If this is the first time (prev is 0), set to initial
        if (prev === 0) {
          setPreviousVisibleCount(0);
          return initialCount;
        }
        // If grid changed and current count is less than new initial, adjust to new initial
        // Otherwise, keep the current count (user may have clicked "See More")
        const newCount = Math.max(prev, initialCount);
        // Update previous count if we're adjusting due to grid change
        if (prev < initialCount) {
          setPreviousVisibleCount(prev);
        }
        return newCount;
      });
    }
  }, [gridColumns, isMounted]);

  // Get increment value based on current grid layout
  const getIncrement = () => {
    if (gridColumns === 3) return 3;
    if (gridColumns === 2) return 2;
    return 3; // 1 column
  };

  const handleSeeMore = () => {
    const increment = getIncrement();
    
    // Show loading state immediately
    setIsLoadingMore(true);
    
    // Track previous count before updating
    setPreviousVisibleCount(visibleCount);
    
    // Wait 1.5 seconds before showing new templates
    setTimeout(() => {
      // Use startTransition to mark this as a non-urgent update
      // This allows React to keep the UI responsive while rendering
      startTransition(() => {
        setVisibleCount(prev => {
          const newCount = Math.min(prev + increment, TEMPLATE_GROUPS.length);
          return newCount;
        });
      });
      
      // Reset loading state after templates have had time to render
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 150);
    }, 1000);
  };

  const handlePreviewClick = (template) => {
    setSelectedTemplate(template);
    setPreviewModalOpen(true);
  };

  const handleCloseModal = () => {
    setPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleColorChange = (templateId, color) => {
    setTemplateAccentColors(prev => ({
      ...prev,
      [templateId]: color
    }));
  };

  // Pre-compute template data for performance
  const templatesWithData = useMemo(() => {
    return TEMPLATE_GROUPS.map(template => ({
      ...template,
      data: getTemplateData(template.id),
    }));
  }, []);

  return (
    <section
      id="templates"
      className="relative mt-24"
      aria-labelledby="template-showcase-heading"
    >
      {/* Clean container with responsive padding */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <header className="relative text-center mb-16 md:mb-20 lg:mb-24">
          <SectionBadge icon={LayoutGrid} label="Templates" className="mx-auto mb-6" />
          
          <h2 
            id="template-showcase-heading" 
            className="mt-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
          >
            <span className="block">Professional Templates</span>
            <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 animate-gradient bg-[length:200%_auto]">
              Built for Every Career Path
            </span>
          </h2>
          
          <p className="mt-8 text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
            Choose from <span className="font-bold text-slate-900 dark:text-slate-100">16+ professionally designed templates</span> that are{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">ATS-optimized</span>,{' '}
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">fully customizable</span>, and{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">crafted to make your experience shine</span>.
          </p>
          
          {/* Enhanced trust indicators with stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-10">
            <div className="flex items-center gap-3 px-5 py-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">ATS-Friendly</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">100% Compatible</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">PDF Ready</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Print Perfect</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Fully Customizable</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Colors & Layouts</div>
              </div>
            </div>
          </div>
        </header>

        {/* Grid Layout - Show only visible templates */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {isMounted && templatesWithData.slice(0, visibleCount).map((template, index) => {
              const TemplateIcon = template.icon || LayoutGrid;
              
              // Optimize animation for newly loaded templates
              // Newly loaded templates (index >= previousVisibleCount) get faster animations
              const isNewlyLoaded = index >= previousVisibleCount;
              const animationDelay = isNewlyLoaded 
                ? `${(index - previousVisibleCount) * 30}ms` // Faster for new items
                : `${index * 50}ms`; // Normal delay for existing items
              const animationDuration = isNewlyLoaded ? '0.4s' : '0.6s';
              
              // Check if this is the last template and if it's alone in its row
              const isLastTemplate = index === visibleCount - 1;
              // A template is alone in its row if the remainder is 1 (meaning last row has exactly 1 item)
              const isAloneInRow = gridColumns > 1 && visibleCount % gridColumns === 1;
              const shouldCenter = isLastTemplate && isAloneInRow;
              
              return (
                <article 
                  key={template.id} 
                  className={`group overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-500/15 via-cyan-500/8 to-purple-500/15 dark:from-blue-500/8 dark:via-cyan-500/5 dark:to-purple-500/8 shadow-sm transition-all duration-300 flex flex-col ${
                    shouldCenter 
                      ? gridColumns === 3 
                        ? 'lg:col-start-2' 
                        : gridColumns === 2 
                        ? 'md:col-start-1 md:col-span-2 md:max-w-md md:mx-auto' 
                        : ''
                      : ''
                  }`}
                  style={{
                    animation: `fadeInUp ${animationDuration} ease-out forwards`,
                    animationDelay: animationDelay,
                    opacity: 0,
                  }}
                >
                  {/* Template Preview - Hero Section - Fixed height container */}
                  <div 
                    className="relative overflow-hidden flex-shrink-0 bg-white dark:bg-slate-900"
                  >
                    <TemplatePreview 
                      templateId={template.id} 
                      onPreviewClick={() => handlePreviewClick(template)}
                      templateName={template.name}
                      accentColor={templateAccentColors[template.id]}
                    />
                  </div>
                  
                  {/* Template Controls - Below preview */}
                  <TemplateControls 
                    templateId={template.id}
                    templateName={template.name}
                    onPreviewClick={() => handlePreviewClick(template)}
                    selectedColor={templateAccentColors[template.id]}
                    onColorChange={(color) => handleColorChange(template.id, color)}
                  />
                </article>
              );
            })}
          </div>

          {/* See More Button - Show when there are more templates */}
          {isMounted && visibleCount < templatesWithData.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSeeMore}
                disabled={isLoadingMore}
                className="group relative px-8 py-4 bg-gradient-to-br from-blue-600/10 via-cyan-500/8 to-purple-600/10 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-600/30 hover:via-cyan-500/20 hover:to-purple-600/30 flex items-center gap-3 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoadingMore ? (
                    <>
                      Loading...
                      <Loader2 className="size-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      See More Templates
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                {!isLoadingMore && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/15 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (() => {
        const modalTemplateData = getTemplateData(selectedTemplate.id);
        const modalAccentColor = templateAccentColors[selectedTemplate.id] || modalTemplateData.accent_color || "#3B82F6";
        return (
          <TemplatePreviewModal
            isOpen={previewModalOpen}
            onClose={handleCloseModal}
            templateId={selectedTemplate.id}
            templateName={selectedTemplate.name}
            templateDescription={selectedTemplate.description}
            accentColor={modalAccentColor}
            sampleData={modalTemplateData}
            initialPaperSize="A4"
          />
        );
      })()}
    </section>
  );
};

export default TemplateShowcase;

