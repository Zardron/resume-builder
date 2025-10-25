import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="flex flex-wrap items-center justify-between w-full px-4 md:px-14 py-2 font-light text-md text-white text-center bg-gradient-to-br from-blue-500 to-cyan-500">
      <p>AI feature enabled – Build your resume in minutes.</p>
      <Link
        to="/sign-in"
        state={{ fromHome: true }}
        className="flex items-center gap-1 px-3 py-1 rounded-lg text-white bg-white/20 hover:bg-white/30 transition active:scale-95 ml-3"
      >
        Explore now
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.91797 7H11.0846"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 2.9165L11.0833 6.99984L7 11.0832"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Banner;
