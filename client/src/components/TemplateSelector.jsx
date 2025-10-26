import React, { useState, useRef, useCallback } from "react";
import { Check, Palette, RotateCcw, Eye } from "lucide-react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import TemplatePreviewModal from "./TemplatePreviewModal";

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, selectedColor, onColorSelect }) => {
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const [hue, setHue] = useState(240);
  const hueSliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState(null);

  // Helper function to convert HSL to HEX
  const hslToHex = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Handle hue slider click
  const handleHueClick = (e) => {
    console.log('Hue click event triggered:', e); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    if (hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newHue = Math.round(percentage * 360);
      
      console.log('Hue slider clicked:', { x, percentage, newHue, rect }); // Debug log
      
      setHue(newHue);
      
      // Update the color
      const newColor = hslToHex(newHue, 100, 50);
      onColorSelect && onColorSelect(newColor);
    } else {
      console.log('hueSliderRef.current is null'); // Debug log
    }
  };

  // Handle hue slider drag
  const updateHueFromEvent = useCallback((e) => {
    if (hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newHue = Math.round(percentage * 360);
      
      setHue(newHue);
      
      // Update the color
      const newColor = hslToHex(newHue, 100, 50);
      onColorSelect && onColorSelect(newColor);
    }
  }, [onColorSelect]);

  const handleMouseDown = useCallback((e) => {
    console.log('Mouse down event triggered:', e); // Debug log
    e.preventDefault();
    setIsDragging(true);
    updateHueFromEvent(e);
  }, [updateHueFromEvent]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      updateHueFromEvent(e);
    }
  }, [isDragging, updateHueFromEvent]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY
    };
    updateHueFromEvent(mouseEvent);
  }, [updateHueFromEvent]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY
      };
      updateHueFromEvent(mouseEvent);
    }
  }, [isDragging, updateHueFromEvent]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for drag functionality
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // 14 most common colors for resumes + custom color picker
  const colorSchemes = [
    // Row 1
    { name: "Blue", value: "#3B82F6" },
    { name: "Navy", value: "#1E40AF" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Red", value: "#EF4444" },
    
    // Row 2
    { name: "Orange", value: "#F59E0B" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Gray", value: "#6B7280" },
    { name: "Black", value: "#1F2937" },
    
    // Row 3
    { name: "Dark Blue", value: "#1E3A8A" },
    { name: "Dark Green", value: "#059669" },
    { name: "Maroon", value: "#DC2626" },
    { name: "Slate", value: "#475569" },
    { name: "Custom", value: "custom", isCustom: true }
  ];

  // Sample data for template previews
  const sampleData = {
    personal_info: {
      full_name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.com",
      profile_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0zNy41IDEyMEMzNy41IDEwNS41IDU0LjUgOTAgNzUgOTBTMTEyLjUgMTA1LjUgMTEyLjUgMTIwVjEzMEgzNy41VjEyMFoiIGZpbGw9IiM5QjlCOUIiLz4KPC9zdmc+"
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
      description: "Traditional, professional layout perfect for corporate environments",
      component: ClassicTemplate
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with bold headers and clean typography",
      component: ModernTemplate
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, minimalist design focusing on content and readability",
      component: MinimalTemplate
    },
    {
      id: "minimal-image",
      name: "Minimal with Image",
      description: "Minimalist design with space for a professional photo",
      component: MinimalImageTemplate
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
      {/* Color Scheme Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Color Scheme
          </h3>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.value}
              className={`cursor-pointer group transition-all duration-200 ${
                (scheme.isCustom && showCustomColorPicker) ? 'transform scale-105' : 
                (!scheme.isCustom && selectedColor === scheme.value && !showCustomColorPicker) ? 'transform scale-105' : 
                'hover:transform hover:scale-102'
              }`}
              onClick={() => {
                if (scheme.isCustom) {
                  setShowCustomColorPicker(!showCustomColorPicker);
                  // Clear any predefined color selection when opening custom picker
                  if (!showCustomColorPicker) {
                    onColorSelect && onColorSelect("");
                  }
                } else {
                  onColorSelect && onColorSelect(scheme.value);
                  setShowCustomColorPicker(false);
                }
              }}
            >
              <div className={`bg-white dark:bg-gray-800 rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
                (scheme.isCustom && showCustomColorPicker) ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' :
                (!scheme.isCustom && selectedColor === scheme.value && !showCustomColorPicker) ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' :
                'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}>
                {/* Color swatch */}
                <div className="relative p-2">
                  {scheme.isCustom ? (
                    <div className="w-full h-10 rounded-lg shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  ) : (
                    <div
                      className="w-full h-10 rounded-lg shadow-sm"
                      style={{ backgroundColor: scheme.value }}
                    >
                      {selectedColor === scheme.value && !showCustomColorPicker && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-gray-800" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Color name */}
                <div className="px-2 pb-2">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 text-center">
                    {scheme.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Color Picker */}
        {showCustomColorPicker && (
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Color Picker
                </h4>
                <button
                  onClick={() => setShowCustomColorPicker(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex gap-2">
                {/* Color Selection Area */}
                <div className="flex-1">
                  <div className="space-y-1">
                    {/* Main Color Field */}
                    <div className="relative">
                      <div className="w-full h-16 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden cursor-crosshair">
                        <div 
                          className="w-full h-full"
                          style={{ 
                            background: `linear-gradient(to right, white, ${selectedColor || '#3B82F6'}), linear-gradient(to bottom, transparent, black)` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Hue Slider */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hue
                      </label>
                      <div 
                        ref={hueSliderRef}
                        onClick={handleHueClick}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        className="relative h-3 rounded border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer select-none"
                      >
                        <div 
                          className="w-full h-full"
                          style={{
                            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                          }}
                        ></div>
                        {/* Hue indicator */}
                        <div 
                          className="absolute top-0 w-1 h-full bg-white border border-gray-400 rounded-sm shadow-sm pointer-events-none"
                          style={{ left: `${(hue / 360) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Color Information Panel */}
                <div className="w-32 space-y-1">
                  {/* Current Color Swatch */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preview
                    </label>
                    <div 
                      className="w-full h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: selectedColor || '#3B82F6' }}
                    ></div>
                  </div>
                  
                  {/* Hex Input */}
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Hex</label>
                    <input
                      type="text"
                      value={selectedColor || '#3B82F6'}
                      onChange={(e) => onColorSelect && onColorSelect(e.target.value)}
                      className="w-full px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono"
                    />
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => setShowCustomColorPicker(false)}
                    className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors mt-2"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
            const TemplateComponent = template.component;
            const isSelected = selectedTemplate === template.id;
            
            return (
              <div
                key={template.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 group ${
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

                {/* Centered Preview Overlay */}
                <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-md transition-all duration-300 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewTemplate(template);
                    }}
                    className="px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 transition-colors cursor-pointer"
                    style={{ 
                      backgroundColor: selectedColor || "#3B82F6",
                      color: "white"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = "1";
                    }}
                  >
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">Preview</span>
                  </button>
                </div>

                {/* Template preview */}
                <div 
                  className="bg-gray-50 dark:bg-gray-800 rounded-t-lg overflow-hidden"
                  onClick={() => onTemplateSelect && onTemplateSelect(template.id)}
                >
                  <div className="overflow-hidden h-[300px]">
                    <div className="scale-[0.4] origin-top-left w-[250%] h-[250%]">
                      <TemplateComponent 
                        data={sampleData} 
                        accentColor={selectedColor || "#3B82F6"}
                      />
                    </div>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
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
      />
    </div>
  );
};

export default TemplateSelector;