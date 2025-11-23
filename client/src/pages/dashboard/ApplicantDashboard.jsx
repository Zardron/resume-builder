import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, FileText, Calendar, TrendingUp, 
  Clock, CheckCircle, XCircle, Search, Bookmark, MessageSquare
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,
    profileViews: 0
  });
  const [applicationStatus, setApplicationStatus] = useState({
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [analytics, setAnalytics] = useState({
    applicationSuccessRate: 25,
    interviewConversionRate: 60,
    averageResponseTime: 3.5,
    profileCompleteness: 85
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulated data - replace with actual API call
        setTimeout(() => {
          setStats({
            applications: 12,
            interviews: 3,
            savedJobs: 8,
            profileViews: 45
          });
          setApplicationStatus({
            applied: 5,
            screening: 4,
            interview: 2,
            offer: 1,
            rejected: 0
          });
          setRecommendedJobs([
            { id: 1, title: 'Senior Frontend Developer', company: 'Tech Corp', location: 'Remote', match: 95 },
            { id: 2, title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'San Francisco, CA', match: 92 },
            { id: 3, title: 'React Developer', company: 'DevCompany', location: 'New York, NY', match: 88 }
          ]);
          setRecentApplications([
            { id: 1, job: 'Senior Developer', company: 'Tech Corp', status: 'interview', appliedDate: '2024-01-10' },
            { id: 2, job: 'Product Manager', company: 'StartupXYZ', status: 'screening', appliedDate: '2024-01-12' },
            { id: 3, job: 'Designer', company: 'DesignCo', status: 'applied', appliedDate: '2024-01-13' }
          ]);
          setUpcomingInterviews([
            { id: 1, job: 'Senior Developer', company: 'Tech Corp', time: '2024-01-15T10:00:00', type: 'video' },
            { id: 2, job: 'Product Manager', company: 'StartupXYZ', time: '2024-01-16T14:00:00', type: 'phone' }
          ]);
          setAnalytics({
            applicationSuccessRate: 25,
            interviewConversionRate: 60,
            averageResponseTime: 3.5,
            profileCompleteness: 85
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Total Applications',
      value: stats.applications,
      icon: FileText,
      color: 'blue',
      link: '/dashboard/applicant/applications'
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      icon: Calendar,
      color: 'purple',
      link: '/dashboard/applicant/interviews'
    },
    {
      label: 'Saved Jobs',
      value: stats.savedJobs,
      icon: Bookmark,
      color: 'yellow',
      link: '/dashboard/applicant/jobs/saved'
    },
    {
      label: 'Profile Views',
      value: stats.profileViews,
      icon: TrendingUp,
      color: 'green',
      link: '/dashboard/applicant/profile'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      screening: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      offer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.applied;
  };

  if (isLoading) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Job Search Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {user?.fullName || user?.name}. Track your job search progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => navigate(stat.link)}
              className="relative overflow-hidden rounded-md border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-md bg-${stat.color}-100 p-3 dark:bg-${stat.color}-900/30`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Status Overview */}
      <div className="mb-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Application Status
          </h2>
          <button
            onClick={() => navigate('/dashboard/applicant/applications')}
            className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
          >
            View All
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-5">
          {Object.entries(applicationStatus).map(([stage, count]) => (
            <div
              key={stage}
              className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900/50"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                {stage}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended Jobs */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recommended Jobs
            </h2>
            <button
              onClick={() => navigate('/dashboard/applicant/jobs')}
              className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
            >
              Browse All
            </button>
          </div>
          <div className="space-y-4">
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/dashboard/applicant/jobs/${job.id}`)}
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {job.company} • {job.location}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          {job.match}% Match
                        </span>
                      </div>
                    </div>
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                No recommended jobs. Complete your profile for better matches.
              </p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Applications
            </h2>
            <button
              onClick={() => navigate('/dashboard/applicant/applications')}
              className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => navigate(`/dashboard/applicant/applications/${app.id}`)}
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {app.job}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {app.company}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Applied {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                No applications yet. Start applying to jobs!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="mt-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Interviews
            </h2>
            <button
              onClick={() => navigate('/dashboard/applicant/interviews')}
              className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
            >
              View All
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                onClick={() => navigate(`/dashboard/applicant/interviews/${interview.id}`)}
                className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {interview.job}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {interview.company}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(interview.time).toLocaleDateString()} at{' '}
                        {new Date(interview.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="ml-2 capitalize">({interview.type})</span>
                    </div>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="mt-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Job Search Analytics
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.applicationSuccessRate}%
                </p>
                <p className="mt-1 text-xs text-green-600">+5% this month</p>
              </div>
              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interview Rate</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.interviewConversionRate}%
                </p>
                <p className="mt-1 text-xs text-green-600">+8% this month</p>
              </div>
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.averageResponseTime} days
                </p>
                <p className="mt-1 text-xs text-green-600">-0.5 days faster</p>
              </div>
              <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Complete</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.profileCompleteness}%
                </p>
                <p className="mt-1 text-xs text-yellow-600">Complete profile for better matches</p>
              </div>
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/30">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Application Status Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(applicationStatus).map(([stage, count]) => {
                const total = Object.values(applicationStatus).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={stage}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {stage}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-[var(--primary-color)] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.applications} applications submitted
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.interviews} interviews scheduled
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.savedJobs} jobs saved
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Profile viewed {stats.profileViews} times
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate('/dashboard/applicant/jobs')}
            className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Browse Jobs</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Find opportunities</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard/applicant/applications')}
            className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">My Applications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Track status</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard/builder')}
            className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Update Resume</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Edit resume</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard/applicant/messages')}
            className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/30">
              <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Messages</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">View messages</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;

