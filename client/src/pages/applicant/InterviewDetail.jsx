import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, Phone, MapPin, User, Mail, FileText, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const InterviewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    // TODO: Fetch interview from API
    const fetchInterview = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setInterview({
            id: parseInt(id),
            jobTitle: 'Senior Frontend Developer',
            company: 'Tech Corp',
            recruiter: {
              name: 'Jane Smith',
              email: 'jane.smith@techcorp.com',
              phone: '+1 (555) 987-6543',
            },
            date: '2024-01-20',
            time: '10:00',
            duration: 60,
            type: 'video',
            location: '',
            meetingLink: 'https://meet.example.com/interview-123',
            status: 'scheduled',
            notes: 'Please prepare to discuss your experience with React and TypeScript. We will also cover system design questions.',
            createdAt: '2024-01-15T10:00:00',
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching interview:', error);
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'onsite': return MapPin;
      default: return Calendar;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      rescheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return colors[status] || colors.scheduled;
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (!interview) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Interview not found</p>
        <button
          onClick={() => navigate('/dashboard/applicant/interviews')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(interview.type);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/applicant/interviews')}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Details</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {interview.jobTitle} at {interview.company}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusColor(interview.status)}`}>
          {interview.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Information */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Interview Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {new Date(interview.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {interview.time} ({interview.duration} minutes)
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <TypeIcon className="h-4 w-4" />
                  Type
                </p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white capitalize">{interview.type}</p>
              </div>
              {interview.type === 'video' && interview.meetingLink && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Meeting Link</p>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
              {interview.type === 'onsite' && interview.location && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{interview.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {interview.notes && (
            <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Interview Notes</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{interview.notes}</p>
            </div>
          )}

          {/* Recruiter Information */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Recruiter Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">{interview.recruiter.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{interview.recruiter.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{interview.recruiter.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/dashboard/applicant/messages?recruiterId=${interview.recruiter.id || 1}`)}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Recruiter
              </button>
              {interview.type === 'video' && interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  <Video className="h-4 w-4" />
                  Join Video Call
                </a>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Interview Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Prepare questions about the role</li>
              <li>• Review the job description</li>
              <li>• Test your video/audio setup</li>
              <li>• Join 5 minutes early</li>
              <li>• Have your resume ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail;

