import React, { useState } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import SpotlightTemplate from "./templates/SpotlightTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import TechnicalTemplate from "./templates/TechnicalTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import CorporateTemplate from "./templates/CorporateTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import BusinessTemplate from "./templates/BusinessTemplate";
import FormalTemplate from "./templates/FormalTemplate";
import DynamicTemplate from "./templates/DynamicTemplate";
import AcademicTemplate from "./templates/AcademicTemplate";
import StartupTemplate from "./templates/StartupTemplate";
import TemplatePreviewModal from "./TemplatePreviewModal";
import ColorPicker from "../util/ColorPicker";
import { templateDummyData } from "../util/templateDummyData";

// Template ID to dummy data index mapping (from TemplateShowcase)
const TEMPLATE_DATA_MAP = {
  classic: 0,
  modern: 1,
  technical: 2,
  business: 3,
  corporate: 4,
  creative: 5,
  minimal: 6,
  professional: 7,
  elegant: 8,
  executive: 9,
  spotlight: 10,
  formal: 11,
  dynamic: 12,
  academic: 13,
  startup: 14,
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
  return templateDummyData[0];
};

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
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const PREVIEW_SCALE = 0.35;

// Template Preview Component
const TemplatePreview = ({ templateId, accentColor }) => {
  const TemplateComponent = templateComponents[templateId];

  if (!TemplateComponent) {
    return null;
  }

  const templateData = getTemplateData(templateId);
  const finalAccentColor =
    accentColor || templateData.accent_color || "#3B82F6";

  // Fixed dimensions based on A4 size and scale
  const scaledWidth = A4_WIDTH * PREVIEW_SCALE;
  const scaledHeight = A4_HEIGHT * PREVIEW_SCALE;

  return (
    <div
      className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 overflow-hidden"
      style={{
        padding: "16px",
        height: `${scaledHeight + 32}px`, // Fixed height based on A4 scale + padding
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="flex items-center justify-center w-full h-full"
        style={{
          pointerEvents: "none",
        }}
      >
        {/* Container that shows full A4 template - fixed size */}
        <div
          className="relative bg-white rounded-md shadow-2xl overflow-hidden scale-105"
          style={{
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
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
              transformOrigin: "top left",
              overflow: "hidden", // Ensure content doesn't overflow A4 bounds
            }}
          >
            <div
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                overflow: "hidden", // Constrain content to A4 size
                position: "relative",
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

const TemplateSelector = ({
  selectedTemplate,
  onTemplateSelect,
  selectedColor,
  onColorSelect,
  selectedPaperSize = "A4",
  onPaperSizeSelect,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] =
    useState(null);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Professional layout perfect for corporate environments",
      component: ClassicTemplate,
    },
    {
      id: "modern",
      name: "Modern",
      description: "Bold headers with contemporary design and typography",
      component: ModernTemplate,
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean design focusing on content and readability",
      component: MinimalTemplate,
    },
    {
      id: "spotlight",
      name: "Spotlight",
      description: "Minimalist design with professional photo space",
      component: SpotlightTemplate,
    },
    {
      id: "executive",
      name: "Executive",
      description: "Two-column layout with sidebar for executive positions",
      component: ExecutiveTemplate,
    },
    {
      id: "creative",
      name: "Creative",
      description:
        "Colorful, artistic design perfect for creative professionals",
      component: CreativeTemplate,
    },
    {
      id: "technical",
      name: "Technical",
      description: "Code-focused design ideal for developers and engineers",
      component: TechnicalTemplate,
    },
    {
      id: "elegant",
      name: "Elegant",
      description: "Sophisticated, refined design with elegant typography",
      component: ElegantTemplate,
    },
    {
      id: "corporate",
      name: "Corporate",
      description:
        "Structured, formal layout perfect for corporate environments",
      component: CorporateTemplate,
    },
    {
      id: "professional",
      name: "Professional",
      description:
        "Clean, ATS-friendly design optimized for applicant tracking systems",
      component: ProfessionalTemplate,
    },
    {
      id: "business",
      name: "Business",
      description:
        "Professional design with subtle accent bars and structured layout",
      component: BusinessTemplate,
    },
    {
      id: "formal",
      name: "Formal",
      description: "Very formal, traditional layout with centered sections",
      component: FormalTemplate,
    },
    {
      id: "dynamic",
      name: "Dynamic",
      description: "Energetic design with bold sections and modern styling",
      component: DynamicTemplate,
    },
    {
      id: "academic",
      name: "Academic",
      description: "Perfect for researchers, academics, and PhD holders",
      component: AcademicTemplate,
    },
    {
      id: "startup",
      name: "Startup",
      description: "Modern, fresh design perfect for startup culture",
      component: StartupTemplate,
    },
  ];

  const handlePreviewTemplate = (template) => {
    setSelectedTemplateForPreview(template);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTemplateForPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white dark:bg-gray-900">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Choose Your Template
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a template that best represents your professional style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <div
                key={template.id}
                className={`group relative rounded-md border-1 overflow-hidden transition-all duration-200 bg-white dark:bg-gray-600 border-blue-500`}
              >
                {/* Template Preview */}
                <div className="relative">
                  <TemplatePreview
                    onClick={() => handlePreviewTemplate(template)}
                    templateId={template.id}
                    accentColor={selectedColor || "#3B82F6"}
                  />
                </div>

                {/* Template Name Badge and Use Template Button */}
                <div className="px-3 py-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm">
                    {template.name}
                  </span>
                  <button
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        onTemplateSelect(template.id);
                      }
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {isSelected ? "Selected" : "Use This Template"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplateForPreview && (
        <TemplatePreviewModal
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          templateId={selectedTemplateForPreview.id}
          templateName={selectedTemplateForPreview.name}
          templateDescription={selectedTemplateForPreview.description}
          accentColor={selectedColor || "#3B82F6"}
          sampleData={getTemplateData(selectedTemplateForPreview.id)}
          onTemplateSelect={onTemplateSelect}
          initialPaperSize={selectedPaperSize}
          onPaperSizeChange={onPaperSizeSelect}
        />
      )}
    </div>
  );
};

export default TemplateSelector;
