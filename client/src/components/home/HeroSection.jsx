import React from "react";
import HERO_IMAGE from "../../assets/hero-img.png";
import { useTheme } from "../../ThemeContext";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="relative">
      <svg
        className="size-full fixed top-0 left-0 -z-10 opacity-10 pointer-events-none"
        width="1440"
        height="720"
        viewBox="0 0 1440 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke={isDark ? "#FFFFFF" : "#1D293D"}
          strokeOpacity=".7"
          d="M-15.227 702.342H1439.7"
        />
        <circle
          cx="711.819"
          cy="372.562"
          r="308.334"
          stroke={isDark ? "#FFFFFF" : "#1D293D"}
          strokeOpacity=".7"
        />
        <circle
          cx="16.942"
          cy="20.834"
          r="308.334"
          stroke={isDark ? "#FFFFFF" : "#1D293D"}
          strokeOpacity=".7"
        />
        <path
          stroke={isDark ? "#FFFFFF" : "#1D293D"}
          strokeOpacity=".7"
          d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7"
        />
        <circle
          cx="782.595"
          cy="411.166"
          r="308.334"
          stroke={isDark ? "#FFFFFF" : "#1D293D"}
          strokeOpacity=".7"
        />
      </svg>
      <section className="flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-300 dark:border-slate-600 text-gray-700 dark:text-gray-400 text-xs">
            <div className="flex items-center">
              <img
                className="size-7 rounded-full border-2 border-gray-100 dark:border-white"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                alt="userImage1"
              />
              <img
                className="size-7 rounded-full border-2 border-gray-100 dark:border-white -translate-x-2"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                alt="userImage2"
              />
              <img
                className="size-7 rounded-full border-2 border-gray-100 dark:border-white -translate-x-4"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                alt="userImage3"
              />
            </div>
            <p className="-translate-x-2">Join 1M+ smart builders. </p>
          </div>
          <h1 className="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-xl text-slate-900 dark:text-white">
            Smarter resumes, powered by AI.
          </h1>
          <p className="text-center md:text-left text-sm text-slate-600 dark:text-slate-300 max-w-lg mt-2">
            Unlock your career potential with AI-powered tools that build
            resumes faster, smarter, and better.
          </p>
          <div className="flex items-center gap-4 mt-8 text-sm">
            <Link to="/sign-up" state={{ fromHome: true }}>
              <button className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] text-white active:scale-95 rounded-md px-7 h-11 cursor-pointer transition">
                Get started
              </button>
            </Link>
            <button className="flex items-center gap-2 border border-slate-400 dark:border-slate-400 active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition text-slate-700 dark:text-slate-400 rounded-md px-6 h-11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video-icon lucide-video"
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                <rect x="2" y="6" width="14" height="12" rx="2" />
              </svg>
              <span>Watch demo</span>
            </button>
          </div>
        </div>
        <img
          src={HERO_IMAGE}
          alt="hero"
          className="max-w-xs sm:max-w-sm lg:max-w-md transition-all duration-300"
        />
      </section>
    </div>
  );
};

export default HeroSection;
