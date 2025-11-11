/**
 * Font Size Utility Functions
 * Centralized font size management for all resume templates
 */

/**
 * Get font size class based on section and size setting
 * @param {Object} sectionFontSizes - Object containing font size settings for each section
 * @param {string} section - The section name (e.g., 'name', 'title', 'summary')
 * @param {string} defaultSize - Default size if section not found ('small', 'medium', 'large')
 * @returns {string} Tailwind CSS class for font size
 */
export const getSectionFontSize = (sectionFontSizes, section, defaultSize = 'medium') => {
    const size = sectionFontSizes[section] || defaultSize;
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm', 
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap[defaultSize];
};

/**
 * Get name font size (larger than other sections)
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for name font size
 */
export const getNameFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.name || 'large';
    const sizeMap = {
        extra_small: 'text-base',
        small: 'text-lg',
        medium: 'text-xl',
        large: 'text-2xl'
    };
    return sizeMap[size] || sizeMap.large;
};

/**
 * Get section header font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for section header font size
 */
export const getSectionHeaderFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.section_headers || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get date font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for date font size
 */
export const getDateFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.dates || 'small';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.small;
};

/**
 * Get company name font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for company name font size
 */
export const getCompanyFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.company_names || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get location font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for location font size
 */
export const getLocationFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.location || 'small';
    const sizeMap = {
        extra_small: 'text-[9px]',
        small: 'text-[10px]',
        medium: 'text-xs',
        large: 'text-sm'
    };
    return sizeMap[size] || sizeMap.small;
};

/**
 * Get job title font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for job title font size
 */
export const getJobTitleFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.title || 'medium';
    const sizeMap = {
        extra_small: 'text-xs',
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get contact details font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for contact details font size
 */
export const getContactDetailsFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.contact_details || 'small';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.small;
};

/**
 * Get summary font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for summary font size
 */
export const getSummaryFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.summary || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get experience font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for experience font size
 */
export const getExperienceFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.experience || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get job descriptions font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for job descriptions font size
 */
export const getJobDescriptionsFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.job_descriptions || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get education font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for education font size
 */
export const getEducationFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.education || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get projects font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for projects font size
 */
export const getProjectsFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.projects || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Get skills font size
 * @param {Object} sectionFontSizes - Object containing font size settings
 * @returns {string} Tailwind CSS class for skills font size
 */
export const getSkillsFontSize = (sectionFontSizes) => {
    const size = sectionFontSizes.skills || 'medium';
    const sizeMap = {
        extra_small: 'text-[10px]',
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };
    return sizeMap[size] || sizeMap.medium;
};

/**
 * Calculate text color based on background color brightness
 * Returns 'black' or 'white' depending on the luminance of the background color
 * @param {string} backgroundColor - Hex color (e.g., '#FFFFFF' or '#000000')
 * @returns {string} - 'black' or 'white'
 */
export const getTextColorForBackground = (backgroundColor) => {
    // Handle null, undefined, or invalid colors
    if (!backgroundColor || backgroundColor === '#FFFFFF' || backgroundColor === '#FFF' || backgroundColor === 'white' || backgroundColor === '#ffffff') {
        return 'black';
    }
    
    if (backgroundColor === '#000000' || backgroundColor === '#000' || backgroundColor === 'black' || backgroundColor === '#000000') {
        return 'white';
    }
    
    // Remove # if present
    let hex = backgroundColor.replace('#', '');
    
    // Handle 3-digit hex codes
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate relative luminance using the formula from WCAG 2.0
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const getLuminance = (val) => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    };
    
    const luminance = 0.2126 * getLuminance(r) + 0.7152 * getLuminance(g) + 0.0722 * getLuminance(b);
    
    // If luminance is greater than 0.5, use black text, otherwise use white text
    return luminance > 0.5 ? 'black' : 'white';
};

/**
 * Default font size configuration
 * This can be easily modified to change default sizes across all templates
 */
export const DEFAULT_FONT_SIZES = {
    name: "large",
    title: "medium",
    summary: "medium",
    experience: "medium",
    education: "medium",
    projects: "medium",
    skills: "small",
    soft_skills: "small",
    languages: "small",
    certifications: "small",
    achievements: "small",
    volunteer_work: "small",
    contact: "small",
    personal_info: "medium",
    contact_details: "small",
    section_headers: "medium",
    dates: "small",
    company_names: "medium",
    job_descriptions: "medium",
    location: "small"
};
