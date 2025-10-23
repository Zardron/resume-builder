import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const resumeImage =
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80";


  return (
    <div className="relative  dark:to-gray-800 flex items-center justify-center w-full h-screen p-24">
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
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-md shadow-md transition-all duration-200 font-medium cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>
      <div className="flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="w-full hidden md:inline-block overflow-hidden rounded-l-md">
          <img
            className="h-full w-full object-cover"
            src={resumeImage}
            alt="Resume Builder"
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <form className="md:w-96 w-80 flex flex-col items-center justify-center relative">
            <h2 className="text-4xl text-gray-900 font-medium dark:text-white">
              Sign up
            </h2>
            <p className="text-sm text-gray-500/90 mt-3 dark:text-gray-400 mb-12">
              Welcome to our platform! Please sign up to continue
            </p>

            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-md overflow-hidden pl-6 gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
              <input
                type="text"
                placeholder="Full name"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center w-full mt-6 bg-transparent border border-gray-300/60 h-12 rounded-md overflow-hidden pl-6 gap-2">
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-md overflow-hidden pl-6 gap-2">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                name="new-password"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>


            <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-md overflow-hidden pl-6 gap-2">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
                autoComplete="new-password"
                data-form-type="other"
                data-lpignore="true"
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-md text-white bg-[var(--primary-color)] hover:opacity-90 transition-opacity"
            >
              Sign up
            </button>
            <p className="text-gray-500/90 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--primary-color)] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
