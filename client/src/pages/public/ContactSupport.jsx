import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, FileText, Clock, Send, ArrowLeft, Shield } from 'lucide-react';
import BackgroundEffects from '../../components/common/BackgroundEffects';
import { addNotification } from '../../store/slices/notificationsSlice';
import { useAppDispatch } from '../../store/hooks';
import { supportAPI } from '../../services/api';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import DropDownField from '../../components/forms/DropDownField';

const ContactSupport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountEmail: '',
    banDate: '',
    message: '',
    category: 'account_issue',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_BASE_URL}/support/public/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Account Ban Appeal - ${formData.accountEmail}`,
          message: `Account Ban Appeal Request

Account Email: ${formData.accountEmail}
Ban Date (if known): ${formData.banDate || 'Not provided'}

Appeal Message:
${formData.message}`,
          category: formData.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit appeal');
      }

      dispatch(addNotification({
        type: 'success',
        title: 'Appeal Submitted',
        message: 'Your ban appeal has been submitted successfully. We will review it within 48 hours and get back to you.',
      }));

      // Reset form
      setFormData({
        name: '',
        email: '',
        accountEmail: '',
        banDate: '',
        message: '',
        category: 'account_issue',
      });
    } catch (error) {
      console.error('Error submitting appeal:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to submit appeal. Please try again later.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-slate-950">
      <BackgroundEffects />
      
      {/* Header */}
      <div className="relative border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Appeal Account Ban
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            If you believe your account was banned in error, you can submit an appeal. Please provide detailed information about your situation, and we will review your appeal within 48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Information Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Appeal Process
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 mt-7">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What to Include</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Provide your account email, the date of the ban (if known), and a detailed explanation of why you believe the ban was made in error.
                    </p>
                  </div>
                </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Review Time</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We review all appeals within 48 hours during business days.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Mon-Fri, 9am-5pm EST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Important Notice</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please be honest and provide accurate information. False or misleading information may result in your appeal being denied.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <details className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                    How long does it take to review an appeal?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    We review all appeals within 48 hours during business days (Monday-Friday, 9am-5pm EST). You will receive a response via email once the review is complete.
                  </p>
                </details>
                <details className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                    What information should I include in my appeal?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Please include your account email, the date you noticed the ban (if known), and a detailed explanation of why you believe the ban was made in error. Any relevant context or evidence that supports your case is helpful.
                  </p>
                </details>
                <details className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                    Can I submit multiple appeals?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    You can submit one appeal per banned account. If your appeal is denied, you may contact support for further clarification, but repeated appeals for the same case will not be reviewed.
                  </p>
                </details>
                <details className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                    What happens if my appeal is approved?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    If your appeal is approved, your account will be reinstated and you will receive an email confirmation. You will be able to access your account immediately after reinstatement.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Appeal Form */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Submit Ban Appeal
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(value) => handleFieldChange('name', value)}
                  placeholder="Enter your full name"
                  icon="user"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleFieldChange('email', value)}
                  placeholder="your.email@example.com"
                  icon="email"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll send the appeal response to this email
                </p>
              </div>

              <div>
                <label htmlFor="accountEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banned Account Email <span className="text-red-500">*</span>
                </label>
                <InputField
                  id="accountEmail"
                  name="accountEmail"
                  type="email"
                  value={formData.accountEmail}
                  onChange={(value) => handleFieldChange('accountEmail', value)}
                  placeholder="banned.account@example.com"
                  icon="email"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The email address of the banned account
                </p>
              </div>

              <div>
                <label htmlFor="banDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ban Date (Optional)
                </label>
                <InputField
                  id="banDate"
                  name="banDate"
                  type="date"
                  value={formData.banDate}
                  onChange={(value) => handleFieldChange('banDate', value)}
                  icon="calendar"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  When did you notice the account was banned?
                </p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <DropDownField
                  name="category"
                  value={formData.category}
                  onChange={(value) => handleFieldChange('category', value)}
                  placeholder="Select a category"
                  icon="tag"
                  options={[
                    { value: 'account_issue', label: 'Account Issue' },
                    { value: 'general_inquiry', label: 'General Inquiry' },
                    { value: 'technical_issue', label: 'Technical Support' },
                    { value: 'billing_issue', label: 'Billing Question' },
                  ]}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Appeal Message <span className="text-red-500">*</span>
                </label>
                <TextAreaField
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(value) => handleFieldChange('message', value)}
                  rows={8}
                  placeholder="Please provide a detailed explanation of why you believe your account was banned in error. Include any relevant context, evidence, or circumstances that support your case..."
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Be as detailed as possible. This helps us review your appeal more effectively.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> By submitting this appeal, you confirm that all information provided is accurate and truthful. False or misleading information may result in your appeal being denied.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Appeal...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Appeal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
