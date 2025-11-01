import React, { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import referenceData from "../util/referenceData.json";

const EmailInputField = ({
  placeholder,
  value,
  onChange,
  name,
  hasError,
  width,
  onBlur,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Common email domains from reference data - ordered by popularity (most popular first)
  const emailDomains = referenceData.emailDomains;

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (inputValue) => {
    onChange(inputValue);

    // Only show suggestions if there's text and no @ symbol yet, or incomplete domain
    if (inputValue && inputValue.trim() !== '') {
      const atIndex = inputValue.indexOf('@');
      
      if (atIndex === -1) {
        // No @ yet, show all suggestions with the username
        const username = inputValue.trim();
        const newSuggestions = emailDomains.map(domain => username + domain);
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } else {
        // Has @, filter domains based on what's typed after @
        const username = inputValue.substring(0, atIndex);
        const domainPart = inputValue.substring(atIndex).toLowerCase();
        
        if (username.length > 0) {
          const filteredDomains = emailDomains.filter(domain => 
            domain.toLowerCase().startsWith(domainPart)
          );
          
          if (filteredDomains.length > 0) {
            const newSuggestions = filteredDomains.map(domain => username + domain);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        }
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`group relative flex items-center h-12 ${
          width ? width : "w-full"
        } bg-white dark:bg-gray-800 border-2 rounded-xl overflow-hidden gap-0 transition-all duration-300 ${
          hasError
            ? "border-red-500 focus-within:border-red-500"
            : "border-gray-200 dark:border-gray-600 focus-within:border-[var(--primary-color)] dark:focus-within:border-[var(--primary-color)]"
        }`}
      >
        <div
          className={`flex w-14 h-full items-center justify-center ${
            hasError && "bg-transparent"
          }`}
        >
          <div className="flex items-center justify-center w-full h-full">
            <Mail className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
          </div>
        </div>
        <input
          ref={inputRef}
          type="email"
          placeholder={placeholder}
          className="relative bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none text-sm w-full h-full px-4 py-3"
          autoComplete="off"
          value={value || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          name={name}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-[var(--primary-color)] hover:bg-opacity-10 rounded-lg transition-colors duration-150 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailInputField;

