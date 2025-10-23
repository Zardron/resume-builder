import React, { useState } from "react";
import LOGO from "../../assets/logo.png"
import { useTheme } from "../../ThemeContext";  
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const openMenu = () => setIsMenuOpen(true);
   const closeMenu = () => setIsMenuOpen(false);

   const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 md:px-14 py-2 shadow w-full transition-colors">
      <a href="https://prebuiltui.com" className="flex items-center gap-1">
        <img src={LOGO} alt="logo" className="w-8 h-8" />{" "}
        <span className="text-lg font-bold text-black dark:text-white">
          Resume Builder
        </span>
      </a>
      <nav
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full transition-[width] backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 dark:text-gray-100 text-sm font-normal ${
          isMenuOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <a className="hover:text-[var(--primary-color)] transition" href="#">
          Products
        </a>
        <a className="hover:text-[var(--primary-color)] transition" href="#">
          Customer Stories
        </a>
        <a className="hover:text-[var(--primary-color)] transition" href="#">
          Pricing
        </a>
        <a className="hover:text-[var(--primary-color)] transition" href="#">
          Docs
        </a>
        <button
          onClick={closeMenu}
          className="md:hidden text-gray-600 dark:text-gray-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
      <div className="flex items-center justify-end gap-2">
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
        <a
          className="hidden md:flex bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[var(--secondary-color)] transition"
          href="#"
        >
          Sign in
        </a>
        <button
          onClick={openMenu}
          className="md:hidden text-gray-600 dark:text-gray-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
