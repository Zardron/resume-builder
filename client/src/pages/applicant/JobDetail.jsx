import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, FileText, Send } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // TODO: Fetch job from API
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setJob({
            id: parseInt(id),
            title: 'Senior Frontend Developer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            employmentType: 'Full-time',
            salary: '$120k - $150k',
            postedDate: '2024-01-10',
            description: 'We are looking for an experienced frontend developer to join our team. You will be responsible for building and maintaining our web applications using modern technologies.',
            requirements: '• 5+ years of experience in frontend development\n• Strong knowledge of React, TypeScript, and modern JavaScript\n• Experience with state management libraries\n• Familiarity with testing frameworks',
            responsibilities: '• Develop and maintain web applications\n• Collaborate with design and backend teams\n• Write clean, maintainable code\n• Participate in code reviews',
            benefits: '• Competitive salary\n• Health insurance\n• Remote work options\n• Professional development opportunities',
          });
          // TODO: Check if user has already applied
          setHasApplied(false);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching job:', error);
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    // TODO: Navigate to application form or submit application
    navigate(`/dashboard/applicant/jobs/${id}/apply`);
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (!job) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Job not found</p>
        <button
          onClick={() => navigate('/dashboard/applicant/jobs')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/applicant/jobs')}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
          </div>
        </div>
        {!hasApplied ? (
          <button
            onClick={handleApply}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            Apply Now
          </button>
        ) : (
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Applied
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Job Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Employment Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.employmentType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Salary</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Posted</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Key Responsibilities</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Requirements</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Benefits</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.benefits}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Apply */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Apply</h3>
            {!hasApplied ? (
              <button
                onClick={handleApply}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Apply for this Job
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You have already applied for this position.</p>
                <button
                  onClick={() => navigate(`/dashboard/applicant/applications?jobId=${id}`)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  View Application
                </button>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">About {job.company}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {/* TODO: Add company description from API */}
              A leading technology company focused on innovation and excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

