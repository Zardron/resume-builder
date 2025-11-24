import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckSquare, Eye, Calendar, Briefcase, Clock } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const MyApplications = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('view') || 'all');

  useEffect(() => {
    // TODO: Fetch applications from API
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setApplications([
            {
              id: 1,
              jobTitle: 'Senior Frontend Developer',
              company: 'Tech Corp',
              status: 'pending',
              appliedDate: '2024-01-10',
              lastUpdated: '2024-01-10',
            },
            {
              id: 2,
              jobTitle: 'Product Manager',
              company: 'StartupXYZ',
              status: 'reviewing',
              appliedDate: '2024-01-08',
              lastUpdated: '2024-01-12',
            },
            {
              id: 3,
              jobTitle: 'UX Designer',
              company: 'DesignCo',
              status: 'interview',
              appliedDate: '2024-01-05',
              lastUpdated: '2024-01-13',
            },
            {
              id: 4,
              jobTitle: 'Backend Engineer',
              company: 'Tech Corp',
              status: 'rejected',
              appliedDate: '2023-12-20',
              lastUpdated: '2024-01-01',
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      reviewing: 'Under Review',
      interview: 'Interview',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="h-6 w-6" />
          My Applications
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track the status of your job applications</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All ({applications.length})
          </button>
          {['pending', 'reviewing', 'interview', 'accepted', 'rejected'].map((status) => {
            const count = applications.filter(app => app.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {getStatusLabel(status)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{application.jobTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{application.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied: {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Updated: {new Date(application.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/dashboard/applicant/applications/${application.id}`)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

