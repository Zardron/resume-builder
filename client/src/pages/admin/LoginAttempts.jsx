import { useEffect, useState } from 'react';
import { 
  Shield, 
  Search, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Mail,
  Globe,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ConfirmationModal from '../../utils/ConfirmationModal';

const LoginAttempts = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [attempts, setAttempts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    email: '',
    ipAddress: '',
    success: '',
    failureReason: '',
    startDate: '',
    endDate: '',
  });

  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [attemptToDelete, setAttemptToDelete] = useState(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin) {
      setIsLoading(false);
      return;
    }

    fetchLoginAttempts();
  }, [isSuperAdmin, pagination.page, sortBy, sortOrder]);

  const fetchLoginAttempts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };

      const data = await adminAPI.getLoginAttempts(queryParams);
      setAttempts(data.attempts || []);
      setStatistics(data.statistics || null);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      }));
    } catch (err) {
      console.error('Error fetching login attempts:', err);
      if (err.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.status === 403) {
        setError('Access denied. Super admin access required.');
      } else {
        setError(err.message || 'Failed to load login attempts.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLoginAttempts();
  };

  const handleClearFilters = async () => {
    const clearedFilters = {
      email: '',
      ipAddress: '',
      success: '',
      failureReason: '',
      startDate: '',
      endDate: '',
    };
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Fetch attempts with cleared filters
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = {
        page: 1,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(clearedFilters).filter(([_, value]) => value !== '')
        ),
      };

      const data = await adminAPI.getLoginAttempts(queryParams);
      setAttempts(data.attempts || []);
      setStatistics(data.statistics || null);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        page: 1,
      }));
    } catch (err) {
      console.error('Error fetching login attempts:', err);
      if (err.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.status === 403) {
        setError('Access denied. Super admin access required.');
      } else {
        setError(err.message || 'Failed to load login attempts.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFailureReasonLabel = (reason) => {
    const labels = {
      invalid_email_format: 'Invalid Email Format',
      user_not_found: 'User Not Found',
      invalid_password: 'Invalid Password',
      email_not_verified: 'Email Not Verified',
      maintenance_mode: 'Maintenance Mode',
      login_disabled: 'Login Disabled',
      unknown: 'Unknown',
    };
    return labels[reason] || reason || '-';
  };

  const handleDeleteLog = (attemptId) => {
    setAttemptToDelete(attemptId);
    setShowDeleteModal(true);
  };

  const confirmDeleteLog = async () => {
    if (!attemptToDelete) return;

    try {
      await adminAPI.deleteLoginAttempt(attemptToDelete);
      setAttemptToDelete(null);
      // Refresh attempts after deletion
      fetchLoginAttempts();
    } catch (err) {
      console.error('Error deleting login attempt:', err);
      setError(err.message || 'Failed to delete login attempt.');
    }
  };


  const handleCustomDateDelete = () => {
    if (!customStartDate || !customEndDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(customStartDate) > new Date(customEndDate)) {
      setError('Start date must be before or equal to end date.');
      return;
    }
    setShowCustomDateModal(true);
  };

  const confirmCustomDateDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.bulkDeleteLoginAttempts(null, customStartDate, customEndDate);
      // Refresh attempts after deletion
      fetchLoginAttempts();
      setCustomStartDate('');
      setCustomEndDate('');
      setShowCustomDateModal(false);
    } catch (err) {
      console.error('Error bulk deleting login attempts:', err);
      setError(err.message || 'Failed to bulk delete login attempts.');
    } finally {
      setIsLoading(false);
    }
  };


  const exportToCSV = () => {
    const headers = ['Timestamp', 'Email', 'User', 'IP Address', 'Success', 'Failure Reason', 'User Agent'];
    const rows = attempts.map(attempt => [
      formatDate(attempt.timestamp),
      attempt.email,
      attempt.userId?.fullName || attempt.userId?.email || '-',
      attempt.ipAddress,
      attempt.success ? 'Yes' : 'No',
      getFailureReasonLabel(attempt.failureReason),
      attempt.userAgent || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login-attempts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isSuperAdmin) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Login Attempts</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Access denied. Super admin access required.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && attempts.length === 0) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Login Attempts
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monitor and analyze all login attempts to your platform
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {statistics.totalAttempts || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {statistics.successfulAttempts || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {statistics.failedAttempts || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Unique Emails</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {statistics.uniqueEmailCount || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Unique IPs</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {statistics.uniqueIPCount || 0}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={filters.email || filters.ipAddress || ''}
              onChange={(e) => {
                const value = e.target.value;
                // Try to detect if it's an email or IP
                if (value.includes('@')) {
                  handleFilterChange('email', value);
                  handleFilterChange('ipAddress', '');
                } else if (value.match(/^\d+\.\d+\.\d+\.\d+/) || value.includes('::')) {
                  handleFilterChange('ipAddress', value);
                  handleFilterChange('email', '');
                } else {
                  handleFilterChange('email', value);
                  handleFilterChange('ipAddress', value);
                }
              }}
              placeholder="Search email or IP..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <select
              value={filters.success}
              onChange={(e) => handleFilterChange('success', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Success</option>
              <option value="false">Failed</option>
            </select>
          </div>
          <div className="w-full sm:w-40">
            <select
              value={filters.failureReason}
              onChange={(e) => handleFilterChange('failureReason', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Reasons</option>
              <option value="invalid_email_format">Invalid Email Format</option>
              <option value="user_not_found">User Not Found</option>
              <option value="invalid_password">Invalid Password</option>
              <option value="email_not_verified">Email Not Verified</option>
              <option value="maintenance_mode">Maintenance Mode</option>
              <option value="login_disabled">Login Disabled</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="w-full sm:w-40">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              placeholder="Start Date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              placeholder="End Date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Bulk Delete Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bulk Delete Login Attempts</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            placeholder="Start Date"
          />
          <span className="text-gray-600 dark:text-gray-400">to</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            placeholder="End Date"
          />
          <button
            onClick={handleCustomDateDelete}
            disabled={!customStartDate || !customEndDate}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
            title="Delete login attempts in custom date range"
          >
            Delete Logs
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto max-w-full" style={{ maxWidth: '100%' }}>
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 whitespace-nowrap"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Timestamp</span>
                    {sortBy === 'timestamp' && (
                      <span className="flex-shrink-0">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 whitespace-nowrap"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>Email</span>
                    {sortBy === 'email' && (
                      <span className="flex-shrink-0">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  User
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 whitespace-nowrap"
                  onClick={() => handleSort('ipAddress')}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <span>IP Address</span>
                    {sortBy === 'ipAddress' && (
                      <span className="flex-shrink-0">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 whitespace-nowrap"
                  onClick={() => handleSort('success')}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span>Status</span>
                    {sortBy === 'success' && (
                      <span className="flex-shrink-0">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Failure Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  User Agent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No login attempts found
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr key={attempt._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(attempt.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {attempt.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {attempt.userId?.fullName || attempt.userId?.email || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                      {attempt.ipAddress}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {attempt.success ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="h-3 w-3" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {attempt.failureReason ? getFailureReasonLabel(attempt.failureReason) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={attempt.userAgent || '-'}>
                      {attempt.userAgent || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteLog(attempt._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete login attempt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Delete Login Attempt"
          message="Are you sure you want to delete this login attempt? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          setShowConfirmationModal={setShowDeleteModal}
          onConfirm={confirmDeleteLog}
        />
      )}

      {/* Custom Date Range Delete Confirmation Modal */}
      {showCustomDateModal && (
        <ConfirmationModal
          title="Delete Login Attempts by Custom Date Range"
          message={`Are you sure you want to delete all login attempts from ${customStartDate} to ${customEndDate}? This action cannot be undone.`}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          setShowConfirmationModal={setShowCustomDateModal}
          onConfirm={confirmCustomDateDelete}
        />
      )}
    </div>
  );
};

export default LoginAttempts;

