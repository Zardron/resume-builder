import React, { useRef, useState, useEffect, useCallback } from "react";
import InputField from "../../../components/InputField";
import EmailInputField from "../../../components/EmailInputField";
import { UploadIcon, X, SparklesIcon, Loader2, Plus, Trash2 } from "lucide-react";

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
  onValidationChange,
}) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [selectedSocialLinks, setSelectedSocialLinks] = useState([]);
  const validationRef = useRef();

  // Available social platforms
  const availableSocialPlatforms = [
    { id: 'twitter', label: 'Twitter', icon: 'twitter', placeholder: 'Twitter Profile' },
    { id: 'github', label: 'GitHub', icon: 'github', placeholder: 'GitHub Profile' },
    { id: 'instagram', label: 'Instagram', icon: 'instagram', placeholder: 'Instagram Profile' },
    { id: 'youtube', label: 'YouTube', icon: 'youtube', placeholder: 'YouTube Channel' },
    { id: 'facebook', label: 'Facebook', icon: 'facebook', placeholder: 'Facebook Profile' },
    { id: 'telegram', label: 'Telegram', icon: 'telegram', placeholder: 'Telegram Username' },
  ];

  // Add social link to selected list
  const addSocialLink = (platform) => {
    if (!selectedSocialLinks.find(link => link.id === platform.id)) {
      setSelectedSocialLinks([...selectedSocialLinks, platform]);
    }
  };

  // Remove social link from selected list
  const removeSocialLink = (platformId) => {
    setSelectedSocialLinks(selectedSocialLinks.filter(link => link.id !== platformId));
    // Clear the field value when removing
    onImageChange(platformId, '');
  };

  // Personal info fields configuration
  const personalInfo = [
    {
      label: "Full Name",
      icon: "user",
      width: "w-1/2",
      placeholder: "Full Name",
      type: "text",
      name: "name",
      value: data?.name ?? '',
      onChange: (value) => onImageChange("name", value),
    },
    {
      label: "Email",
      icon: "email",
      width: "w-1/2",
      placeholder: "your.name@gmail.com",
      type: "email",
      name: "email",
      value: data?.email ?? '',
      onChange: (value) => onImageChange("email", value),
    },
    {
      label: "Phone",
      icon: "phone",
      width: "w-1/2",
      placeholder: "0917 123 4567 or +63 917 123 4567",
      type: "tel",
      name: "phone",
      value: data?.phone ?? '',
      onChange: (value) => onImageChange("phone", value),
      autoComplete: "tel",
      inputMode: "numeric",
    },
    {
      label: "Address",
      icon: "map-pin",
      width: "w-1/2",
      placeholder: "Address",
      type: "text",
      name: "address",
      value: data?.address ?? '',
      onChange: (value) => onImageChange("address", value),
    },
    {
      label: "Profession",
      icon: "briefcase",
      width: "w-1/2",
      placeholder: "Profession",
      type: "text",
      name: "profession",
      value: data?.profession ?? '',
      onChange: (value) => onImageChange("profession", value),
    },
    {
      label: "LinkedIn",
      icon: "linkedin",
      width: "w-1/2",
      placeholder: "LinkedIn",
      type: "text",
      name: "linkedin",
      value: data?.linkedin ?? '',
      onChange: (value) => onImageChange("linkedin", value),
    },
    {
      label: "Website",
      icon: "globe",
      width: "w-1/2",
      placeholder: "Personal Website",
      type: "url",
      name: "website",
      value: data?.website ?? '',
      onChange: (value) => onImageChange("website", value),
    },
    // Add selected social links dynamically
    ...selectedSocialLinks.map(platform => ({
      label: platform.label,
      icon: platform.icon,
      width: "w-1/2",
      placeholder: platform.placeholder,
      type: platform.id === 'telegram' ? 'text' : 'url',
      name: platform.id,
      value: data?.[platform.id] ?? '',
      onChange: (value) => onImageChange(platform.id, value),
      isSocialLink: true,
      platformId: platform.id,
    })),
  ];


  // Validate fields if empty
  const validateField = (field, value) => {
    const requiredFields = ['name', 'email', 'phone', 'address', 'profession'];
    const isEmpty = !value || value.trim() === '';
    
    if (requiredFields.includes(field) && isEmpty) {
      setValidationErrors(prev => ({ ...prev, [field]: true }));
      return false;
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  // Validate all fields
  const validateAllFields = useCallback(() => {
    const requiredFields = ['name', 'email', 'phone', 'address', 'profession'];
    const errors = {};
    let hasErrors = false;

    requiredFields.forEach(field => {
      const value = data?.[field];
      if (!value || value.trim() === '') {
        errors[field] = true;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    
    return !hasErrors;
  }, [data]);

  // Store the validation function in ref and expose to parent
  useEffect(() => {
    validationRef.current = validateAllFields;
  }, [validateAllFields]);

  // Expose validation function to parent only once on mount
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(() => validationRef.current());
    }
  }, []); // Empty dependency array - only run on mount

  // Format Philippine phone number - only allows numbers
  const formatPhilippinePhone = (value) => {
    // Remove all non-digit characters (letters, special characters, etc.)
    const cleaned = value.replace(/\D/g, '');
    
    // Return empty if no digits
    if (!cleaned) return '';
    
    // Limit to maximum digits for Philippine numbers
    // +63 format: 12 digits (63 + 10 digits)
    // 0 format: 11 digits
    const maxLength = cleaned.startsWith('63') ? 12 : 11;
    const limited = cleaned.slice(0, maxLength);
    
    // If starts with 63, format as +63 XXX XXX XXXX
    if (limited.startsWith('63')) {
      const number = limited.substring(2);
      if (number.length === 0) return '+63';
      if (number.length <= 3) return `+63 ${number}`;
      if (number.length <= 6) return `+63 ${number.slice(0, 3)} ${number.slice(3)}`;
      return `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`;
    }
    
    // If starts with 0, format as 0XXX XXX XXXX
    if (limited.startsWith('0')) {
      if (limited.length <= 4) return limited;
      if (limited.length <= 7) return `${limited.slice(0, 4)} ${limited.slice(4)}`;
      return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7, 11)}`;
    }
    
    // If starts with 9, assume it's missing the 0, format as 09XX XXX XXXX
    if (limited.startsWith('9') && limited.length >= 10) {
      return `0${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 10)}`;
    }
    
    // For any other case, just return the cleaned digits only
    return limited;
  };

  const resolveImageSource = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (image?.dataUrl) return image.dataUrl;
    if (image instanceof File) return URL.createObjectURL(image);
    return null;
  };

  const onImageChange = (field, value) => {
    console.log("onImageChange called:", { field, value, data });
    if (field === "image") {
      if (!value) {
        onChange({ ...data, image: null });
        return;
      }

      if (!(value instanceof File)) {
        onChange({ ...data, image: value });
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        const imagePayload = {
          dataUrl: reader.result,
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
        };

        onChange({ ...data, image: imagePayload });
        setIsLoading(false);
      };

      reader.onerror = (error) => {
        console.error("Failed to read image file:", error);
        setIsLoading(false);
        onChange({ ...data, image: null });
      };

      reader.readAsDataURL(value);
      return;
    } else if (field === "phone") {
      // Format phone number for Philippines
      const formattedPhone = formatPhilippinePhone(value);
      onChange({ ...data, [field]: formattedPhone });
    } else {
      onChange({ ...data, [field]: value });
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      validateField(field, value);
    }
  };

 

  const renderPersonalInfoInputs = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personalInfo.map((item, index) => {
          const requiredFields = ['name', 'email', 'phone', 'address', 'profession'];
          const isRequired = requiredFields.includes(item.name);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <span className="Capitalize text-sm font-medium">{item.label}</span>
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                {item.isSocialLink && (
                  <button
                    type="button"
                    onClick={() => removeSocialLink(item.platformId)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {item.type === "email" ? (
                <EmailInputField
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={item.onChange}
                  hasError={validationErrors[item.name]}
                  name={item.name}
                  width="w-full"
                />
              ) : (
                <InputField
                  type={item.type}
                  icon={item.icon}
                  width="w-full"
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={item.onChange}
                  hasError={validationErrors[item.name]}
                  name={item.name}
                  autoComplete={item.autoComplete}
                  inputMode={item.inputMode}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="sm:w-12 sm:h-12 w-1/6 h-14 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">1</span>
          </div>
          <div className="w-5/6">
            <h3 className="sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Personal Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
              Tell us about yourself to create your professional resume
            </p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4">
          <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Fields marked with <span className="text-red-500 font-semibold">*</span> are required. A professional photo can increase your chances of getting noticed by recruiters.
          </p>
        </div>
      </div>

      {/* Profile Image Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Photo</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
          {data?.image ? (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-md overflow-hidden border-2 border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-700">
                    <img
                      src={resolveImageSource(data.image)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageChange("image", null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {data.image?.name || 'Profile Image'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click to change photo
                  </p>
                </div>
              </div>

              {/* AI Background Removal */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white rounded-md text-xs font-medium">
                    <SparklesIcon className="w-3 h-3" />
                    AI
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remove background automatically
                  </span>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeBackground}
                    onChange={() => setRemoveBackground((prev) => !prev)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-color)] peer-checked:to-[var(--accent-color)] transition-all duration-300 ease-in-out" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center mb-4">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 text-[var(--primary-color)] animate-spin" />
                ) : (
                  <UploadIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {isLoading ? "Processing your photo..." : "Add a professional photo"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {isLoading ? "Please wait while we optimize your image" : "Upload a clear headshot for your resume"}
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            id="profile-upload"
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={(e) => onImageChange("image", e.target.files[0])}
            disabled={isLoading}
            className="hidden"
          />
          
          <label
            htmlFor="profile-upload"
            className="block w-full"
          >
            <div className="w-full py-3 px-4 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white text-sm font-medium rounded-md text-center cursor-pointer hover:opacity-90 transition-opacity duration-200">
              {data?.image ? "Change Photo" : "Upload Photo"}
            </div>
          </label>
        </div>
      </div>

      {/* Personal Information Fields */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Contact Information
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Provide your basic contact details for employers to reach you
          </p>
        </div>
        {renderPersonalInfoInputs}
        
        {/* Add Social Links Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowSocialLinks(!showSocialLinks)}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showSocialLinks ? 'Hide Social Links' : 'Add Social Links'}
          </button>
        </div>

        {/* Platform Selector */}
        {showSocialLinks && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 mb-4">
              Choose platforms to add:
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSocialPlatforms.map((platform) => {
                const isSelected = selectedSocialLinks.find(link => link.id === platform.id);
                const isAlreadyAdded = data?.[platform.id];
                
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => addSocialLink(platform)}
                    disabled={isSelected || isAlreadyAdded}
                    className={`p-3 rounded-md border-2 transition-all duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer ${
                      isSelected || isAlreadyAdded
                        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/5 hover:text-[var(--primary-color)] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-[var(--primary-color)]'
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      {isSelected || isAlreadyAdded ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </div>
                    {platform.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
