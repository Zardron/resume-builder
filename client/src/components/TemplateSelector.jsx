import React, { useState } from "react";
import { Check, Eye } from "lucide-react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import SpotlightTemplate from "./templates/SpotlightTemplate";
import TemplatePreviewModal from "./TemplatePreviewModal";
import ColorPicker from "../util/ColorPicker";

const TemplateSelector = ({ 
  selectedTemplate, 
  onTemplateSelect, 
  selectedColor, 
  onColorSelect,
  selectedPaperSize = "A4",
  onPaperSizeSelect
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState(null);

  // Sample data for template previews
  const sampleData = {
    personal_info: {
      full_name: "John Doe",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.com",
      profession: "Software Engineer",
      image: null, // No image to show default avatar
      profile_image: null // No image to show default avatar
    },
    professional_summary: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
    experience: [
      {
        position: "Senior Software Engineer",
        company: "Tech Corp",
        start_date: "2022-01",
        end_date: "",
        is_current: true,
        description: "Led development of scalable web applications using React and Node.js. Mentored junior developers and improved team productivity by 30%."
      },
      {
        position: "Software Engineer",
        company: "StartupXYZ",
        start_date: "2020-06",
        end_date: "2021-12",
        is_current: false,
        description: "Developed and maintained web applications. Collaborated with cross-functional teams to deliver high-quality software solutions."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science",
        field: "Computer Science",
        institution: "University of California",
        graduation_date: "2020-05",
        gpa: "3.8"
      }
    ],
    project: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce solution with React frontend and Node.js backend, serving 10,000+ users."
      },
      {
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates and team collaboration features."
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "MongoDB", "Git"]
  };

  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Professional layout perfect for corporate environments",
      component: ClassicTemplate
    },
    {
      id: "modern",
      name: "Modern",
      description: "Bold headers with contemporary design and typography",
      component: ModernTemplate
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean design focusing on content and readability",
      component: MinimalTemplate
    },
    {
      id: "minimal-image",
      name: "Spotlight",
      description: "Minimalist design with professional photo space",
      component: SpotlightTemplate
    }
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Choose Your Template
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select a template that best represents your professional style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            
            return (
              <div
                key={template.id}
                onClick={() => onTemplateSelect && onTemplateSelect(template.id)}
                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Template info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewTemplate(template);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Preview Drawer */}
      <TemplatePreviewModal
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        templateId={selectedTemplateForPreview?.id}
        templateName={selectedTemplateForPreview?.name}
        templateDescription={selectedTemplateForPreview?.description}
        accentColor={selectedColor || "#3B82F6"}
        sampleData={sampleData}
        onTemplateSelect={onTemplateSelect}
        initialPaperSize={selectedPaperSize}
        onPaperSizeChange={onPaperSizeSelect}
      />
    </div>
  );
};

export default TemplateSelector;