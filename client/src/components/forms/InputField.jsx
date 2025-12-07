import { useState, useRef, useEffect } from 'react';
import {
  Mail, Lock, User, FileText, PencilIcon, Phone, MapPin, Briefcase,
  Linkedin, Globe, Loader2, Check, Twitter, Github, Instagram, Youtube,
  Facebook, MessageCircle, Building2, Calendar, ChevronDown
} from 'lucide-react';

const ICON_MAP = {
  email: Mail,
  password: Lock,
  user: User,
  title: FileText,
  phone: Phone,
  'map-pin': MapPin,
  briefcase: Briefcase,
  linkedin: Linkedin,
  globe: Globe,
  twitter: Twitter,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  telegram: MessageCircle,
  building: Building2,
  calendar: Calendar,
};

const iconClassName = 'w-4 h-4 text-gray-500/80 dark:text-gray-300';

const InputField = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  icon,
  name,
  hasError,
  width,
  readOnly,
  showEditIcon,
  onEditClick,
  onBlur,
  isTyping,
  isTypingComplete,
  isTitleConfirmed,
  autoComplete,
  inputMode,
  options, // Array of options for autocomplete
  getOptionLabel, // Function to get display label from option (for objects)
  getOptionValue, // Function to get value from option (for objects)
  required = false,
}) => {
  const IconComponent = icon ? ICON_MAP[icon] : null;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter options based on input value
  useEffect(() => {
    if (options && value !== undefined && value !== null) {
      const searchTerm = String(value).toLowerCase();
      const filtered = options.filter((option) => {
        const label = getOptionLabel ? getOptionLabel(option) : String(option);
        return label.toLowerCase().includes(searchTerm);
      });
      setFilteredOptions(filtered);
      setShowSuggestions(searchTerm.length > 0 && filtered.length > 0);
    } else {
      setFilteredOptions([]);
      setShowSuggestions(false);
    }
  }, [value, options, getOptionLabel]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (options) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [options]);

  const handleInputChange = (inputValue) => {
    onChange(inputValue);
  };

  const handleSuggestionClick = (option) => {
    const selectedValue = getOptionValue ? getOptionValue(option) : option;
    const selectedLabel = getOptionLabel ? getOptionLabel(option) : String(option);
    onChange(selectedLabel);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Enter' && showSuggestions && filteredOptions.length > 0) {
      handleSuggestionClick(filteredOptions[0]);
    }
  };

  const handleFocus = () => {
    if (options && value) {
      const searchTerm = String(value).toLowerCase();
      const filtered = options.filter((option) => {
        const label = getOptionLabel ? getOptionLabel(option) : String(option);
        return label.toLowerCase().includes(searchTerm);
      });
      setFilteredOptions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  return (
    <div className="relative" style={{ width: width || '100%' }}>
      <div
        className={`group relative flex items-center h-12 ${
          width || 'w-full'
        } bg-white dark:bg-gray-800 border-2 rounded-md overflow-hidden transition-all duration-300 ${
          hasError
            ? 'border-red-500 focus-within:border-red-500'
            : 'border-gray-200 dark:border-gray-600 focus-within:border-[var(--primary-color)] dark:focus-within:border-[var(--primary-color)]'
        }`}
      >
        {IconComponent && (
          <div className="flex w-14 h-full items-center justify-center">
            <IconComponent className={iconClassName} />
          </div>
        )}
        
        <input
          ref={inputRef}
          readOnly={readOnly}
          id={id || name}
          type={type}
          placeholder={placeholder}
          className="relative bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none text-sm w-full h-full py-3"
          autoComplete={autoComplete || (type === 'email' ? 'email' : 'off')}
          inputMode={inputMode}
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={onBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          name={name}
          required={required}
        />

        {options && (
          <div className="flex w-10 h-full items-center justify-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
          </div>
        )}

        {(isTyping || isTypingComplete) && !isTitleConfirmed && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {isTyping && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
            {isTypingComplete && <Check className="w-4 h-4 text-green-500" />}
          </div>
        )}

        {showEditIcon && (
          <button
            type="button"
            onClick={onEditClick}
            className="px-3 py-2 text-[var(--primary-color)] opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {showSuggestions && filteredOptions.length > 0 && options && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            {filteredOptions.map((option, index) => {
              const label = getOptionLabel ? getOptionLabel(option) : String(option);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(option)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-[var(--primary-color)] hover:bg-opacity-10 rounded-md transition-colors"
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

export default InputField;
