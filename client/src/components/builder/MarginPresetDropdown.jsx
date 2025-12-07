import { useState, useEffect, useRef } from "react";
import { ChevronDown, Maximize2 } from "lucide-react";

const MarginPresetDropdown = ({
  presets,
  currentPresetId,
  onSelect,
  customPresetLabel = "Custom margins applied",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [currentPresetId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (id, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors h-7 whitespace-nowrap"
        type="button"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        Margins
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-3 space-y-2">
          {currentPresetId === "custom" && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {customPresetLabel}
            </p>
          )}
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={(event) => handleSelect(preset.id, event)}
              className={`w-full text-left px-2 py-1 text-xs rounded-md transition-colors ${
                currentPresetId === preset.id
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              type="button"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarginPresetDropdown;

