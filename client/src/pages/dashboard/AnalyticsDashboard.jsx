import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Briefcase, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import PlatformAnalytics from './PlatformAnalytics';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'super_admin';

  // If super admin, show platform analytics instead
  if (isSuperAdmin) {
    return <PlatformAnalytics />;
  }
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch analytics from API
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setAnalytics({
            timeToHire: 28,
            applicationToHire: 12.5,
            costPerHire: 3500,
            offerAcceptance: 85,
            pipeline: {
              applied: 145,
              screening: 45,
              interview: 18,
              offer: 5,
              hired: 3
            }
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  const metrics = [
    {
      label: 'Time to Hire',
      value: `${analytics?.timeToHire || 0} days`,
      icon: Clock,
      color: 'blue',
      change: '-5%'
    },
    {
      label: 'Application to Hire',
      value: `${analytics?.applicationToHire || 0}%`,
      icon: TrendingUp,
      color: 'green',
      change: '+2%'
    },
    {
      label: 'Cost per Hire',
      value: `$${analytics?.costPerHire?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'purple',
      change: '-10%'
    },
    {
      label: 'Offer Acceptance',
      value: `${analytics?.offerAcceptance || 0}%`,
      icon: CheckCircle,
      color: 'orange',
      change: '+5%'
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Track your hiring metrics and performance
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                  <p className={`mt-2 text-xs font-medium ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} from last month
                  </p>
                </div>
                <div className={`rounded-md bg-${metric.color}-100 p-3 dark:bg-${metric.color}-900/30`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Hiring Funnel
          </h2>
          <div className="space-y-4">
            {analytics?.pipeline && Object.entries(analytics.pipeline).map(([stage, count]) => {
              const total = Object.values(analytics.pipeline).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
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

        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

