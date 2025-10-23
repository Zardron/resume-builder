import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import logo from '../assets/logo.png';
import ThemeSwitcher from "../components/ThemeSwitcher";
import InputField from "../components/InputField";

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
        <div className="w-full hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white rounded-l-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Resume Builder Logo"
                className="w-12 h-12 object-contain bg-white rounded-xl p-2 shadow-lg"
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
          <form className="md:w-96 w-80 flex flex-col items-center justify-center" onSubmit={handleSubmit}>
            <h2 className="text-4xl text-gray-900 font-medium dark:text-white">
              Sign up
            </h2>
            <p className="text-sm text-gray-500/90 mt-3 dark:text-gray-400 mb-6">
              Welcome to our platform! Please sign up to continue
            </p>

            <div className="w-full my-2">
              <InputField
                type="text"
                placeholder="Full Name"
                required={true}
                icon="user"
                name="fullName"
                value={formData.fullName}
                hasError={errors.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
              />
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

            <div className="w-full my-2">
              <InputField
                type="password"
                placeholder="Confirm Password"
                required={true}
                icon="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                hasError={errors.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
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
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: false }));
                      }
                    }}
                  />
                  <div 
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                      errors.terms 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                    onClick={() => setShowTermsModal(true)}
                  >
                    {termsAccepted && (
                      <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <label className={`text-sm cursor-pointer ${errors.terms ? 'text-red-500' : ''}`} htmlFor="terms">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    onClick={() => setShowTermsModal(true)}
                  >
                    terms and conditions
                  </button>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
            >
              Sign up
            </button>
            <p className="text-gray-500/90 text-sm mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--primary-color)] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms and Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <h4 className="font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h4>
                <p>
                  By accessing and using this Resume Builder service, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">2. Use License</h4>
                <p>
                  Permission is granted to temporarily use this Resume Builder for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">3. Privacy Policy</h4>
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">4. User Account</h4>
                <p>
                  You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree to accept responsibility for all activities that occur under your account.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">5. Prohibited Uses</h4>
                <p>
                  You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">6. Content</h4>
                <p>
                  Our service allows you to create, store, and manage your resume content. You retain ownership of your content, but grant us a license to use, store, and process your content as necessary to provide the service.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">7. Termination</h4>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">8. Changes to Terms</h4>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-terms"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: false }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="modal-terms" className="text-sm text-gray-700 dark:text-gray-300">
                    I have read and agree to the terms and conditions
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-md"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
