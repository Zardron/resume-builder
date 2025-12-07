import { useState, useEffect } from 'react';
import { MessageSquare, Send, Mail, Clock, HelpCircle, FileText, CheckCircle } from 'lucide-react';
import SectionBadge from './SectionBadge';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/notificationsSlice';
import { supportAPI } from '../../services/api';
import InputField from '../forms/InputField';
import TextAreaField from '../forms/TextAreaField';
import DropDownField from '../forms/DropDownField';

const ContactSupportSection = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If user is authenticated, use the support ticket API
      if (isAuthenticated) {
        const ticketData = {
          subject: formData.subject,
          category: formData.category,
          priority: 'medium',
          description: formData.message,
        };
        await supportAPI.createTicket(ticketData);
        dispatch(
          addNotification({
            type: 'success',
            title: 'Message Sent',
            message: 'Your support ticket has been created successfully. We will get back to you as soon as possible.',
          })
        );
      } else {
        // For unauthenticated users, use public contact endpoint
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}/support/public/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            category: formData.category,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to send message');
        }

        dispatch(
          addNotification({
            type: 'success',
            title: 'Message Sent',
            message: 'Your message has been sent successfully. We will get back to you as soon as possible.',
          })
        );
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to send message. Please try again later.',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  return (
    <section
      id="contact-support"
      className="relative mt-24 px-4 sm:px-6 md:px-8 pb-10"
      aria-labelledby="contact-support-heading"
    >
      <div className="text-center max-w-3xl mx-auto">
        <SectionBadge icon={MessageSquare} label="Contact Support" className="mx-auto" />
        <h1
          id="contact-support-heading"
          className="mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100 md:text-4xl"
        >
          Get in Touch
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 md:text-base">
          Have a question or need assistance? We're here to help with general inquiries, technical support, billing questions, and feature requests. Reach out to our support team and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 mt-7">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    support@resumeiqhub.com
                  </p>
                  <a
                    href="mailto:support@resumeiqhub.com"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                  >
                    Send email
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available 24/7 for instant support
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Sign in to access live chat
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Response Time</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We typically respond within 24 hours
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Mon-Fri, 9am-5pm EST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Helpful Tips</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Include your account email and a detailed description of your issue for faster resolution.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    For urgent matters, use live chat
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Response</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We aim to respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    { value: 'general_inquiry', label: 'General Inquiry' },
                    { value: 'technical_issue', label: 'Technical Support' },
                    { value: 'billing_issue', label: 'Billing Question' },
                    { value: 'feature_request', label: 'Feature Request' },
                    { value: 'bug_report', label: 'Bug Report' },
                  ]}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
              </div>

              {!isAuthenticated && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <InputField
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={(value) => handleFieldChange('name', value)}
                      placeholder="Enter your name"
                      icon="user"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
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
                  </div>
                </>
              )}

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <InputField
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(value) => handleFieldChange('subject', value)}
                  placeholder="Enter subject"
                  icon="title"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <TextAreaField
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(value) => handleFieldChange('message', value)}
                  placeholder="Tell us about your experience..."
                  rows={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupportSection;
