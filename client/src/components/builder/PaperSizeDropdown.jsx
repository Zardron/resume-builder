import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, LayoutTemplateIcon } from "lucide-react";

const PaperSizeDropdown = ({
  paperSizes,
  selectedPaperSize,
  onSelect,
  buttonLabel = "Paper Sizes",
  buttonClassName = "",
  dropdownClassName = "",
  menuWidthClass = "w-56",
  icon,
  getOptionId,
  getOptionLabel,
  getOptionDescription,
  renderButtonLabel,
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

  const options = useMemo(() => paperSizes ?? [], [paperSizes]);

  const resolveOptionId = useMemo(
    () =>
      getOptionId ||
      ((option) =>
        typeof option === "string" ? option : option?.id ?? option?.value ?? ""),
    [getOptionId]
  );

  const resolveOptionLabel = useMemo(
    () =>
      getOptionLabel ||
      ((option) =>
        typeof option === "string" ? option : option?.label ?? String(option)),
    [getOptionLabel]
  );

  const resolveOptionDescription = useMemo(
    () =>
      getOptionDescription ||
      ((option) =>
        typeof option === "object" && option !== null
          ? option?.dimensions ?? option?.description ?? ""
          : ""),
    [getOptionDescription]
  );

  const selectedOption = useMemo(
    () =>
      options.find(
        (option) => resolveOptionId(option) === selectedPaperSize
      ) ?? null,
    [options, resolveOptionId, selectedPaperSize]
  );

  useEffect(() => {
    setIsOpen(false);
  }, [selectedPaperSize]);

  const handleSelect = (id, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIsOpen(false);
    onSelect(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${hasCustomButtonSizing ? "" : "px-3 py-1.5 text-xs"} ${buttonClassName}`}
        type="button"
      >
        {icon ?? <LayoutTemplateIcon className="w-4 h-4" />}
        {renderButtonLabel ? renderButtonLabel(selectedOption) : buttonLabel}
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 ${menuWidthClass} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 p-3 space-y-1 ${dropdownClassName}`}
        >
          {options.map((option) => {
            const optionId = resolveOptionId(option);
            const optionLabel = resolveOptionLabel(option);
            const optionDescription = resolveOptionDescription(option);

            return (
              <button
                key={optionId || optionLabel}
                onClick={(event) => handleSelect(optionId, event)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors ${
                  selectedPaperSize === optionId
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                type="button"
              >
                <div className="font-semibold">{optionLabel}</div>
                {optionDescription ? (
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {optionDescription}
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

export default PaperSizeDropdown;

