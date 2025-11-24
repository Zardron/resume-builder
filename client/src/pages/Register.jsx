import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import AuthSidebar from '../components/layout/AuthSidebar';
import ThemeSwitcher from '../utils/ThemeSwitcher';
import TermsModal from '../components/ui/TermsModal';
import BackgroundEffects from '../components/common/BackgroundEffects';
import { useAppDispatch } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { fetchResumes } from '../store/slices/resumesSlice';
import { fetchCreditsBalance } from '../store/slices/creditsSlice';
import { fetchSubscriptionStatus } from '../store/slices/subscriptionsSlice';
import { authAPI } from '../services/api';

const validateEmail = (email) => email.trim() && email.includes('@');

const Register = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromHome = state?.fromHome || false;
  const dispatch = useAppDispatch();

  const handleBack = () => {
      navigate('/');
  };

  const [registrationType, setRegistrationType] = useState('individual'); // 'individual', 'team'
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    industry: '',
    size: 'small',
    website: '',
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    organizationName: false,
    terms: false,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState(true);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);

  // Check if registration is allowed
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await authAPI.getPublicConfig();
        if (response && response.data) {
          setIsRegistrationAllowed(response.data.allowJobSeekerLoginSignup);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        // Default to allowing registration if check fails
        setIsRegistrationAllowed(true);
      } finally {
        setIsCheckingConfig(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    if (errorMessage) {
      setErrorMessage('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      fullName: !formData.fullName.trim(),
      email: !validateEmail(formData.email),
      password: !formData.password.trim() || formData.password.length < 6,
      confirmPassword: !formData.confirmPassword.trim() || formData.confirmPassword !== formData.password,
      organizationName: registrationType === 'team' && !formData.organizationName.trim(),
      terms: !termsAccepted,
    };
    
    setErrors(newErrors);
    setErrorMessage('');
    
    const hasNoErrors = Object.values(newErrors).every(error => !error);
    if (hasNoErrors) {
      setIsLoading(true);
      try {
        const registrationData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          userType: 'applicant',
        };

        // Add organization data if registering as team/organization
        if (registrationType === 'team') {
          registrationData.organization = {
            name: formData.organizationName,
            industry: formData.industry || undefined,
            size: formData.size || 'small',
            website: formData.website || undefined,
          };
        }

        const result = await dispatch(registerUser(registrationData)).unwrap();
        
        dispatch(addNotification({
          type: 'success',
          title: 'Registration Successful!',
          message: 'Please check your email for the verification code.',
        }));
        
        // Redirect to verification page if verification is required
        if (result.requiresVerification) {
          navigate('/verify-email', { 
            replace: true,
            state: { email: result.user.email }
          });
        } else {
          // Load user data if already verified
          dispatch(fetchResumes());
          dispatch(fetchCreditsBalance());
          dispatch(fetchSubscriptionStatus());
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        setErrorMessage(error || 'Registration failed. Please try again.');
        dispatch(addNotification({
          type: 'error',
          title: 'Registration Failed',
          message: error || 'Failed to create account. Please try again.',
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };


  // Show loading state while checking config
  if (isCheckingConfig) {
    return (
      <div className="relative flex w-full h-screen overflow-hidden">
        <BackgroundEffects />
        <div className="w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show disabled message if registration is not allowed
  if (!isRegistrationAllowed) {
    return (
      <div className="relative flex w-full h-screen overflow-hidden">
        <BackgroundEffects />
        
        {/* Left Sidebar - Branding */}
        <div className="hidden lg:flex w-1/2 h-full">
          <AuthSidebar
            title="ResumeIQHub"
            description="Join thousands of companies and job seekers using our complete recruitment platform to connect talent with opportunity"
          />
        </div>

        {/* Right Side - Disabled Message */}
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

          <div className="w-full max-w-xl">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Currently Disabled</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Job seeker registration is currently disabled. Please contact support if you need assistance.
                </p>
              </div>
              <Link
                to="/"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      <BackgroundEffects />
      
      {/* Left Sidebar - Branding */}
      <div className="hidden lg:flex w-1/2 h-full">
        <AuthSidebar
          title="ResumeIQHub"
          description="Join thousands of companies and job seekers using our complete recruitment platform to connect talent with opportunity"
        />
      </div>

      {/* Right Side - Registration Form */}
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get started with ResumeIQHub today
                </p>
              </header>

              {/* Registration Type Selector */}
              <div className="w-full mb-5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5 uppercase tracking-wide">
                  Register as
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationType('individual');
                      setFormData(prev => ({ ...prev, organizationName: '', industry: '', website: '' }));
                    }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      registrationType === 'individual'
                        ? 'bg-[var(--primary-color)] text-white shadow-md'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationType('team');
                      if (!formData.organizationName) {
                        setFormData(prev => ({ ...prev, organizationName: '' }));
                      }
                    }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      registrationType === 'team'
                        ? 'bg-[var(--primary-color)] text-white shadow-md'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    Team / Organization
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

              {/* Organization/Team Fields */}
              {registrationType === 'team' && (
                <>
                  <InputField
                    type="text"
                    placeholder="Organization Name"
                    required
                    icon="building"
                    name="organizationName"
                    value={formData.organizationName}
                    hasError={errors.organizationName}
                    onChange={(value) => handleInputChange('organizationName', value)}
                  />

                  <SelectField
                    placeholder="Industry (Optional)"
                    icon="briefcase"
                    name="industry"
                    value={formData.industry}
                    onChange={(value) => handleInputChange('industry', value)}
                    options={[
                      'Technology',
                      'Healthcare',
                      'Finance',
                      'Education',
                      'Manufacturing',
                      'Retail',
                      'Real Estate',
                      'Consulting',
                      'Media & Entertainment',
                      'Transportation',
                      'Energy',
                      'Hospitality',
                      'Telecommunications',
                      'Construction',
                      'Agriculture',
                      'Legal',
                      'Non-profit',
                      'Government',
                      'Other'
                    ]}
                  />

                  <SelectField
                    placeholder="Company Size"
                    icon="building"
                    name="size"
                    value={formData.size}
                    onChange={(value) => handleInputChange('size', value)}
                    options={[
                      { label: 'Startup (1-10)', value: 'startup' },
                      { label: 'Small (11-50)', value: 'small' },
                      { label: 'Medium (51-200)', value: 'medium' },
                      { label: 'Large (201-1000)', value: 'large' },
                      { label: 'Enterprise (1000+)', value: 'enterprise' }
                    ]}
                    getOptionLabel={(option) => option.label || option}
                    getOptionValue={(option) => option.value || option}
                  />

                  <InputField
                    type="text"
                    placeholder="Website (Optional)"
                    icon="globe"
                    name="website"
                    value={formData.website}
                    onChange={(value) => handleInputChange('website', value)}
                  />
                </>
              )}
            </div>

              <div className="w-full flex items-center gap-2 mt-5 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      e.preventDefault();
                      handleTermsClick();
                    }}
                    className={`w-4 h-4 text-[var(--primary-color)] bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-0 cursor-pointer ${
                      errors.terms ? 'border-red-500' : ''
                    }`}
                  />
                  <span className={`text-xs text-gray-700 dark:text-gray-300 select-none ${errors.terms ? 'text-red-500' : ''}`}>
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-[var(--primary-color)] hover:underline font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTermsModal(true);
                      }}
                    >
                      terms and conditions
                    </button>
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 md:col-span-2">
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 w-full h-11 rounded-lg text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md md:col-span-2"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
              
              <p className="text-center text-gray-600 dark:text-gray-400 text-xs mt-5 md:col-span-2">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-[var(--primary-color)] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
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
