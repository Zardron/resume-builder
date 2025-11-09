import { useState, useEffect, useRef } from "react";
import { ChevronDown, LayoutTemplateIcon } from "lucide-react";

const PaperSizeDropdown = ({
  paperSizes,
  selectedPaperSize,
  onSelect,
  buttonLabel = "Paper Sizes",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleSelect = (id) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        type="button"
      >
        <LayoutTemplateIcon className="w-4 h-4" />
        {buttonLabel}
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-3 space-y-1">
          {paperSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSelect(size.id)}
              className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors ${
                selectedPaperSize === size.id
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              type="button"
            >
              <div className="font-semibold">{size.label}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                {size.dimensions}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaperSizeDropdown;

