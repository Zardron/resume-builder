import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, Calendar, TrendingUp, Plus, 
  Clock, CheckCircle, XCircle, AlertCircle, ArrowRight,
  DollarSign, MessageSquare, Building2, FileText, Shield
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'super_admin';
  const basePath = isSuperAdmin ? '/dashboard/admin' : '/dashboard/recruiter';
  
  // Helper function to get path with correct base
  const getPath = (relativePath) => {
    return `${basePath}${relativePath}`;
  };
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    offersSent: 0,
    pipeline: {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    }
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [analytics, setAnalytics] = useState({
    timeToHire: 28,
    applicationToHire: 12.5,
    costPerHire: 3500,
    offerAcceptance: 85
  });
  const [platformAnalytics, setPlatformAnalytics] = useState({
    totalOrganizations: 45,
    totalUsers: 1250,
    totalJobs: 320,
    activeRecruiters: 180,
    totalResumes: 2500,
    activeSuperAdmins: 3
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
            activeJobs: 12,
            totalApplications: 145,
            interviewsScheduled: 8,
            offersSent: 3,
            pipeline: {
              applied: 45,
              screening: 32,
              interview: 18,
              offer: 5,
              rejected: 45
            }
          });
          setRecentApplications([
            { id: 1, name: 'John Doe', job: 'Senior Developer', score: 92, status: 'screening' },
            { id: 2, name: 'Jane Smith', job: 'Product Manager', score: 88, status: 'interview' },
            { id: 3, name: 'Bob Johnson', job: 'Designer', score: 85, status: 'applied' }
          ]);
          setUpcomingInterviews([
            { id: 1, candidate: 'John Doe', job: 'Senior Developer', time: '2024-01-15T10:00:00', type: 'video' },
            { id: 2, candidate: 'Jane Smith', job: 'Product Manager', time: '2024-01-15T14:00:00', type: 'phone' }
          ]);
          setAnalytics({
            timeToHire: 28,
            applicationToHire: 12.5,
            costPerHire: 3500,
            offerAcceptance: 85
          });
          setPlatformAnalytics({
            totalOrganizations: 45,
            totalUsers: 1250,
            totalJobs: 320,
            activeRecruiters: 180,
            totalResumes: 2500,
            activeSuperAdmins: 3
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
      label: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      color: 'blue',
      link: getPath('/jobs'),
      hideForSuperAdmin: true
    },
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'green',
      link: getPath('/candidates'),
      hideForSuperAdmin: true
    },
    {
      label: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: Calendar,
      color: 'purple',
      link: getPath('/interviews'),
      hideForSuperAdmin: true
    },
    {
      label: 'Offers Sent',
      value: stats.offersSent,
      icon: CheckCircle,
      color: 'orange',
      link: getPath('/candidates?status=offer'),
      hideForSuperAdmin: true
    }
  ].filter(card => !isSuperAdmin || !card.hideForSuperAdmin);

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
      <div className="w-full">
        <LoadingSkeleton type="default" className="w-full h-64" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {user?.fullName || user?.name}. Here's your website overview.
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

      {/* Pipeline Overview - Hidden for super admin */}
      {!isSuperAdmin && (
        <div className="mb-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pipeline Overview
            </h2>
            <button
              onClick={() => navigate(getPath('/candidates'))}
              className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
            >
              View All
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            {Object.entries(stats.pipeline).map(([stage, count]) => (
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
      )}

      {/* Recent Applications and Interviews - Hidden for super admin */}
      {!isSuperAdmin && (
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Recent Applications */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
              <button
                onClick={() => navigate(getPath('/candidates'))}
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
                    onClick={() => navigate(getPath(`/candidates/${app.id}`))}
                    className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {app.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {app.job}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Match: {app.score}%
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No recent applications
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upcoming Interviews
              </h2>
              <button
                onClick={() => navigate(getPath('/interviews'))}
                className="text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    onClick={() => navigate(getPath(`/interviews/${interview.id}`))}
                    className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {interview.candidate}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {interview.job}
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
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No upcoming interviews
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Platform Analytics */}
      {isSuperAdmin && (
        <>
          <div className="mb-8 rounded-md border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Platform Administration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              As a super admin, you have access to platform-wide management features. 
              Job posting and candidate management features are available to recruiters and organization admins.
            </p>
          </div>

          {/* Platform-Wide Analytics */}
          <div className="mb-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Platform Analytics
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              <div 
                onClick={() => navigate(getPath('/organization'))}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer transition-all hover:border-blue-300 hover:shadow-md dark:hover:border-blue-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Organizations</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {platformAnalytics.totalOrganizations}
                    </p>
                    <p className="mt-1 text-xs text-green-600">+3 this month</p>
                  </div>
                  <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate(getPath('/analytics'))}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer transition-all hover:border-green-300 hover:shadow-md dark:hover:border-green-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {platformAnalytics.totalUsers.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-green-600">+125 this month</p>
                  </div>
                  <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate(getPath('/jobs'))}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer transition-all hover:border-purple-300 hover:shadow-md dark:hover:border-purple-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {platformAnalytics.totalJobs}
                    </p>
                    <p className="mt-1 text-xs text-green-600">+18 this month</p>
                  </div>
                  <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                    <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate(getPath('/team'))}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer transition-all hover:border-cyan-300 hover:shadow-md dark:hover:border-cyan-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Recruiters</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {platformAnalytics.activeRecruiters}
                    </p>
                    <p className="mt-1 text-xs text-green-600">+12 this month</p>
                  </div>
                  <div className="rounded-md bg-cyan-100 p-2 dark:bg-cyan-900/30">
                    <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate(`${getPath('/analytics')}?subscribers=true`)}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer transition-all hover:border-pink-300 hover:shadow-md dark:hover:border-pink-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscriber</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {platformAnalytics.totalResumes.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-green-600">+250 this month</p>
                  </div>
                  <div className="rounded-md bg-pink-100 p-2 dark:bg-pink-900/30">
                    <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate(getPath('/team'))}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer transition-all hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Administrators</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {platformAnalytics.activeSuperAdmins}
                    </p>
                    <p className="mt-1 text-xs text-green-600">Active</p>
                  </div>
                  <div className="rounded-md bg-indigo-100 p-2 dark:bg-indigo-900/30">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Platform Growth
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">New Organizations</span>
                    <span className="font-semibold text-gray-900 dark:text-white">+3 (7% growth)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">New Users</span>
                    <span className="font-semibold text-gray-900 dark:text-white">+125 (11% growth)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">New Job Postings</span>
                    <span className="font-semibold text-gray-900 dark:text-white">+18 (6% growth)</span>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Platform Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {platformAnalytics.totalOrganizations} active organizations
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {platformAnalytics.activeRecruiters} active recruiters this week
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {platformAnalytics.totalJobs} active job postings
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-pink-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {platformAnalytics.totalResumes.toLocaleString()} total subscribers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Analytics Section - Show for all recruiter roles */}
      {!isSuperAdmin && (
        <div className="mt-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hiring Analytics
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time to Hire</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.timeToHire} days
                  </p>
                  <p className="mt-1 text-xs text-green-600">-5% from last month</p>
                </div>
                <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Application to Hire</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.applicationToHire}%
                  </p>
                  <p className="mt-1 text-xs text-green-600">+2% from last month</p>
                </div>
                <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost per Hire</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    ${analytics.costPerHire.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-green-600">-10% from last month</p>
                </div>
                <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Offer Acceptance</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.offerAcceptance}%
                  </p>
                  <p className="mt-1 text-xs text-green-600">+5% from last month</p>
                </div>
                <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/30">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Hiring Funnel Conversion
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.pipeline).map(([stage, count]) => {
                  const total = Object.values(stats.pipeline).reduce((a, b) => a + b, 0);
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
                    3 new applications today
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    2 interviews scheduled this week
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    1 offer sent today
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Average response time: 2.5 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Hide job-related actions for super admin */}
      {!isSuperAdmin && (
        <div className="mt-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate(getPath('/jobs/new'))}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Post New Job</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create job posting</p>
              </div>
            </button>
            <button
              onClick={() => navigate(getPath('/candidates'))}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">View Candidates</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Screen applicants</p>
              </div>
            </button>
            <button
              onClick={() => navigate(getPath('/interviews/new'))}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Schedule Interview</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Book interview</p>
              </div>
            </button>
            <button
              onClick={() => navigate(getPath('/messages'))}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/30">
                <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Messages</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View conversations</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Super Admin Quick Actions */}
      {isSuperAdmin && (
        <div className="mt-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/dashboard/recruiter/analytics')}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">View Analytics</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">See all platform data</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/recruiter/team')}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Manage Teams</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View all teams</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/recruiter/organization')}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[var(--primary-color)] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
            >
              <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Organizations</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage organizations</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;

