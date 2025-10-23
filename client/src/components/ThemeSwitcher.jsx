import React from 'react'
import { Sun, Moon } from "lucide-react";
import { useTheme } from '../ThemeContext';

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="size-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-slate-300 dark:border-slate-600 rounded-md dark:text-gray-200"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-600" />
      )}
    </button>
  );
}

export default ThemeSwitcher