import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import logo from '../assets/logo.png';
import ThemeSwitcher from "../util/ThemeSwitcher";
import InputField from "../components/InputField";
import TermsModal from "../components/TermsModal";
import { ArrowLeftIcon } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const fromHome = location.state?.fromHome || false;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleTermsClick = () => {
    if (termsAccepted) {
      setTermsAccepted(false);
      if (errors.terms) {
        setErrors((prev) => ({ ...prev, terms: false }));
      }
    } else {
      setShowTermsModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      fullName: !formData.fullName.trim(),
      email: !formData.email.trim() || !formData.email.includes('@'),
      password: !formData.password.trim(),
      confirmPassword: !formData.confirmPassword.trim() || formData.confirmPassword !== formData.password,
      terms: !termsAccepted,
    };
    
    setErrors(newErrors);
    
  };


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
          stroke={isDark ? "#FFFFFF" : "#2563eb"}
          strokeOpacity="1"
          d="M-15.227 702.342H1439.7"
        />
        <circle
          cx="711.819"
          cy="372.562"
          r="308.334"
          stroke={isDark ? "#FFFFFF" : "#2563eb"}
          strokeOpacity="1"
        />
        <circle
          cx="16.942"
          cy="20.834"
          r="308.334"
          stroke={isDark ? "#FFFFFF" : "#2563eb"}
          strokeOpacity="1"
        />
        <path
          stroke={isDark ? "#FFFFFF" : "#2563eb"}
          strokeOpacity="1"
          d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7"
        />
        <circle
          cx="782.595"
          cy="411.166"
          r="308.334"
          stroke={isDark ? "#FFFFFF" : "#2563eb"}
          strokeOpacity="1"
        />
      </svg>
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-md shadow-md transition-all duration-200 font-medium cursor-pointer"
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:from-[var(--accent-color)] hover:to-[var(--primary-color)] transition-all duration-300"
        >
          {" "}
          <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" /> Back
          to dashboard
        </Link>
      </button>

      <div className="absolute top-8 right-6">
        <ThemeSwitcher />
      </div>
      <div
        className={`flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 ${
          fromHome ? "animate__animated animate__zoomIn animate__faster" : ""
        }`}
      >
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
                Join thousands of professionals building smarter resumes with
                AI-powered tools and templates
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
          <form
            className="md:w-96 w-80 flex flex-col items-center justify-center"
            onSubmit={handleSubmit}
          >
            <h2 className="text-4xl text-gray-900 font-medium dark:text-white">
              Sign up
            </h2>
            <p className="text-sm text-gray-500/90 mt-3 dark:text-gray-400">
              Welcome to our platform! Please sign up to continue
            </p>

            <div className="w-full flex flex-col gap-4 mt-8">
              <InputField
                type="text"
                placeholder="Full Name"
                required={true}
                icon="user"
                name="fullName"
                value={formData.fullName}
                hasError={errors.fullName}
                onChange={(value) => handleInputChange("fullName", value)}
              />

              <InputField
                type="email"
                placeholder="Email address"
                required={true}
                icon="email"
                name="email"
                value={formData.email}
                hasError={errors.email}
                onChange={(value) => handleInputChange("email", value)}
              />

              <InputField
                type="password"
                placeholder="Password"
                required={true}
                icon="password"
                name="password"
                value={formData.password}
                hasError={errors.password}
                onChange={(value) => handleInputChange("password", value)}
              />

              <InputField
                type="password"
                placeholder="Confirm Password"
                required={true}
                icon="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                hasError={errors.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
              />
            </div>

            <div className="w-full flex items-center justify-between mt-4 text-gray-500/80">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    className="sr-only"
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    readOnly
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                      errors.terms
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={handleTermsClick}
                  >
                    {termsAccepted && (
                      <svg
                        className="w-3 h-3 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <label
                  className={`text-sm cursor-pointer ${
                    errors.terms ? "text-red-500" : ""
                  }`}
                  htmlFor="terms"
                >
                  <span className="cursor-pointer" onClick={handleTermsClick}>
                    {" "}
                    I agree to the{" "}
                  </span>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    onClick={handleTermsClick}
                  >
                    terms and conditions
                  </button>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-md text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300"
            >
              Sign up
            </button>
            <p className="text-gray-500/90 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
        setTermsAccepted={setTermsAccepted}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};

export default Register;
