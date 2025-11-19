import { useEffect, useState, useMemo } from 'react';
import { PlusIcon, FileText, Upload, Sparkles, ArrowRight, Search, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmationModal from '../../util/ConfirmationModal';
import ResumeCard from '../../components/ResumeCard';
import CreditsIndicator from '../../components/CreditsIndicator';
import { useApp } from '../../contexts/AppContext';
import Tooltip from '../../components/Tooltip';
import useKeyboardShortcuts from '../../utils/keyboardShortcuts';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const CREATE_ACTIONS = [
  {
    id: 'new-resume',
    label: 'Create New Resume',
    description: 'Start from scratch with AI assistance',
    gradient: 'from-[var(--primary-color)] to-[var(--accent-color)]',
    icon: FileText,
    color: 'blue',
    isPremium: false,
  },
  {
    id: 'existing-resume',
    label: 'Upload Existing',
    description: 'Import and enhance your current resume with AI',
    gradient: 'from-[var(--accent-color)] to-[var(--primary-color)]',
    icon: Upload,
    color: 'cyan',
    isPremium: true,
  },
];

const Dashboard = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { credits, resumes, useCredits, addNotification, deleteResume, isSubscribed } = useApp();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      keys: 'ctrl+k',
      handler: () => {
        const searchInput = document.querySelector('input[type="search"]');
        searchInput?.focus();
      },
    },
    {
      keys: 'ctrl+n',
      handler: () => {
        handleCreateAction('new-resume');
      },
    },
  ]);

  const handleCreateAction = (actionId) => {
    const action = CREATE_ACTIONS.find(a => a.id === actionId);
    
    // Check if it's a premium feature and user is not subscribed
    if (action?.isPremium && !isSubscribed) {
      addNotification({
        type: 'info',
        title: 'Premium Feature',
        message: 'Subscribe to Premium to unlock AI-powered resume upload and enhancement.',
      });
      navigate('/dashboard/subscription');
      return;
    }

    const nextCredits = useCredits(1);
    if (nextCredits >= 0) {
      addNotification({
        type: 'info',
        title: 'Starting Resume Builder',
        message: 'You can start building your resume now!',
      });
      navigate('/dashboard/builder', { state: { builder: actionId } });
    } else {
      addNotification({
        type: 'warning',
        title: 'Insufficient Credits',
        message: 'Please purchase more credits to continue.',
      });
    }
  };

  const handleDeleteClick = (resumeId, resumeName) => {
    setSelectedResume({ id: resumeId, name: resumeName });
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedResume?.id) {
      deleteResume(selectedResume.id);
      addNotification({
        type: 'success',
        title: 'Resume Deleted',
        message: `${selectedResume.name} has been deleted successfully.`,
      });
    }
    setSelectedResume(null);
  };

  // Filter resumes based on search query
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes;
    const query = searchQuery.toLowerCase();
    return resumes.filter(resume =>
      resume.name.toLowerCase().includes(query) ||
      resume.template?.toLowerCase().includes(query)
    );
  }, [resumes, searchQuery]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Header Section */}
        <header className="relative mb-12 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] p-8 text-white shadow-xl dark:border-gray-700/50">
          <div className="absolute -top-24 right-14 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Account dashboard
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-white/80">
                  Personalize your experience, refine job-search targeting, and keep all resume-related
                  activity in one organized place.
                </p>
              </div>
              <div className="flex-shrink-0">
                <CreditsIndicator availableCredits={credits} />
              </div>
            </div>
          </div>
        </header>

        {/* Info Banner */}
        <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Sparkles className="h-5 w-5 text-[var(--primary-color)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                About Credits
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Credits are needed to fully unlock the live preview feature. When you run out of credits, downloads will include a watermark or credits footer until you purchase more. 
                <Link
                  to="/dashboard/purchase"
                  className="ml-1 font-medium text-[var(--primary-color)] underline underline-offset-2 hover:text-[var(--secondary-color)]"
                >
                  Buy credits
                </Link>{' '}
                to unlock unlimited watermark-free downloads and full preview access.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Start building or upload your existing resume
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {CREATE_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isLocked = action.isPremium && !isSubscribed;
              
              return (
                <Tooltip
                  key={action.id}
                  content={isLocked ? 'Subscribe to Premium to unlock AI-powered resume upload' : action.description}
                  position="top"
                >
                  <div className="relative">
                    {isLocked && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-color)]/10 px-2 py-1 text-xs font-semibold text-[var(--primary-color)]">
                          <Lock className="h-3 w-3" />
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCreateAction(action.id)}
                      disabled={false}
                      className={`w-full group relative overflow-hidden rounded-xl border p-6 text-left shadow-sm transition-all duration-300 ${
                        isLocked
                          ? 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50 cursor-pointer opacity-90'
                          : 'border-gray-200 bg-white hover:border-[var(--primary-color)] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[var(--primary-color)]'
                      }`}
                      aria-label={action.label}
                    >
                      {!isLocked && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--accent-color)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      )}
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg ${action.color === 'blue' ? 'shadow-blue-500/25' : 'shadow-cyan-500/25'} ${isLocked ? 'opacity-60' : ''}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {action.label}
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                          {isLocked ? (
                            <Link
                              to="/dashboard/subscription"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>Subscribe to Premium</span>
                            </Link>
                          ) : (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all group-hover:bg-[var(--secondary-color)] group-hover:translate-x-1 group-hover:shadow-md">
                              <span>Get started</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </section>

        {/* Resumes Section */}
        <section>
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Resumes
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} in your workspace
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {resumes.length > 0 && (
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search resumes... (Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    aria-label="Search resumes"
                  />
                </div>
              )}
              {resumes.length === 0 && (
                <Link
                  to="/dashboard/builder"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create your first
                </Link>
              )}
            </div>
          </div>

          {filteredResumes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  name={resume.name}
                  lastUpdated={resume.date}
                  onEdit={() => {
                    navigate('/dashboard/builder', { state: { resumeId: resume.id } });
                  }}
                  onDelete={() => handleDeleteClick(resume.id, resume.name)}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No results found
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Try adjusting your search query
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-6 py-3 text-sm font-medium text-gray-900 dark:text-white transition hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No resumes yet
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Get started by creating your first professional resume
              </p>
              <button
                onClick={() => handleCreateAction('new-resume')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
              >
                <PlusIcon className="h-4 w-4" />
                Create Resume
              </button>
            </div>
          )}
        </section>
      </div>

      {showConfirmationModal && selectedResume && (
        <ConfirmationModal
          title="Delete Resume"
          message={`Are you sure you want to delete "${selectedResume.name}"? This action cannot be undone.`}
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
          setShowConfirmationModal={setShowConfirmationModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default Dashboard;
