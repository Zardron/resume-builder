import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Briefcase, FileText, Shield, DollarSign,
  TrendingUp, TrendingDown, Activity, AlertTriangle, Zap, Server,
  ArrowRight, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [platformStats, setPlatformStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        setIsLoading(true);
        const stats = await adminAPI.getPlatformStats(period);
        setPlatformStats(stats);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlatformStats();
  }, [period]);

  if (isLoading) {
    return (
      <div className="w-full">
        <LoadingSkeleton type="default" className="w-full h-64" />
      </div>
    );
  }

  if (!platformStats) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Failed to load platform statistics</p>
      </div>
    );
  }

  const { totals = {}, growth = {}, revenue = {}, dailyData = [], topOrganizations = [], recentActivity = {}, systemHealth = {} } = platformStats || {};

  const formatCurrency = (amount) => {
    if (!amount) return '₱0';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGrowthColor = (percentage) => {
    const num = parseFloat(percentage);
    if (num > 0) return 'text-green-600 dark:text-green-400';
    if (num < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getGrowthIcon = (percentage) => {
    const num = parseFloat(percentage);
    if (num > 0) return <TrendingUp className="h-4 w-4" />;
    if (num < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
      },
      cyan: {
        bg: 'bg-cyan-100 dark:bg-cyan-900/30',
        text: 'text-cyan-600 dark:text-cyan-400',
      },
      pink: {
        bg: 'bg-pink-100 dark:bg-pink-900/30',
        text: 'text-pink-600 dark:text-pink-400',
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
      },
    };
    return colors[color] || colors.blue;
  };

  const metricCards = [
    {
      label: 'Total Organizations',
      value: totals?.organizations || 0,
      growth: growth?.organizations,
      icon: Building2,
      color: 'blue',
      link: '/dashboard/admin/organization',
    },
    {
      label: 'Total Users',
      value: (totals?.users || 0).toLocaleString(),
      growth: growth?.users,
      icon: Users,
      color: 'green',
      link: '/dashboard/admin/analytics',
    },
    {
      label: 'Active Jobs',
      value: totals?.activeJobs || 0,
      growth: growth?.jobs,
      icon: Briefcase,
      color: 'purple',
      link: '/dashboard/admin/analytics',
    },
    {
      label: 'Active Recruiters',
      value: totals?.activeRecruiters || 0,
      growth: growth?.recruiters,
      icon: Users,
      color: 'cyan',
      link: '/dashboard/admin/team',
    },
    {
      label: 'Total Subscribers',
      value: (totals?.resumes || 0).toLocaleString(),
      growth: growth?.resumes,
      icon: FileText,
      color: 'pink',
      link: '/dashboard/admin/analytics?subscribers=true',
    },
    {
      label: 'System Admins',
      value: totals?.systemAdmins || 0,
      icon: Shield,
      color: 'indigo',
      link: '/dashboard/admin/team',
    },
  ];

  const revenueData = [
    { name: 'Subscriptions', value: revenue?.subscription || 0, color: '#3b82f6' },
    { name: 'Credits', value: revenue?.credits || 0, color: '#10b981' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Platform Dashboard
          </h1>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive overview of platform performance and system health
        </p>
      </div>

      {/* System Health Alert */}
      {systemHealth?.status === 'warning' && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">System Health Warning</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {systemHealth?.criticalSecurityLogs || 0} critical security logs and {systemHealth?.errorClientLogs || 0} error logs detected in the last {period} days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const growthValue = metric.growth?.percentage || '0';
          const growthNum = parseFloat(growthValue);
          
          return (
            <div
              key={metric.label}
              onClick={() => navigate(metric.link)}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                  {metric.growth && (
                    <div className={`mt-2 flex items-center gap-1 text-sm ${getGrowthColor(growthValue)}`}>
                      {getGrowthIcon(growthValue)}
                      <span>
                        {growthNum > 0 ? '+' : ''}{growthValue}% ({metric.growth.current} new)
                      </span>
                    </div>
                  )}
                </div>
                <div className={`rounded-lg p-3 ${getColorClasses(metric.color).bg}`}>
                  <Icon className={`h-6 w-6 ${getColorClasses(metric.color).text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue</h3>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(revenue?.total || 0)}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {revenue?.transactions || 0} transactions
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subscriptions</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(revenue?.subscription || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Credits</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(revenue?.credits || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={revenueData.filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.filter(d => d.value > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
            <Server className={`h-5 w-5 ${
              systemHealth.status === 'healthy' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-yellow-600 dark:text-yellow-400'
            }`} />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className={`text-sm font-semibold ${
                  systemHealth?.status === 'healthy'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {systemHealth?.status === 'healthy' ? 'Healthy' : 'Warning'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Failed Logins</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {systemHealth?.failedLogins || 0}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Critical Security Logs</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {systemHealth?.criticalSecurityLogs || 0}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Error Logs</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {systemHealth?.errorClientLogs || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs"
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
                labelFormatter={formatDate}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Platform Activity (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-xs"
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line type="monotone" dataKey="organizations" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="jobs" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Organizations and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Organizations</h3>
            <button
              onClick={() => navigate('/dashboard/admin/organization')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topOrganizations && topOrganizations.length > 0 ? (
              topOrganizations.map((org, index) => (
                <div
                  key={org._id || index}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{org.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{org.industry || 'N/A'}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{org.jobCount} jobs</span>
                      <span>{org.applicationCount} applications</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      org.subscription?.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {org.subscription?.plan || 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">No organizations found</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.users && recentActivity.users.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">New Users</h4>
                {recentActivity.users.slice(0, 3).map((user, index) => (
                  <div key={user._id || index} className="mb-2 flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">{user.fullName || user.email}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {recentActivity.organizations && recentActivity.organizations.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">New Organizations</h4>
                {recentActivity.organizations.slice(0, 3).map((org, index) => (
                  <div key={org._id || index} className="mb-2 flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">{org.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {recentActivity.securityLogs && recentActivity.securityLogs.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Security Events</h4>
                {recentActivity.securityLogs.slice(0, 3).map((log, index) => (
                  <div key={log._id || index} className="mb-2 flex items-center gap-2 text-sm">
                    <AlertTriangle className={`h-4 w-4 ${
                      log.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <span className="text-gray-600 dark:text-gray-400">{log.eventType}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

