import React from "react";
import { Mail, Lock, User, FileText, PencilIcon, Phone, MapPin, Briefcase, Linkedin, Globe, Loader2, Check, Twitter, Github, Instagram, Youtube, Facebook, MessageCircle, Building2, Calendar} from "lucide-react";
const InputField = ({
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
}) => {
  const renderIcon = (icon) => {
    switch (icon) {
      case "email":
        return (
          <Mail className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "password":
        return (
          <Lock className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "user":
        return (
          <User className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "title":
        return (
          <FileText className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "phone":
        return (
          <Phone className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "map-pin":
        return (
          <MapPin className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "briefcase":
        return (
          <Briefcase className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "linkedin":
        return (
          <Linkedin className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "globe":
        return (
          <Globe className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "twitter":
        return (
          <Twitter className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "github":
        return (
          <Github className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "instagram":
        return (
          <Instagram className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "youtube":
        return (
          <Youtube className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "facebook":
        return (
          <Facebook className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "telegram":
        return (
          <MessageCircle className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "building":
        return (
          <Building2 className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      case "calendar":
        return (
          <Calendar className="w-4 h-4 text-gray-500/80 dark:text-gray-300" />
        );
      default:
        return null;
    }
  };

  return (
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
          {renderIcon(icon)}
        </div>
      </div>
      <input
        readOnly={readOnly ? readOnly : false}
        type={type}
        placeholder={placeholder}
        className="relative bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs outline-none text-sm w-full h-full px-4 py-3"
        autoComplete={autoComplete || (type === 'email' ? 'email' : 'off')}
        inputMode={inputMode}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        name={name}
      />
        {/* Spinner/Check mark for typing status */}
        {(isTyping || isTypingComplete) && (
          !isTitleConfirmed && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
            {isTyping && (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            )}
            {isTypingComplete && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
          )
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
  );
};

export default InputField;
