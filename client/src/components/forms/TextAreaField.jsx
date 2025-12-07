import { useRef } from 'react';

const TextAreaField = ({
  id,
  placeholder,
  value,
  onChange,
  name,
  hasError,
  width,
  readOnly,
  rows = 4,
  className = '',
  required = false,
}) => {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative" style={{ width: width || '100%' }}>
      <div
        className={`group relative bg-white dark:bg-gray-800 border-2 rounded-md overflow-hidden transition-all duration-300 ${
          hasError
            ? 'border-red-500 focus-within:border-red-500'
            : 'border-gray-200 dark:border-gray-600 focus-within:border-[var(--primary-color)] dark:focus-within:border-[var(--primary-color)]'
        } ${className}`}
      >
        <textarea
          ref={textareaRef}
          readOnly={readOnly}
          id={id || name}
          placeholder={placeholder}
          className="relative bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none text-sm w-full px-4 py-3 resize-none"
          value={value || ''}
          onChange={handleChange}
          name={name}
          rows={rows}
          required={required}
        />
      </div>
    </div>
  );
};

export default TextAreaField;
