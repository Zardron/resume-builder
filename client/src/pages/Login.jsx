import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import InputField from '../components/InputField';
import AuthBackground from '../components/AuthBackground';
import AuthSidebar from '../components/AuthSidebar';
import ThemeSwitcher from '../util/ThemeSwitcher';

const validateEmail = (email) => email.trim() && email.includes('@');

const Login = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromHome = state?.fromHome || false;
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      email: !validateEmail(formData.email),
      password: !formData.password.trim(),
    };
    
    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password) {
      // Handle successful login
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen p-24">
      <AuthBackground />
      
      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 dark:text-gray-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 rounded-md shadow-md transition-all duration-200 font-medium"
      >
        <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" />
        <span className="text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
          Back to dashboard
        </span>
      </Link>

      <div className="absolute top-8 right-6">
        <ThemeSwitcher />
      </div>

      <div
        className={`flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 ${
          fromHome ? 'animate__animated animate__zoomIn' : ''
        }`}
      >
        <AuthSidebar
          title="Resume Builder"
          description="Unlock your career potential with AI-powered tools that build resumes faster, smarter, and better"
        />

        <div className="w-full flex flex-col items-center justify-center">
          <form className="md:w-96 w-80 flex flex-col items-center" onSubmit={handleSubmit}>
            <header className="text-center">
              <h2 className="text-4xl text-gray-900 font-medium dark:text-white">Sign in</h2>
              <p className="text-sm text-gray-500/90 mt-3 dark:text-gray-400">
                Welcome back! Please sign in to continue
              </p>
            </header>

            <div className="w-full flex flex-col gap-4 mt-8">
              <button
                type="button"
                className="w-full bg-gray-500/10 flex items-center justify-center h-12 rounded-md hover:bg-gray-500/20 transition-colors"
              >
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                  alt="Google"
                />
              </button>

              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-px bg-gray-300/90 dark:bg-gray-600" />
                <p className="text-sm text-gray-500/90 dark:text-gray-400 whitespace-nowrap">
                  or sign in with email
                </p>
                <div className="flex-1 h-px bg-gray-300/90 dark:bg-gray-600" />
              </div>

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
            </div>

            <div className="w-full flex items-center justify-between mt-4 text-gray-500/80 dark:text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <div
                  className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm">Remember me</span>
              </label>
              <a className="text-sm underline hover:text-[var(--primary-color)]" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-md text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300"
            >
              Sign in
            </button>
            
            <p className="text-gray-500/90 dark:text-gray-400 text-sm mt-4">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-[var(--primary-color)] hover:underline">
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
