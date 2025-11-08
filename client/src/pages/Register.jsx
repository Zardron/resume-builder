import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import InputField from '../components/InputField';
import AuthSidebar from '../components/AuthSidebar';
import ThemeSwitcher from '../util/ThemeSwitcher';
import TermsModal from '../components/TermsModal';

const validateEmail = (email) => email.trim() && email.includes('@');

const Register = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromHome = state?.fromHome || false;

  const handleBack = () => {
      navigate('/');
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
        setErrors(prev => ({ ...prev, terms: false }));
      }
    } else {
      setShowTermsModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      fullName: !formData.fullName.trim(),
      email: !validateEmail(formData.email),
      password: !formData.password.trim(),
      confirmPassword: !formData.confirmPassword.trim() || formData.confirmPassword !== formData.password,
      terms: !termsAccepted,
    };
    
    setErrors(newErrors);
    
    const hasNoErrors = Object.values(newErrors).every(error => !error);
    if (hasNoErrors) {
      // Handle successful registration
    }
  };


  return (
    <div className="relative flex items-center justify-center w-full h-screen p-24">
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 dark:text-gray-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 rounded-md shadow-md transition-all duration-200 font-medium hover:text-[var(--primary-color)]"
      >
        <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" />
        <span className="text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
          Go back
        </span>
      </button>

      <div className="absolute top-8 right-6">
        <ThemeSwitcher />
      </div>

      <div
        className={`flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 ${
          fromHome ? 'animate__animated animate__zoomIn animate__faster' : ''
        }`}
      >
        <AuthSidebar
          title="Resume Builder"
          description="Join thousands of professionals building smarter resumes with AI-powered tools and templates"
        />

        <div className="w-full flex flex-col items-center justify-center">
          <form className="md:w-96 w-80 flex flex-col items-center" onSubmit={handleSubmit}>
            <header className="text-center">
              <h2 className="text-4xl text-gray-900 font-medium dark:text-white">Sign up</h2>
              <p className="text-sm text-gray-500/90 mt-3 dark:text-gray-400">
                Welcome! Please sign up to get started
              </p>
            </header>

            <div className="w-full flex flex-col gap-4 mt-8">
              <InputField
                type="text"
                placeholder="Full Name"
                required
                icon="user"
                name="fullName"
                value={formData.fullName}
                hasError={errors.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
              />

              <InputField
                type="email"
                placeholder="Email address"
                required
                icon="email"
                name="email"
                value={formData.email}
                hasError={errors.email}
                onChange={(value) => handleInputChange('email', value)}
              />

              <InputField
                type="password"
                placeholder="Password"
                required
                icon="password"
                name="password"
                value={formData.password}
                hasError={errors.password}
                onChange={(value) => handleInputChange('password', value)}
              />

              <InputField
                type="password"
                placeholder="Confirm Password"
                required
                icon="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                hasError={errors.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
              />
            </div>

            <label className="w-full flex items-start gap-2 mt-4 text-gray-500/80 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" className="sr-only" id="terms" checked={termsAccepted} readOnly />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  errors.terms
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
                onClick={handleTermsClick}
              >
                {termsAccepted && (
                  <svg className="w-3 h-3 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${errors.terms ? 'text-red-500' : ''}`}>
                I agree to the{' '}
                <button
                  type="button"
                  className="text-[var(--primary-color)] hover:underline"
                  onClick={handleTermsClick}
                >
                  terms and conditions
                </button>
              </span>
            </label>

            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-md text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300"
            >
              Sign up
            </button>
            
            <p className="text-gray-500/90 dark:text-gray-400 text-sm mt-4">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-[var(--primary-color)] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

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
