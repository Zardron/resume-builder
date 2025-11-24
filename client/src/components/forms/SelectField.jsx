import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Briefcase } from 'lucide-react';

const ICON_MAP = {
  building: Building2,
  briefcase: Briefcase,
};

const iconClassName = 'w-4 h-4 text-gray-500/80 dark:text-gray-300';

const SelectField = ({
  placeholder,
  value,
  onChange,
  icon,
  name,
  hasError,
  options = [],
  getOptionLabel,
  getOptionValue,
}) => {
  const IconComponent = icon ? ICON_MAP[icon] : null;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;
    const label = getOptionLabel ? getOptionLabel(option) : String(option);
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get display value
  const getDisplayValue = () => {
    if (!value) return '';
    const option = options.find((opt) => {
      const optValue = getOptionValue ? getOptionValue(opt) : opt;
      return String(optValue) === String(value);
    });
    if (option) {
      return getOptionLabel ? getOptionLabel(option) : String(option);
    }
    return value;
  };

  const handleSelect = (option) => {
    const selectedValue = getOptionValue ? getOptionValue(option) : option;
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const displayValue = getDisplayValue();

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`group relative flex items-center h-12 w-full bg-white dark:bg-gray-800 border-2 rounded-md overflow-hidden transition-all duration-300 ${
          hasError
            ? 'border-red-500 focus-within:border-red-500'
            : 'border-gray-200 dark:border-gray-600 focus-within:border-[var(--primary-color)] dark:focus-within:border-[var(--primary-color)]'
        } ${isOpen ? 'border-[var(--primary-color)] dark:border-[var(--primary-color)]' : ''}`}
      >
        {IconComponent && (
          <div className="flex w-14 h-full items-center justify-center">
            <IconComponent className={iconClassName} />
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="relative bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none text-sm w-full h-full px-4 py-3 cursor-pointer"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          readOnly={!isOpen}
        />

        <div className="flex w-10 h-full items-center justify-center pointer-events-none">
          <ChevronDown 
            className={`w-4 h-4 text-gray-500/80 dark:text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            {filteredOptions.map((option, index) => {
              const label = getOptionLabel ? getOptionLabel(option) : String(option);
              const optionValue = getOptionValue ? getOptionValue(option) : option;
              const isSelected = String(optionValue) === String(value);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[var(--primary-color)] bg-opacity-10 text-[var(--primary-color)] font-medium'
                      : 'text-gray-900 dark:text-gray-100 hover:bg-[var(--primary-color)] hover:bg-opacity-10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectField;

