import { useEffect, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../util/ConfirmationModal';
import ResumeCard from '../../components/ResumeCard';
import CreditsIndicator from '../../components/CreditsIndicator';
import {
  getStoredCredits,
  decrementCredits,
} from '../../utils/creditUtils';

const CREATE_ACTIONS = [
  {
    id: 'new-resume',
    label: 'Create Resume',
    gradient: 'from-[var(--primary-color)] to-[var(--accent-color)]',
  },
  {
    id: 'existing-resume',
    label: 'Upload Existing',
    gradient: 'from-[var(--accent-color)] to-[var(--primary-color)]',
  },
];

const SAMPLE_RESUMES = [
  { name: "Zardron's Resume", date: '10/24/2025' },
  { name: "Alaine's Resume", date: '10/24/2025' },
  { name: "Zaine's Resume", date: '10/24/2025' },
];

const Dashboard = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const navigate = useNavigate();
  const [availableCredits, setAvailableCredits] = useState(getStoredCredits);

  useEffect(() => {
    const handleStorage = () => {
      setAvailableCredits(getStoredCredits());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleCreateAction = (actionId) => {
    const nextCredits = decrementCredits(1);
    setAvailableCredits(nextCredits);
    navigate('/dashboard/builder', { state: { builder: actionId } });
  };

  const handleDeleteClick = (resumeName) => {
    setSelectedResume(resumeName);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    // Handle resume deletion here
    setSelectedResume(null);
  };

  return (
    <>
      <div className="mx-auto px-16 py-8">
        <header className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Welcome to your Smart Resume Builder Dashboard
              </h1>
              <p className="text-sm font-light text-gray-700 dark:text-gray-300 mt-2">
                Craft a professional, standout resume in minutes — powered by AI
              </p>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                When you run out of credits, downloads will include a watermark or credits footer until you purchase more.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 md:items-end">
              <CreditsIndicator availableCredits={availableCredits} />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center gap-4">
          {CREATE_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleCreateAction(action.id)}
              className="w-full bg-white dark:bg-gray-800 max-w-36 h-48 flex flex-col items-center justify-center rounded-lg border border-gray-300 dark:border-white/50 hover:shadow-md hover:border-dashed transition-all duration-300 cursor-pointer"
            >
              <PlusIcon className={`size-11 p-2.5 bg-gradient-to-r ${action.gradient} rounded-full text-white`} />
              <p className="text-xs mt-2 text-gray-900 dark:text-gray-100">{action.label}</p>
            </button>
          ))}
        </div>

        <hr className="w-full border-gray-200 dark:border-gray-700 my-6" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {SAMPLE_RESUMES.map((resume, index) => (
            <ResumeCard
              key={index}
              name={resume.name}
              lastUpdated={resume.date}
              onEdit={() => {
                // Handle edit
              }}
              onDelete={() => handleDeleteClick(resume.name)}
            />
          ))}
        </div>
      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          title="Delete Resume"
          message={`Are you sure you want to delete ${selectedResume}?`}
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
