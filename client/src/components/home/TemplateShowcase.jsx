import { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Sparkles, Eye, CheckCircle2, Zap, Award, TrendingUp, Circle, ChevronDown, Loader2, Rocket } from 'lucide-react';
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
import TemplatePreviewModal from '../TemplatePreviewModal';
import { templateDummyData } from '../../util/templateDummyData';

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
const TemplatePreview = ({ templateId, onPreviewClick, templateName, accentColor }) => {
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
      className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-t-md overflow-hidden group transition-all duration-500"
      style={{
        padding: '16px',
        height: `${scaledHeight + 32}px`, // Fixed height based on A4 scale + padding
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div 
        className="flex items-center justify-center w-full h-full"
        style={{ 
          pointerEvents: 'none',
        }}
      >
        {/* Container that shows full A4 template - fixed size */}
        <div 
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:shadow-[0_25px_80px_rgba(0,0,0,0.2)] group-hover:scale-[1.04]"
          style={{ 
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
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
  );
};

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
  const [visibleTemplatesCount, setVisibleTemplatesCount] = useState(3);
  const [newlyAddedTemplates, setNewlyAddedTemplates] = useState(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [templateAccentColors, setTemplateAccentColors] = useState({});

  const handlePreviewClick = (template) => {
    setSelectedTemplate(template);
    setPreviewModalOpen(true);
  };

  const handleCloseModal = () => {
    setPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleSeeMore = () => {
    setIsLoadingMore(true);
    
    // Show loader for a brief moment before revealing templates
    setTimeout(() => {
      const previousCount = visibleTemplatesCount;
      const newCount = Math.min(visibleTemplatesCount + 3, TEMPLATE_GROUPS.length);
      setVisibleTemplatesCount(newCount);
      
      // Track newly added templates for animation
      const newTemplates = new Set();
      for (let i = previousCount; i < newCount; i++) {
        newTemplates.add(TEMPLATE_GROUPS[i].id);
      }
      setNewlyAddedTemplates(newTemplates);
      
      // Hide loader and clear animation flag after animation completes
      setIsLoadingMore(false);
      setTimeout(() => {
        setNewlyAddedTemplates(new Set());
      }, 800);
    }, 500); // 500ms delay to show loader
  };

  const handleColorChange = (templateId, color) => {
    setTemplateAccentColors(prev => ({
      ...prev,
      [templateId]: color
    }));
  };

  // Get template display name mapping
  const getTemplateDisplayName = (templateId) => {
    const template = TEMPLATE_GROUPS.find(t => t.id === templateId);
    return template ? template.name : templateId.charAt(0).toUpperCase() + templateId.slice(1);
  };

  const visibleTemplates = TEMPLATE_GROUPS.slice(0, visibleTemplatesCount);
  const hasMoreTemplates = visibleTemplatesCount < TEMPLATE_GROUPS.length;

  return (
  <section
    id="templates"
    className="relative mt-24 px-4 md:px-16 lg:px-24 xl:px-32"
    aria-labelledby="template-showcase-heading"
  >
    {/* Enhanced background effects */}
    <div className="absolute -top-20 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[240px] dark:bg-blue-500/5" />
    <div className="absolute top-40 right-10 h-64 w-64 rounded-full bg-cyan-500/5 blur-[180px] dark:bg-cyan-500/3" />
    
    <header className="relative text-center mb-16">
      <SectionBadge icon={LayoutGrid} label="Templates" className="mx-auto mb-6" />
        <h2 id="template-showcase-heading" className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Professional Templates
          <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600">
            Built for Every Career Path
          </span>
      </h2>
        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Choose from our collection of <span className="font-semibold text-slate-900 dark:text-slate-100">professionally designed templates</span>. Each layout is <span className="font-semibold text-blue-600 dark:text-blue-400">ATS-optimized</span> and crafted to make your experience shine.
      </p>
      
      {/* Trust indicators */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          <span>ATS-Friendly</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          <span>PDF Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          <span>Fully Customizable</span>
        </div>
      </div>
    </header>

      {/* Grid Layout - 3 templates side by side */}
      <div className="relative mt-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleTemplates.map((template, index) => {
            const TemplateIcon = template.icon || LayoutGrid;
            const isNewlyAdded = newlyAddedTemplates.has(template.id);
            
            // Calculate delay based on position in grid (staggered animation)
            // For newly added templates, use their position in the visible list
            let animationDelay = 0;
            if (isNewlyAdded) {
              // Find the first newly added template index to calculate relative position
              const firstNewIndex = visibleTemplates.findIndex(t => newlyAddedTemplates.has(t.id));
              const relativeIndex = index - firstNewIndex;
              animationDelay = relativeIndex * 100; // Stagger by 100ms for each new template
            }
            
            return (
              <article 
                key={template.id} 
                className={`group overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col backdrop-blur-sm hover:border-blue-300/50 dark:hover:border-blue-600/50 ${
                  isNewlyAdded 
                    ? 'animate-fade-in-up opacity-0' 
                    : 'opacity-100'
                }`}
                style={{
                  animationDelay: isNewlyAdded ? `${animationDelay}ms` : '0ms',
                  animationFillMode: isNewlyAdded ? 'forwards' : 'none',
                }}
              >
                {/* Template Preview - Hero Section - Fixed height container */}
                <div className="relative overflow-hidden flex-shrink-0">
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

        {/* See More Button */}
        {hasMoreTemplates && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleSeeMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading Templates...</span>
                </>
              ) : (
                <>
                  <span>See More Templates</span>
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (() => {
        const modalTemplateData = getTemplateData(selectedTemplate.id);
        const modalAccentColor = modalTemplateData.accent_color || "#3B82F6";
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

