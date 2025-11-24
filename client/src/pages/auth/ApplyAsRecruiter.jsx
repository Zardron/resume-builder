import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BuildingIcon, Check, CheckCircle2 } from 'lucide-react';
import InputField from '../../components/forms/InputField';
import ThemeSwitcher from '../../utils/ThemeSwitcher';
import BackgroundEffects from '../../components/common/BackgroundEffects';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/notificationsSlice';
import { RECRUITER_PLANS } from '../../config/pricing';
import { recruiterApplicationsAPI } from '../../services/api';

const validateEmail = (email) => email.trim() && email.includes('@');

const ApplyAsRecruiter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    position: '',
    message: '',
    selectedPlan: 'professional', // Default to Professional plan
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    company: false,
    position: false,
    message: false,
    selectedPlan: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      fullName: !formData.fullName.trim(),
      email: !validateEmail(formData.email),
      company: !formData.company.trim(),
      position: !formData.position.trim(),
      message: !formData.message.trim(),
      selectedPlan: !formData.selectedPlan,
    };
    
    setErrors(newErrors);
    setErrorMessage('');
    setSuccessMessage('');
    
    const hasNoErrors = Object.values(newErrors).every(error => !error);
    if (hasNoErrors) {
      setIsLoading(true);
      try {
        await recruiterApplicationsAPI.create({
          fullName: formData.fullName,
          email: formData.email,
          company: formData.company,
          position: formData.position,
          message: formData.message,
          selectedPlan: formData.selectedPlan,
        });
        
        setSuccessMessage('Your application has been submitted successfully! We will contact you soon.');
        dispatch(addNotification({
          type: 'success',
          title: 'Application Submitted!',
          message: 'Your recruiter application has been sent to the administrator. You will be contacted soon.',
        }));
        
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          company: '',
          position: '',
          message: '',
          selectedPlan: 'professional',
        });
        
        // Optionally redirect after a delay
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      } catch (error) {
        const errorMsg = error.message || 'Failed to submit application. Please try again.';
        setErrorMessage(errorMsg);
        dispatch(addNotification({
          type: 'error',
          title: 'Submission Failed',
          message: errorMsg,
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            
            <div className="flex items-center justify-center mb-6 mt-12">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                <BuildingIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Apply as Recruiter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
              Fill out the form below to request a recruiter account. Our admin team will review your application and contact you.
            </p>
            <Link
              to="/recruiter-benefits"
              className="inline-block text-sm text-[var(--primary-color)] hover:underline"
            >
              View benefits of becoming a recruiter →
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 p-8 md:p-12">
            <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-6">
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
                type="text"
                placeholder="Company Name"
                required
                icon="building"
                name="company"
                value={formData.company}
                hasError={errors.company}
                onChange={(value) => handleInputChange('company', value)}
              />

              <InputField
                type="text"
                placeholder="Your Position/Title"
                required
                icon="user"
                name="position"
                value={formData.position}
                hasError={errors.position}
                onChange={(value) => handleInputChange('position', value)}
              />

              {/* Payment Plan Selection */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select Subscription Plan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Starter Plan */}
                      <button
                        type="button"
                    onClick={() => handleInputChange('selectedPlan', 'starter')}
                    className={`relative flex h-full flex-col rounded-md border p-5 text-left shadow-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 ${
                      formData.selectedPlan === 'starter'
                        ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5 dark:bg-[var(--primary-color)]/10'
                        : 'border-slate-200 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {formData.selectedPlan === 'starter' && (
                      <div className="absolute right-4 top-4">
                        <Check className="w-5 h-5 text-[var(--primary-color)]" />
                      </div>
                    )}
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                      {RECRUITER_PLANS.starter.name}
                    </h4>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                      ₱{RECRUITER_PLANS.starter.price.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500">/month</span>
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Recruiting Features
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>{RECRUITER_PLANS.starter.features.jobPostings} active job postings</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Candidate pipeline management</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Basic candidate screening</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Application management</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Basic analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Email support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </button>

                  {/* Professional Plan */}
                  <button
                    type="button"
                    onClick={() => handleInputChange('selectedPlan', 'professional')}
                    className={`relative flex h-full flex-col rounded-md border-2 p-5 text-left shadow-lg transition hover:shadow-xl dark:bg-slate-800 ${
                      formData.selectedPlan === 'professional'
                        ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5 dark:bg-[var(--primary-color)]/10'
                        : 'border-[var(--primary-color)] bg-white dark:border-[var(--primary-color)] dark:bg-slate-900'
                    }`}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                          </span>
                    {formData.selectedPlan === 'professional' && (
                      <div className="absolute right-4 top-4">
                        <Check className="w-5 h-5 text-[var(--primary-color)]" />
                      </div>
                    )}
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                      {RECRUITER_PLANS.professional.name}
                    </h4>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                      ₱{RECRUITER_PLANS.professional.price.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500">/month</span>
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Recruiting Features
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>{RECRUITER_PLANS.professional.features.jobPostings} active job postings</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>AI-powered candidate screening</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>AI candidate matching scores</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Interview scheduling</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Advanced analytics & insights</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Candidate messaging</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Priority support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </button>

                  {/* Premium Plan */}
                  <button
                    type="button"
                    onClick={() => handleInputChange('selectedPlan', 'premium')}
                    className={`relative flex h-full flex-col rounded-md border p-5 text-left shadow-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 ${
                      formData.selectedPlan === 'premium'
                        ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5 dark:bg-[var(--primary-color)]/10'
                        : 'border-slate-200 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {formData.selectedPlan === 'premium' && (
                      <div className="absolute right-4 top-4">
                        <Check className="w-5 h-5 text-[var(--primary-color)]" />
                        </div>
                    )}
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                      {RECRUITER_PLANS.premium.name}
                    </h4>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                      ₱{RECRUITER_PLANS.premium.price.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500">/month</span>
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Recruiting Features
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>
                              {RECRUITER_PLANS.premium.features.jobPostings === -1
                                ? 'Unlimited'
                                : RECRUITER_PLANS.premium.features.jobPostings}{' '}
                              job postings
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Advanced AI screening & matching</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Video interview integration</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Custom pipeline stages</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Bulk candidate operations</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>Advanced reporting & exports</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            <span>24/7 priority support</span>
                          </li>
                        </ul>
                            </div>
                        </div>
                      </button>
                </div>
                {errors.selectedPlan && (
                  <p className="mt-2 text-sm text-red-500">Please select a subscription plan</p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why do you want to become a recruiter?
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your company and why you need recruiter access..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-md border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-[var(--primary-color)]'
                  }`}
                  required
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">This field is required</p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 w-full p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 w-full p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
              </div>
            )}

            {/* Selected Plan Summary */}
            {formData.selectedPlan && RECRUITER_PLANS[formData.selectedPlan] && (
              <div className="mt-6 w-full p-5 rounded-md bg-gradient-to-r from-[var(--primary-color)]/10 to-[var(--accent-color)]/10 dark:from-[var(--primary-color)]/20 dark:to-[var(--accent-color)]/20 border-2 border-[var(--primary-color)]/30 dark:border-[var(--primary-color)]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Selected Plan:
                  </span>
                  <span className="text-base font-bold text-[var(--primary-color)]">
                    {RECRUITER_PLANS[formData.selectedPlan].name}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Monthly Price:
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ₱{RECRUITER_PLANS[formData.selectedPlan].price.toLocaleString('en-US')}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span>
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                    Plan Includes:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                      <span>
                        {RECRUITER_PLANS[formData.selectedPlan].features.jobPostings === -1
                          ? 'Unlimited'
                          : RECRUITER_PLANS[formData.selectedPlan].features.jobPostings}{' '}
                        active job postings
                      </span>
                    </div>
                    {RECRUITER_PLANS[formData.selectedPlan].features.aiScreening && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                        <span>AI-powered candidate screening</span>
                      </div>
                    )}
                    {RECRUITER_PLANS[formData.selectedPlan].features.advancedAnalytics && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                        <span>Advanced analytics & insights</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full h-11 rounded-md text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-[var(--primary-color)] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApplyAsRecruiter;

