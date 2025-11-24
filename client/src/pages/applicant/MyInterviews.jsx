import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const MyInterviews = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    // TODO: Fetch interviews from API
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setInterviews([
            {
              id: 1,
              jobTitle: 'Senior Frontend Developer',
              company: 'Tech Corp',
              date: '2024-01-20',
              time: '10:00',
              type: 'video',
              status: 'scheduled',
              location: '',
            },
            {
              id: 2,
              jobTitle: 'Product Manager',
              company: 'StartupXYZ',
              date: '2024-01-18',
              time: '14:00',
              type: 'phone',
              status: 'completed',
              location: '',
            },
            {
              id: 3,
              jobTitle: 'UX Designer',
              company: 'DesignCo',
              date: '2024-01-25',
              time: '09:00',
              type: 'onsite',
              status: 'scheduled',
              location: '123 Main St, New York, NY',
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'onsite': return MapPin;
      default: return Calendar;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[status] || colors.scheduled;
  };

  const filteredInterviews = statusFilter === 'all'
    ? interviews
    : interviews.filter(interview => interview.status === statusFilter);

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          My Interviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your scheduled interviews</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => {
            const TypeIcon = getTypeIcon(interview.type);
            const StatusIcon = getStatusIcon(interview.status);
            return (
              <div
                key={interview.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{interview.jobTitle}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(interview.status)}`}>
                        <StatusIcon className="h-3 w-3" />
                        {interview.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{interview.company}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {interview.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <TypeIcon className="h-4 w-4" />
                        {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                      </span>
                      {interview.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {interview.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/dashboard/applicant/interviews/${interview.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No interviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviews;

