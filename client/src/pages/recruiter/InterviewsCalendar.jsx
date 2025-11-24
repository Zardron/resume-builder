import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, Clock, Video, Phone, MapPin } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const InterviewsCalendar = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // TODO: Fetch interviews from API
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setInterviews([
            { id: 1, candidate: 'John Doe', job: 'Senior Developer', time: '2024-01-15T10:00:00', type: 'video', status: 'scheduled' },
            { id: 2, candidate: 'Jane Smith', job: 'Product Manager', time: '2024-01-15T14:00:00', type: 'phone', status: 'scheduled' },
            { id: 3, candidate: 'Bob Johnson', job: 'Designer', time: '2024-01-16T09:00:00', type: 'onsite', status: 'scheduled' }
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
      default: return CalendarIcon;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interviews</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Schedule and manage candidate interviews
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/recruiter/interviews/new')}
          className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
        >
          <Plus className="h-4 w-4" />
          Schedule Interview
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Upcoming Interviews</h2>
          <div className="space-y-4">
            {interviews.length > 0 ? (
              interviews.map((interview) => {
                const TypeIcon = getTypeIcon(interview.type);
                return (
                  <div
                    key={interview.id}
                    onClick={() => navigate(`/dashboard/recruiter/interviews/${interview.id}`)}
                    className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{interview.candidate}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{interview.job}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(interview.time).toLocaleDateString()} at{' '}
                            {new Date(interview.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{interview.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                No upcoming interviews
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h2>
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{interviews.length}</p>
            </div>
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {interviews.filter(i => {
                  const interviewDate = new Date(i.time);
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return interviewDate <= weekFromNow;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsCalendar;

