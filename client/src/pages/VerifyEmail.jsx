import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeftIcon, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import InputField from '../components/InputField';
import AuthSidebar from '../components/AuthSidebar';
import ThemeSwitcher from '../util/ThemeSwitcher';
import BackgroundEffects from '../components/BackgroundEffects';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authAPI, getToken } from '../services/api';
import { initializeAuth } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { fetchResumes } from '../store/slices/resumesSlice';
import { fetchCreditsBalance } from '../store/slices/creditsSlice';
import { fetchSubscriptionStatus } from '../store/slices/subscriptionsSlice';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const email = location.state?.email || user?.email || '';

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated && !getToken()) {
      navigate('/sign-in', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1); // Only take last character
    
    setVerificationCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const codeArray = pastedData.split('');
      setVerificationCode(codeArray);
      setError('');
      // Focus last input
      document.getElementById('code-5')?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.verifyEmail(code);
      
      if (result.success) {
        setSuccess(true);
        dispatch(addNotification({
          type: 'success',
          title: 'Email Verified!',
          message: 'Your email has been verified successfully.',
        }));

        // Refresh auth state
        await dispatch(initializeAuth());
        
        // Load user data
        dispatch(fetchResumes());
        dispatch(fetchCreditsBalance());
        dispatch(fetchSubscriptionStatus());

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    } catch (error) {
      setError(error.message || 'Invalid verification code. Please try again.');
      setVerificationCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await authAPI.resendVerification();
      
      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          title: 'Verification Email Sent',
          message: 'A new verification code has been sent to your email.',
        }));
        setVerificationCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    } catch (error) {
      setError(error.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex items-center justify-center w-full h-screen p-24">
        <BackgroundEffects />
        <div className="absolute top-8 right-6 z-20">
          <ThemeSwitcher />
        </div>
        <div className="relative z-10 flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700">
          <AuthSidebar
            title="ResumeIQHub"
            description="Your email has been verified successfully!"
          />
          <div className="w-full flex flex-col items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-full h-screen p-24">
      <BackgroundEffects />
      <button
        type="button"
        onClick={() => navigate('/sign-in')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 dark:text-gray-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 rounded-md shadow-md transition-all duration-200 font-medium hover:text-[var(--primary-color)] cursor-pointer"
      >
        <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" />
        <span className="text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
          Go back
        </span>
      </button>

      <div className="absolute top-8 right-6 z-20">
        <ThemeSwitcher />
      </div>

      <div className="relative z-10 flex h-[600px] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700">
        <AuthSidebar
          title="ResumeIQHub"
          description="Verify your email address to complete your registration and start building professional resumes"
        />

        <div className="w-full flex flex-col items-center justify-center p-8">
          <form className="md:w-96 w-80 flex flex-col items-center" onSubmit={handleVerify}>
            <header className="text-center mb-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-4xl text-gray-900 font-medium dark:text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-500/90 dark:text-gray-400">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {email}
              </p>
            </header>

            <div className="w-full mb-6">
              <div className="flex gap-2 justify-center">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="w-full mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || verificationCode.join('').length !== 6}
              className="w-full h-11 rounded-md text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="w-full text-center">
              <p className="text-sm text-gray-500/90 dark:text-gray-400 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-[var(--primary-color)] hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Resend Verification Code
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 w-full p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                💡 <strong>Tip:</strong> Check your spam folder if you don't see the email. The code expires in 24 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

