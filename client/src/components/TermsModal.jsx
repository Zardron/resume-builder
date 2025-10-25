import React, { useState, useEffect, useRef } from "react";

const TermsModal = ({ 
  showTermsModal, 
  setShowTermsModal, 
  setTermsAccepted, 
  errors, 
  setErrors 
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [modalTermsAccepted, setModalTermsAccepted] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!showTermsModal) {
      setHasScrolledToBottom(false);
      setModalTermsAccepted(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [showTermsModal]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
    setHasScrolledToBottom(isAtBottom);
    
    if (!isAtBottom && modalTermsAccepted) {
      setModalTermsAccepted(false);
    }
  };

  const openTermsModal = () => {
    setHasScrolledToBottom(false);
    setModalTermsAccepted(false);
    setShowTermsModal(true);
  };

  const handleTermsClick = () => {
    if (modalTermsAccepted) {
      setModalTermsAccepted(false);
      if (errors.terms) {
        setErrors((prev) => ({ ...prev, terms: false }));
      }
    } else {
      openTermsModal();
    }
  };

  const handleCloseModal = () => {
    setShowTermsModal(false);
  };

  const handleAccept = () => {
    if (modalTermsAccepted) {
      setTermsAccepted(true);
      if (errors.terms) {
        setErrors((prev) => ({ ...prev, terms: false }));
      }
    }
    setShowTermsModal(false);
  };

  return (
    <>
      {showTermsModal && (
        <div className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms and Conditions
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div 
              ref={scrollContainerRef}
              className="p-6 overflow-y-auto max-h-[60vh]"
              onScroll={handleScroll}
            >
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  1. Acceptance of Terms
                </h4>
                <p>
                  By accessing and using this AI-powered Resume Builder service, you accept
                  and agree to be bound by the terms and provision of this
                  agreement. This service is created and maintained by <strong>Zardron Angelo Pesquera</strong>.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  2. Service Description
                </h4>
                <p>
                  Our Resume Builder is an AI-powered platform that helps users create professional, 
                  ATS-optimized resumes using smart templates, real-time optimization, and AI suggestions. 
                  The service includes multiple resume templates (Classic, Modern, Minimal, and Minimal Image), 
                  AI-powered content suggestions, and seamless export capabilities.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  3. Use License
                </h4>
                <p>
                  Permission is granted to use this Resume Builder for personal and professional 
                  resume creation. You may create, store, and manage multiple resumes. This is
                  the grant of a license, not a transfer of title. Commercial use of the service
                  for resume writing services to third parties is prohibited without written consent.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  4. AI-Powered Features
                </h4>
                <p>
                  Our service uses artificial intelligence to provide content suggestions, 
                  real-time optimization, and smart recommendations. You understand that AI 
                  suggestions are recommendations only and you are responsible for reviewing 
                  and approving all content before use. We do not guarantee the accuracy or 
                  effectiveness of AI-generated content.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  5. Privacy Policy & Data Collection
                </h4>
                <p>
                  We collect personal information including your name, email, password, and resume data 
                  (work experience, education, skills, contact information, and professional summary). 
                  This data is used to provide our service, improve AI suggestions, and maintain your 
                  account. We implement security measures to protect your data, but you acknowledge 
                  that no internet transmission is 100% secure.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  6. User Account & Responsibilities
                </h4>
                <p>
                  You are responsible for safeguarding your password and maintaining account confidentiality. 
                  You agree to accept responsibility for all activities under your account. You must provide 
                  accurate information and are responsible for the accuracy and truthfulness of all resume content. 
                  You may not create false or misleading information in your resumes.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  7. Content Ownership & License
                </h4>
                <p>
                  You retain ownership of your resume content and personal information. You grant us a 
                  non-exclusive license to use, store, and process your content as necessary to provide 
                  the service, including AI processing for suggestions and optimization. You may export 
                  your resumes in various formats and delete your account at any time.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  8. Template Usage & Intellectual Property
                </h4>
                <p>
                  Our resume templates are proprietary designs. You may use them for your personal resumes 
                  but may not redistribute, modify, or create derivative works from our templates. The 
                  AI-powered features and optimization algorithms are our intellectual property.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  9. Prohibited Uses
                </h4>
                <p>
                  You may not use our service for any unlawful purpose, to create fraudulent resumes, 
                  or to violate any laws. You may not attempt to reverse engineer our AI algorithms, 
                  scrape our templates, or use the service to compete with our business. You may not 
                  share your account credentials with others.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  10. Service Availability
                </h4>
                <p>
                  We strive to maintain service availability but do not guarantee uninterrupted access. 
                  We may perform maintenance, updates, or modifications that temporarily affect service 
                  availability. We are not liable for any downtime or service interruptions.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  11. Termination
                </h4>
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for 
                  violation of these terms, fraudulent activity, or any reason at our discretion. 
                  Upon termination, you may lose access to your data, though we will provide reasonable 
                  notice for data export when possible.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  12. Changes to Terms
                </h4>
                <p>
                  We reserve the right to modify these Terms at any time. Material changes will be 
                  communicated with at least 30 days notice. Continued use of the service after 
                  changes constitutes acceptance of the new terms.
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white">
                  13. Contact Information
                </h4>
                <p>
                  For questions about these terms or our service, please contact us through the 
                  provided contact methods on our platform. This service is operated by Zardron Angelo Pesquera.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-terms"
                    checked={modalTermsAccepted}
                    disabled={!hasScrolledToBottom}
                    onChange={(e) => {
                      setModalTermsAccepted(e.target.checked);
                      if (errors.terms) {
                        setErrors((prev) => ({ ...prev, terms: false }));
                      }
                    }}
                    className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                      !hasScrolledToBottom ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <label
                    htmlFor="modal-terms"
                    className={`text-sm ${
                      !hasScrolledToBottom 
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {!hasScrolledToBottom 
                      ? 'Please scroll to the bottom to read all terms and conditions'
                      : 'I have read and agree to the terms and conditions'
                    }
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={!modalTermsAccepted}
                    className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] transition-all duration-300 rounded-md ${
                      !modalTermsAccepted ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsModal;
