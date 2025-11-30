import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Edit, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const ResumeBuilderList = () => {
  const navigate = useNavigate();
  const { resumes, loadResumes, deleteResume, isLoading: appLoading } = useApp();
  const [isDeleting, setIsDeleting] = useState(null);
  const [localResumes, setLocalResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        await loadResumes();
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [loadResumes]);

  useEffect(() => {
    setLocalResumes(resumes);
  }, [resumes]);

  const handleCreateNew = () => {
    navigate('/dashboard/builder', { 
      state: { builder: 'new-resume' } 
    });
  };

  const handleEditResume = (resumeId) => {
    navigate('/dashboard/builder', { 
      state: { resumeId, builder: 'edit-resume' } 
    });
  };

  const handleDeleteResume = async (resumeId, resumeName) => {
    if (!window.confirm(`Are you sure you want to delete "${resumeName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(resumeId);
      await deleteResume(resumeId);
      setLocalResumes(prev => prev.filter(r => r.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading || appLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSkeleton type="default" className="w-full h-64" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Resume Builder
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create new resume templates or update existing ones
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Create New Template
          </button>
        </div>
      </div>

      {/* Create New Resume Card */}
      <div className="mb-8">
        <div
          onClick={handleCreateNew}
          className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-[var(--primary-color)] bg-gradient-to-br from-[var(--primary-color)]/10 via-[var(--secondary-color)]/10 to-[var(--accent-color)]/10 p-8 text-center transition-all hover:border-solid hover:shadow-lg dark:from-[var(--primary-color)]/20 dark:via-[var(--secondary-color)]/20 dark:to-[var(--accent-color)]/20"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] shadow-lg transition-transform group-hover:scale-110">
            <Plus className="h-10 w-10 text-white" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Create New Resume Template
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start building a professional resume from scratch with our AI-powered builder
          </p>
        </div>
      </div>

      {/* Existing Resumes */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Resumes ({localResumes.length})
          </h2>
        </div>
      </div>

      {localResumes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            No resumes yet
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Get started by creating your first resume template
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {localResumes.map((resume) => (
            <div
              key={resume.id}
              className="group relative flex h-full min-h-[200px] flex-col rounded-md border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[var(--primary-color)] hover:bg-gray-50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[var(--primary-color)] dark:hover:bg-gray-800/90"
            >
              {/* Action buttons - visible on hover */}
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditResume(resume.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-[var(--primary-color)] shadow-md transition-all hover:scale-110 hover:shadow-lg dark:bg-gray-700 dark:text-blue-300"
                  aria-label="Edit resume"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResume(resume.id, resume.name);
                  }}
                  disabled={isDeleting === resume.id}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-red-600 shadow-md transition-all hover:scale-110 hover:shadow-lg disabled:opacity-50 dark:bg-gray-700 dark:text-red-400"
                  aria-label="Delete resume"
                >
                  {isDeleting === resume.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Main content */}
              <div
                onClick={() => handleEditResume(resume.id)}
                className="relative z-0 flex flex-1 cursor-pointer flex-col items-center justify-center text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {resume.name || 'Untitled Resume'}
                </h3>
                {resume.template && (
                  <span className="mb-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {resume.template}
                  </span>
                )}
                <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {formatDate(resume.updatedAt || resume.date || resume.createdAt)}
                  </span>
                </div>
                {resume.isDraft && (
                  <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Draft
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderList;

