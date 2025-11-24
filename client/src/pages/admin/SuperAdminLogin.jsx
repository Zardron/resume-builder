import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import InputField from '../../components/forms/InputField';
import ThemeSwitcher from '../../utils/ThemeSwitcher';
import BackgroundEffects from '../../components/common/BackgroundEffects';
import { useAppDispatch } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { fetchResumes } from '../../store/slices/resumesSlice';
import { fetchCreditsBalance } from '../../store/slices/creditsSlice';
import { fetchSubscriptionStatus } from '../../store/slices/subscriptionsSlice';
import { authAPI } from '../../services/api';

const validateEmail = (email) => email.trim() && email.includes('@');

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
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
          remember: false,
        })).unwrap();
        
        // Check if user is super admin
        if (result.user.role !== 'super_admin') {
          dispatch(addNotification({
            type: 'error',
            title: 'Access Denied',
            message: 'This login page is only for super administrators.',
          }));
          setErrorMessage('This login page is only for super administrators. Please use the regular login page.');
          setIsLoading(false);
          return;
        }
        
        dispatch(addNotification({
          type: 'success',
          title: 'Welcome back, Administrator!',
          message: `Logged in as ${result.user.fullName || result.user.name}`,
        }));
        
        // Load user data
        dispatch(fetchResumes());
        dispatch(fetchCreditsBalance());
        dispatch(fetchSubscriptionStatus());
        
        // Redirect to admin dashboard
        navigate('/dashboard/admin', { replace: true });
      } catch (error) {
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
      
      {/* Full Screen - Centered Login Form */}
      <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-slate-950 relative overflow-y-auto">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <ThemeSwitcher />
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8">
            {/* Header with Admin Badge */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Super Admin Login
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Administrator access only
              </p>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Security Notice:</strong> This page is restricted to super administrators only. 
                  Unauthorized access attempts are logged.
                </p>
              </div>
            </div>

            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <InputField
                  type="email"
                  placeholder="Admin Email"
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

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 w-full h-11 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Sign in as Administrator</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Forgot your credentials? Contact system administrator.
              </p>
            </div>
          </div>

          {/* Back to regular login link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/sign-in')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to regular login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;

