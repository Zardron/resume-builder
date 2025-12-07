import { useEffect, useState } from 'react';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  Save, 
  AlertCircle,
  Info,
  CheckCircle,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ConfirmationModal from '../../utils/ConfirmationModal';

const LogManagement = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [statistics, setStatistics] = useState(null);
  const [retentionConfig, setRetentionConfig] = useState({
    softDeleteGracePeriod: 7,
    auditLogsDays: 365,
    clientLogsDays: 30,
    securityLogsDays: 90,
    loginAttemptsDays: 90,
    enableAutoCleanup: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [cleanupType, setCleanupType] = useState(null);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin) {
      setIsLoading(false);
      return;
    }
    fetchData();
  }, [isSuperAdmin]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [statsData, configData] = await Promise.all([
        adminAPI.getLogStatistics(),
        adminAPI.getSystemConfig(),
      ]);

      setStatistics(statsData);
      
      if (configData.logRetention) {
        setRetentionConfig({
          softDeleteGracePeriod: configData.logRetention.softDeleteGracePeriod || 7,
          auditLogsDays: configData.logRetention.auditLogsDays || 365,
          clientLogsDays: configData.logRetention.clientLogsDays || 30,
          securityLogsDays: configData.logRetention.securityLogsDays || 90,
          loginAttemptsDays: configData.logRetention.loginAttemptsDays || 90,
          enableAutoCleanup: configData.logRetention.enableAutoCleanup !== false,
        });
      }
    } catch (err) {
      console.error('Error fetching log management data:', err);
      setError(err.message || 'Failed to load log management data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setRetentionConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      await adminAPI.updateSystemConfig({
        logRetention: retentionConfig,
      });

      setSuccess('Log retention settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving log retention settings:', err);
      setError(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCleanup = (type) => {
    setCleanupType(type);
    setShowCleanupModal(true);
  };

  const confirmCleanup = async () => {
    try {
      setIsCleaning(true);
      setError(null);
      setSuccess(null);

      let result;
      if (cleanupType === 'soft-deleted') {
        result = await adminAPI.cleanupSoftDeletedLogs();
      } else {
        result = await adminAPI.cleanupOldActiveLogs();
      }

      // Backend returns: { success: true, data: { total: X, auditLogs: Y, ... } }
      // API method returns: result which is { total: X, auditLogs: Y, ... }
      const deletedCount = result?.total || 0;
      setSuccess(`Successfully cleaned up ${deletedCount} logs!`);
      setShowCleanupModal(false);
      setCleanupType(null);
      
      // Refresh statistics
      await fetchData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error cleaning up logs:', err);
      setError(err.message || 'Failed to cleanup logs.');
    } finally {
      setIsCleaning(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Log Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Access denied. Super admin access required.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && !statistics) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          Log Management
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure log retention policies and manage database storage
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Log Statistics */}
      {statistics && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Log Statistics
            </h2>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Logs</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {statistics.totalLogs?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Soft-Deleted</div>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
                {statistics.totalDeleted?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Estimated Size</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {statistics.estimatedSizeMB || '0'} MB
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statistics.byType && Object.entries(statistics.byType).map(([type, data]) => (
              <div key={type} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{data.total?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{data.active?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Deleted:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{data.deleted?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retention Configuration */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Retention Configuration
          </h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Auto Cleanup Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Enable Automatic Cleanup
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Automatically clean up old logs based on retention periods
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={retentionConfig.enableAutoCleanup}
                onChange={(e) => handleConfigChange('enableAutoCleanup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Grace Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Soft-Delete Grace Period (days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={retentionConfig.softDeleteGracePeriod}
                onChange={(e) => handleConfigChange('softDeleteGracePeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Days before permanently deleting soft-deleted logs (1-30)
              </p>
            </div>
          </div>

          {/* Retention Periods */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Retention Periods (days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audit Logs
                </label>
                <input
                  type="number"
                  min="30"
                  max="3650"
                  value={retentionConfig.auditLogsDays}
                  onChange={(e) => handleConfigChange('auditLogsDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 365 days for compliance
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Logs
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={retentionConfig.clientLogsDays}
                  onChange={(e) => handleConfigChange('clientLogsDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 30 days (high volume)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Security Logs
                </label>
                <input
                  type="number"
                  min="30"
                  max="730"
                  value={retentionConfig.securityLogsDays}
                  onChange={(e) => handleConfigChange('securityLogsDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 90 days for security analysis
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Login Attempts
                </label>
                <input
                  type="number"
                  min="30"
                  max="730"
                  value={retentionConfig.loginAttemptsDays}
                  onChange={(e) => handleConfigChange('loginAttemptsDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: 90 days for security monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Cleanup */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-5 w-5 text-gray-900 dark:text-white" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manual Cleanup
          </h2>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-300">
            <p className="font-medium mb-1">Warning: Manual cleanup permanently deletes logs</p>
            <p>This action cannot be undone. Make sure you have backups if needed.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleCleanup('soft-deleted')}
            disabled={isCleaning}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            Cleanup Soft-Deleted Logs
          </button>
          <button
            onClick={() => handleCleanup('old-active')}
            disabled={isCleaning}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            Cleanup Old Active Logs
          </button>
        </div>
      </div>

      {/* Cleanup Confirmation Modal */}
      {showCleanupModal && (
        <ConfirmationModal
          title={cleanupType === 'soft-deleted' ? 'Cleanup Soft-Deleted Logs' : 'Cleanup Old Active Logs'}
          message={
            cleanupType === 'soft-deleted'
              ? 'Are you sure you want to permanently delete all soft-deleted logs? This action cannot be undone.'
              : 'Are you sure you want to permanently delete all old active logs beyond retention periods? This action cannot be undone.'
          }
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          setShowConfirmationModal={setShowCleanupModal}
          onConfirm={confirmCleanup}
        />
      )}
    </div>
  );
};

export default LogManagement;
