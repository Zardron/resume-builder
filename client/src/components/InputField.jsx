import {
  Mail, Lock, User, FileText, PencilIcon, Phone, MapPin, Briefcase,
  Linkedin, Globe, Loader2, Check, Twitter, Github, Instagram, Youtube,
  Facebook, MessageCircle, Building2, Calendar
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
}) => {
  const IconComponent = icon ? ICON_MAP[icon] : null;

  return (
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
        readOnly={readOnly}
        id={id || name}
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
  );
};

export default InputField;
