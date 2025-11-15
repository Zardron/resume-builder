import { useEffect, useMemo, useRef, useState } from "react";
import { Type } from "lucide-react";

const FontDropdown = ({
  fontOptions,
  selectedFont,
  onSelect,
  buttonClassName = "",
  dropdownClassName = "",
  menuWidthClass = "w-full",
  icon = <Type className="w-4 h-4" />,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hasCustomButtonSizing = Boolean(buttonClassName);

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

  const options = useMemo(() => fontOptions ?? [], [fontOptions]);

  const selectedOption = useMemo(
    () =>
      options.find((option) => option?.id === selectedFont) ?? null,
    [options, selectedFont]
  );

  useEffect(() => {
    setIsOpen(false);
  }, [selectedFont]);

  const describeFontFamily = (description) =>
    description?.toLowerCase().includes("serif") ? "serif" : "sans-serif";

  const fallbackFamily = describeFontFamily(selectedOption?.description ?? "");

  const handleSelect = (fontId, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (!fontId) return;
    setIsOpen(false);
    onSelect(fontId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${hasCustomButtonSizing ? "" : "px-3 py-2 text-sm"} ${buttonClassName}`}
        type="button"
      >
        {icon}
        <div className="flex-1 text-left">
          {selectedOption ? (
            <>
              <span
                className="block font-semibold leading-tight"
                style={{
                  fontFamily: `'${selectedOption.label}', ${fallbackFamily}`,
                }}
              >
                {selectedOption.label}
              </span>
              {selectedOption.description ? (
                <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
                  {selectedOption.description}
                </span>
              ) : null}
            </>
          ) : (
            <span>Select font</span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 ${menuWidthClass} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-3 space-y-1 ${dropdownClassName}`}
        >
          {options.map((option) => {
            const fallback = describeFontFamily(option?.description ?? "");
            return (
              <button
                key={option?.id ?? option?.label}
                onClick={(event) => handleSelect(option?.id, event)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedFont === option?.id
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                type="button"
              >
                <div
                  className="font-semibold"
                  style={{ fontFamily: `'${option?.label}', ${fallback}` }}
                >
                  {option?.label}
                </div>
                {option?.description ? (
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FontDropdown;


