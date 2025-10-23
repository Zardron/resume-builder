import React, { useState, useEffect, useRef } from "react";
import LOGO from "../../assets/logo.png"
import { Link } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher";

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const menuRef = useRef(null);
   const openMenu = () => setIsMenuOpen(true);
   const closeMenu = () => setIsMenuOpen(false);

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeMenu();
         }
      };

      if (isMenuOpen) {
         document.addEventListener("mousedown", handleClickOutside);
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.body.style.overflow = "unset";
      };
   }, [isMenuOpen]);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      <header
        className={`flex items-center justify-between px-4 md:px-14 shadow dark:shadow-white/5 w-full transition-all duration-300 ease-in-out sticky top-0 z-50 bg-white dark:bg-gray-900 ${
          isScrolled ? "py-2" : "py-6"
        } ${isMenuOpen ? "hidden md:flex" : "flex"}`}
      >
        <a href="https://prebuiltui.com" className="flex items-center gap-1">
          <img src={LOGO} alt="logo" className="w-8 h-8" />{" "}
          <span className="text-lg font-bold text-black dark:text-white">
            Resume Builder
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-900 dark:text-gray-100 text-sm font-normal">
          <a className="hover:text-indigo-500 dark:hover:text-indigo-400 transition" href="#">
            Products
          </a>
          <a className="hover:text-indigo-500 dark:hover:text-indigo-400 transition" href="#">
            Customer Stories
          </a>
          <a className="hover:text-indigo-500 dark:hover:text-indigo-400 transition" href="#">
            Pricing
          </a>
          <a className="hover:text-indigo-500 dark:hover:text-indigo-400 transition" href="#">
            Docs
          </a>
        </nav>

        <div className="flex items-center justify-end gap-2">
         <ThemeSwitcher />
          <Link
            className="hidden md:flex bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-600 transition"
            to="/sign-in"
            state={{ fromHome: true }}
          >
            Sign in
          </Link>
          <button
            onClick={openMenu}
            className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
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

      {/* Mobile Menu */}
      <nav
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <img src={LOGO} alt="logo" className="w-8 h-8" />
              <span className="text-lg font-bold text-black dark:text-white">
                Resume Builder
              </span>
            </div>
            <button
              onClick={closeMenu}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
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
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 flex flex-col p-4 space-y-4">
            <a
              className="text-gray-900 dark:text-gray-100 text-lg font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition py-2 border-b border-gray-100 dark:border-slate-800"
              href="#"
              onClick={closeMenu}
            >
              Products
            </a>
            <a
              className="text-gray-900 dark:text-gray-100 text-lg font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition py-2 border-b border-gray-100 dark:border-slate-800"
              href="#"
              onClick={closeMenu}
            >
              Customer Stories
            </a>
            <a
              className="text-gray-900 dark:text-gray-100 text-lg font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition py-2 border-b border-gray-100 dark:border-slate-800"
              href="#"
              onClick={closeMenu}
            >
              Pricing
            </a>
            <a
              className="text-gray-900 dark:text-gray-100 text-lg font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition py-2 border-b border-gray-100 dark:border-slate-800"
              href="#"
              onClick={closeMenu}
            >
              Docs
            </a>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <Link
              className="w-full bg-indigo-500 text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-indigo-600 transition text-center block"
              to="/sign-in"
              state={{ fromHome: true }}
              onClick={closeMenu}
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
