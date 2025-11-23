import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, Eye, EyeOff } from 'lucide-react';
import InputField from '../components/InputField';
import AuthSidebar from '../components/AuthSidebar';
import ThemeSwitcher from '../util/ThemeSwitcher';
import BackgroundEffects from '../components/BackgroundEffects';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { fetchResumes } from '../store/slices/resumesSlice';
import { fetchCreditsBalance } from '../store/slices/creditsSlice';
import { fetchSubscriptionStatus } from '../store/slices/subscriptionsSlice';

const validateEmail = (email) => email.trim() && email.includes('@');

const REMEMBER_ME_KEY = 'rememberedEmail';

const Login = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromHome = state?.fromHome || false;
  const dispatch = useAppDispatch();
  
  const handleBack = () => {
      navigate('/');
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      email: !validateEmail(formData.email),
      password: !formData.password.trim(),
    };
    
    setErrors(newErrors);
    setErrorMessage('');
    
    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);
      try {
        const result = await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
          remember: rememberMe,
        })).unwrap();
        
        // Store email if remember me is checked
        if (rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, formData.email);
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
        }
        
        dispatch(addNotification({
          type: 'success',
          title: 'Welcome back!',
          message: `Logged in as ${result.user.fullName || result.user.name}`,
        }));
        
        // Load user data
        dispatch(fetchResumes());
        dispatch(fetchCreditsBalance());
        dispatch(fetchSubscriptionStatus());
        
        // Redirect to dashboard or previous location
        const redirectTo = state?.from?.pathname || '/dashboard';
        navigate(redirectTo, { replace: true });
      } catch (error) {
        // Check if error is due to unverified email
        const errorObj = typeof error === 'object' ? error : { message: error };
        if (errorObj.requiresVerification || (errorObj.message && (errorObj.message.includes('verify') || errorObj.message.includes('verification')))) {
          dispatch(addNotification({
            type: 'warning',
            title: 'Email Not Verified',
            message: 'Please verify your email address to continue.',
          }));
          navigate('/verify-email', { 
            state: { email: errorObj.email || formData.email }
          });
        } else {
          const errorMessage = errorObj.message || error || 'Login failed. Please try again.';
          setErrorMessage(errorMessage);
          dispatch(addNotification({
            type: 'error',
            title: 'Login Failed',
            message: errorMessage,
          }));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      <BackgroundEffects />
      
      {/* Left Sidebar - Branding */}
      <div className="hidden lg:flex w-1/2 h-full">
        <AuthSidebar
          title="ResumeIQHub"
          description="Where Talent Meets Opportunity. From Resume to Hire, Seamlessly—the complete recruitment platform."
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-slate-950 relative overflow-y-auto">
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-all duration-200 font-medium text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back</span>
        </button>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <ThemeSwitcher />
        </div>

        <div className={`w-full max-w-xl ${fromHome ? 'animate__animated animate__fadeIn' : ''}`}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <header className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign in to your account to continue
                </p>
              </header>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center h-11 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                    alt="Google"
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Continue with Google</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    or continue with email
                  </p>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
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

              <div className="relative">
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  icon="password"
                  name="password"
                  value={formData.password}
                  hasError={errors.password}
                  onChange={(value) => handleInputChange('password', value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors z-10 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[var(--primary-color)] bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300 select-none">
                    Remember me
                  </span>
                </label>
                <a className="text-xs text-[var(--primary-color)] hover:underline whitespace-nowrap" href="#">
                  Forgot password?
                </a>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 w-full h-11 rounded-lg text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              
              <p className="text-center text-gray-600 dark:text-gray-400 text-xs mt-5">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-[var(--primary-color)] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
