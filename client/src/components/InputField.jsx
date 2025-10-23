import React from 'react'
import { Mail, Lock, User } from 'lucide-react';
const InputField = ({type, placeholder, value, onChange, required, icon, name, hasError}) => {


  const renderIcon = (icon) => {
     switch(icon){ 
    case 'email':
      return <Mail className="w-4 h-4 text-gray-500/80 dark:text-gray-400/80" />;
      case 'password':
      return <Lock className="w-4 h-4 text-gray-500/80 dark:text-gray-400/80" />;
      case 'user':
      return <User className="w-4 h-4 text-gray-500/80 dark:text-gray-400/80" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center w-full bg-transparent border h-12 rounded-md overflow-hidden gap-2 ${
      hasError 
        ? 'border-red-500 focus-within:border-red-500' 
        : 'border-gray-300/60 focus-within:border-gray-400'
    }`}>
      <div className={`flex w-16 h-full items-center justify-center rounded-l-md ${
        hasError 
          ? 'bg-red-50 dark:bg-red-900/20' 
          : 'bg-gray-300/60 dark:bg-gray-800/40'
      }`}>
        <div className="flex items-center justify-center w-full h-full">
          {renderIcon(icon)}
        </div>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
      />
    </div>
  );
};

export default InputField;