import { useEffect, useState } from 'react';
import { 
  Monitor, 
  Search, 
  Filter, 
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ConfirmationModal from '../../utils/ConfirmationModal';

const ClientLogs = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    eventType: '',
    severity: '',
    route: '',
    startDate: '',
    endDate: '',
  });

  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin) {
      setIsLoading(false);
      return;
    }
    fetchLogs();
  }, [isSuperAdmin, pagination.page, sortBy, sortOrder]);

  const fetchLogs = async () => {
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

      const data = await adminAPI.getClientLogs(queryParams);
      setLogs(data.logs || []);
      setStatistics(data.statistics || null);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      }));
    } catch (err) {
      console.error('Error fetching client logs:', err);
      setError(err.message || 'Failed to load client logs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const handleClearFilters = async () => {
    const clearedFilters = {
      eventType: '',
      severity: '',
      route: '',
      startDate: '',
      endDate: '',
    };
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Fetch logs with cleared filters
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

      const data = await adminAPI.getClientLogs(queryParams);
      setLogs(data.logs || []);
      setStatistics(data.statistics || null);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
        page: 1,
      }));
    } catch (err) {
      console.error('Error fetching client logs:', err);
      setError(err.message || 'Failed to load client logs.');
    } finally {
      setIsLoading(false);
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleDeleteLog = (logId) => {
    setLogToDelete(logId);
    setShowDeleteModal(true);
  };

  const confirmDeleteLog = async () => {
    if (!logToDelete) return;

    try {
      await adminAPI.deleteClientLog(logToDelete);
      setLogToDelete(null);
      // Refresh logs after deletion
      fetchLogs();
    } catch (err) {
      console.error('Error deleting client log:', err);
      setError(err.message || 'Failed to delete log.');
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
      const response = await adminAPI.bulkDeleteClientLogs(null, customStartDate, customEndDate);
      // Refresh logs after deletion
      fetchLogs();
      setCustomStartDate('');
      setCustomEndDate('');
      setShowCustomDateModal(false);
    } catch (err) {
      console.error('Error bulk deleting client logs:', err);
      setError(err.message || 'Failed to bulk delete logs.');
    } finally {
      setIsLoading(false);
    }
  };


  if (!isSuperAdmin) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Logs</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Access denied. Super admin access required.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && logs.length === 0) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          Client Logs
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Monitor client-side events and user interactions
        </p>
      </div>

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {statistics.total || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Critical</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {statistics.critical || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {statistics.error || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
              {statistics.warning || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Unique Users</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {statistics.uniqueUserCount || 0}
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
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              placeholder="Search event type or route..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Severity</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
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
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bulk Delete Logs</h3>
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
            title="Delete logs in custom date range"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No client logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.eventType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        {getSeverityIcon(log.severity)}
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.route || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteLog(log._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete log"
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

        {pagination.pages > 1 && (
          <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
          title="Delete Client Log"
          message="Are you sure you want to delete this log? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          setShowConfirmationModal={setShowDeleteModal}
          onConfirm={confirmDeleteLog}
        />
      )}

      {/* Custom Date Range Delete Confirmation Modal */}
      {showCustomDateModal && (
        <ConfirmationModal
          title="Delete Client Logs by Custom Date Range"
          message={`Are you sure you want to delete all client logs from ${customStartDate} to ${customEndDate}? This action cannot be undone.`}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          setShowConfirmationModal={setShowCustomDateModal}
          onConfirm={confirmCustomDateDelete}
        />
      )}
    </div>
  );
};

export default ClientLogs;

