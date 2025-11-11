import React, { useState, useRef, useCallback, useEffect } from "react";
import { Palette } from "lucide-react";

const ColorPicker = ({
  selectedColor,
  onColorSelect,
  title = "Choose Color",
  description = "Customize your resume's accent color",
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [hue, setHue] = useState(240);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexInput, setHexInput] = useState('');
  const hueSliderRef = useRef(null);
  const colorFieldRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Default color presets
  const defaultColors = [
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F43F5E", // Rose
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#F97316", // Orange
    "#84CC16", // Lime
    "#10B981", // Green
    "#14B8A6", // Teal
    "#06B6D4", // Cyan
    "#0EA5E9", // Sky
    "#6366F1", // Indigo
    "#8B5A3C", // Brown
    "#1F2937"  // Dark Gray
  ];

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

  // Helper function to convert HEX to HSL
  const hexToHsl = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Initialize HSL from selectedColor
  useEffect(() => {
    if (selectedColor) {
      const hsl = hexToHsl(selectedColor);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setHexInput(selectedColor.replace('#', '').toUpperCase());
    } else {
      // Clear hexInput when selectedColor is null or empty
      setHexInput('');
    }
  }, [selectedColor]);

  // Update hex input when HSL values change (from color picker interaction)
  useEffect(() => {
    if (showCustomPicker) {
      setHexInput(hslToHex(hue, saturation, lightness).replace('#', '').toUpperCase());
    }
  }, [hue, saturation, lightness, showCustomPicker]);

  // Handle hue slider click
  const handleHueClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newHue = Math.round(percentage * 360);
      
      setHue(newHue);
      const newColor = hslToHex(newHue, saturation, lightness);
      onColorSelect && onColorSelect(newColor);
    }
  };

  // Handle main color field click
  const handleColorFieldClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (colorFieldRef.current) {
      const rect = colorFieldRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const saturationPercentage = Math.max(0, Math.min(1, x / rect.width));
      const newSaturation = Math.round(saturationPercentage * 100);
      
      const lightnessPercentage = Math.max(0, Math.min(1, 1 - (y / rect.height)));
      const newLightness = Math.round(lightnessPercentage * 100);
      
      setSaturation(newSaturation);
      setLightness(newLightness);
      
      const newColor = hslToHex(hue, newSaturation, newLightness);
      onColorSelect && onColorSelect(newColor);
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
      const newColor = hslToHex(newHue, saturation, lightness);
      onColorSelect && onColorSelect(newColor);
    }
  }, [onColorSelect, saturation, lightness]);

  const handleMouseDown = useCallback((e) => {
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

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    updateHueFromEvent({ clientX: touch.clientX, clientY: touch.clientY });
  }, [updateHueFromEvent]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      updateHueFromEvent({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }, [isDragging, updateHueFromEvent]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for drag functionality
  useEffect(() => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {description ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
        >
          <div 
            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: selectedColor || "#3B82F6" }}
          ></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedColor ? selectedColor.toUpperCase() : 'Blue'}
          </span>
        </button>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Select Color
              </h4>
              <button
                onClick={() => {
                  setShowColorPicker(false);
                  setShowCustomPicker(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Default Color Presets */}
            <div>
              <div className="grid grid-cols-8 gap-2 auto-rows-fr">
                {defaultColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onColorSelect && onColorSelect(color);
                      setShowColorPicker(false);
                    }}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedColor === color 
                        ? 'border-gray-900 dark:border-gray-100 ring-2 ring-offset-2' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {/* Custom Color Button */}
                <button
                  onClick={() => setShowCustomPicker(!showCustomPicker)}
                  className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 transition-all hover:scale-110 flex items-center justify-center bg-gray-100 dark:bg-gray-700 cursor-pointer"
                  title="Custom Color"
                >
                  <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Custom Color Picker */}
            {showCustomPicker && (
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex gap-4">
              {/* Color Selection Area */}
              <div className="flex-1">
                <div className="space-y-2">
                  {/* Main Color Field */}
                  <div className="relative">
                    <div 
                      ref={colorFieldRef}
                      onClick={handleColorFieldClick}
                      className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden cursor-crosshair"
                    >
                      <div 
                        className="w-full h-full"
                        style={{ 
                          background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), linear-gradient(to bottom, transparent, black)` 
                        }}
                      ></div>
                      {/* Color indicator */}
                      <div 
                        className="absolute w-4 h-4 bg-white border-2 border-gray-400 rounded-full shadow-sm pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                        style={{ 
                          left: `${saturation}%`, 
                          top: `${100 - lightness}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Hue Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hue
                    </label>
                    <div 
                      ref={hueSliderRef}
                      onClick={handleHueClick}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      className="relative h-4 rounded border border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer select-none"
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
              <div className="w-40 space-y-3">
                {/* Current Color Swatch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </label>
                  <div 
                    className="w-full h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: hslToHex(hue, saturation, lightness) }}
                  ></div>
                </div>
                
                {/* Hex Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Hex Code</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono">#</span>
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) => {
                        let hexValue = e.target.value;
                        // Only allow hexadecimal characters and convert to uppercase
                        hexValue = hexValue.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
                        // Limit to 6 characters
                        if (hexValue.length <= 6) {
                          setHexInput(hexValue);
                          if (hexValue.length === 6) {
                            // Complete hex code - update color
                            const fullHex = `#${hexValue}`;
                            const hsl = hexToHsl(fullHex);
                            setHue(hsl.h);
                            setSaturation(hsl.s);
                            setLightness(hsl.l);
                            onColorSelect && onColorSelect(fullHex);
                          } else if (hexValue.length === 0) {
                            // Empty input - clear the color
                            onColorSelect && onColorSelect(null);
                          }
                        }
                      }}
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono"
                      placeholder="3B82F6"
                      maxLength={6}
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setHue(240);
                      setSaturation(100);
                      setLightness(50);
                      onColorSelect && onColorSelect("#3B82F6");
                    }}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
