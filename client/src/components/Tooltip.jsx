import { useState, useRef, useEffect } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 200,
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100',
  };

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // Handle mouse leave on tooltip itself to prevent flickering
  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content) return children;

  return (
    <div className="relative inline-block w-full">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="w-full"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-[100] pointer-events-auto ${positionClasses[position]}`}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          role="tooltip"
          aria-live="polite"
        >
          <div className="relative bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg px-3 py-2 shadow-xl max-w-xs whitespace-nowrap">
            {content}
            <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

