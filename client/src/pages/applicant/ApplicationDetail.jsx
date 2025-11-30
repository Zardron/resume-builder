import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, Clock, FileText, MessageSquare, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const ApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    // TODO: Fetch application from API
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setApplication({
            id: parseInt(id),
            jobTitle: 'Senior Frontend Developer',
            company: 'Tech Corp',
            status: 'reviewing',
            appliedDate: '2024-01-10',
            lastUpdated: '2024-01-12',
            resume: {
              url: '#',
              fileName: 'my_resume.pdf',
            },
            coverLetter: 'I am very interested in this position and believe my skills align perfectly with your requirements. I have 5+ years of experience in frontend development and am excited about the opportunity to contribute to your team.',
            notes: 'Application is currently under review by the hiring team.',
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching application:', error);
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      case 'interview': return Calendar;
      default: return ClockIcon;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      reviewing: 'Under Review',
      interview: 'Interview Scheduled',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (!application) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Application not found</p>
        <button
          onClick={() => navigate('/dashboard/applicant/applications')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(application.status);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/applicant/applications')}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{application.jobTitle}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{application.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5 text-gray-400" />
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(application.status)}`}>
            {getStatusLabel(application.status)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Status */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-blue-600" />
              Application Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Applied Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(application.appliedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(application.lastUpdated).toLocaleDateString()}
                </span>
              </div>
              {application.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{application.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Cover Letter
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{application.coverLetter}</p>
            </div>
          )}

          {/* Resume */}
          {application.resume && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Resume
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{application.resume.fileName}</span>
                <a
                  href={application.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Resume
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/dashboard/applicant/messages?applicationId=${id}`)}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Recruiter
              </button>
              <button
                onClick={() => navigate(`/dashboard/applicant/jobs/${application.jobId || 1}`)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                View Job Posting
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Application Submitted</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {application.status === 'reviewing' && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Under Review</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(application.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;

