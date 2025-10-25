import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import InputField from "../components/InputField";
import ThemeSwitcher from "../util/ThemeSwitcher";    
import { useTheme } from "../ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  
  const fromHome = location.state?.fromHome || false;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  console.log(formData);

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      email: !formData.email.trim() || !formData.email.includes('@'),
      password: !formData.password.trim(),
    };
    
    setErrors(newErrors);
    
  };

  return (
    <div className="relative dark:to-gray-800 flex items-center justify-center w-full h-screen p-24">
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

      <div className="absolute top-8 right-6">
        <ThemeSwitcher />
      </div>
      <div className={`flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 ${fromHome ? 'animate__animated animate__zoomIn' : ''}`}>
        <div className="w-full hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white rounded-l-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Resume Builder Logo"
                className="w-10 h-10 object-contain bg-white rounded-xl p-1 shadow-lg"
              />
              <h1 className="text-3xl font-bold">Resume Builder</h1>
            </div>

            <div className="space-y-6">
              <p className="text-lg opacity-95 leading-relaxed">
                Unlock your career potential with AI-powered tools that build
                resumes faster, smarter, and better
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>AI Suggestions</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Smart Templates</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Real-time Optimization</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Professional Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <form className="md:w-96 w-80 flex flex-col items-center justify-center" onSubmit={handleSubmit}>
            <h2 className="text-4xl text-gray-900 font-medium dark:text-white">
              Sign in
            </h2>
            <p className="text-sm text-gray-500/90 mt-3 dark:text-gray-400">
              Welcome back! Please sign in to continue
            </p>

            <button
              type="button"
              className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-md"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
              <p className="w-full text-nowrap text-sm text-gray-500/90">
                or sign in with email
              </p>
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <div className="w-full my-2">
              <InputField
                type="email"
                placeholder="Email address"
                required={true}
                icon="email"
                name="email"
                value={formData.email}
                hasError={errors.email}
                onChange={(value) => handleInputChange('email', value)}
              />
            </div>

            <div className="w-full my-2">
              <InputField
                type="password"
                placeholder="Password"
                required={true}
                icon="password"
                name="password"
                value={formData.password}
                hasError={errors.password}
                onChange={(value) => handleInputChange('password', value)}
              />
            </div>

            <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="checkbox" />
                <label className="text-sm" htmlFor="checkbox">
                  Remember me
                </label>
              </div>
              <a className="text-sm underline" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-md text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300"
            >
              Sign in
            </button>
            <p className="text-gray-500/90 text-sm mt-4">
              Don’t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-[var(--primary-color)] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
