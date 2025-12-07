import AuditLog from '../models/AuditLog.js';
import ClientLog from '../models/ClientLog.js';
import SecurityLog from '../models/SecurityLog.js';
import LoginAttempt from '../models/LoginAttempt.js';
import SystemConfig from '../models/SystemConfig.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * Log Cleanup Service
 * Handles automatic and manual cleanup of old logs to manage database storage
 */

/**
 * Permanently delete soft-deleted logs older than the grace period
 * This frees up database space by removing logs that were soft-deleted
 */
export const cleanupSoftDeletedLogs = async () => {
  try {
    const config = await SystemConfig.getConfig();
    const retentionDays = config.logRetention?.softDeleteGracePeriod || 7; // Default 7 days grace period
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    cutoffDate.setHours(0, 0, 0, 0);

    // Permanently delete soft-deleted logs older than grace period
    const [auditDeleted, clientDeleted, securityDeleted, loginDeleted] = await Promise.all([
      AuditLog.deleteMany({
        status: 'deleted',
        updatedAt: { $lt: cutoffDate },
      }),
      ClientLog.deleteMany({
        status: 'deleted',
        updatedAt: { $lt: cutoffDate },
      }),
      SecurityLog.deleteMany({
        status: 'deleted',
        updatedAt: { $lt: cutoffDate },
      }),
      LoginAttempt.deleteMany({
        status: 'deleted',
        updatedAt: { $lt: cutoffDate },
      }),
    ]);

    const totalDeleted = auditDeleted.deletedCount + 
                        clientDeleted.deletedCount + 
                        securityDeleted.deletedCount + 
                        loginDeleted.deletedCount;

    if (totalDeleted > 0) {
      logInfo(`Log cleanup: Permanently deleted ${totalDeleted} soft-deleted logs`, {
        auditLogs: auditDeleted.deletedCount,
        clientLogs: clientDeleted.deletedCount,
        securityLogs: securityDeleted.deletedCount,
        loginAttempts: loginDeleted.deletedCount,
      });
    }

    return {
      success: true,
      deleted: {
        auditLogs: auditDeleted.deletedCount,
        clientLogs: clientDeleted.deletedCount,
        securityLogs: securityDeleted.deletedCount,
        loginAttempts: loginDeleted.deletedCount,
        total: totalDeleted,
      },
    };
  } catch (error) {
    logError('Failed to cleanup soft-deleted logs', error);
    throw error;
  }
};

/**
 * Permanently delete old active logs beyond retention period
 * This is more aggressive and should be used carefully
 */
export const cleanupOldActiveLogs = async (logType = 'all') => {
  try {
    const config = await SystemConfig.getConfig();
    
    // Get retention periods from config or use defaults
    const retentionDays = {
      auditLogs: config.logRetention?.auditLogsDays || 365,
      clientLogs: config.logRetention?.clientLogsDays || 30,
      securityLogs: config.logRetention?.securityLogsDays || 90,
      loginAttempts: config.logRetention?.loginAttemptsDays || 90,
    };

    const results = {};

    if (logType === 'all' || logType === 'audit') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays.auditLogs);
      cutoffDate.setHours(0, 0, 0, 0);

      const result = await AuditLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        status: 'active', // Only delete active logs, soft-deleted are handled separately
      });
      results.auditLogs = result.deletedCount;
    }

    if (logType === 'all' || logType === 'client') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays.clientLogs);
      cutoffDate.setHours(0, 0, 0, 0);

      const result = await ClientLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        status: 'active',
      });
      results.clientLogs = result.deletedCount;
    }

    if (logType === 'all' || logType === 'security') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays.securityLogs);
      cutoffDate.setHours(0, 0, 0, 0);

      const result = await SecurityLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        status: 'active',
      });
      results.securityLogs = result.deletedCount;
    }

    if (logType === 'all' || logType === 'login') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays.loginAttempts);
      cutoffDate.setHours(0, 0, 0, 0);

      const result = await LoginAttempt.deleteMany({
        timestamp: { $lt: cutoffDate },
        status: 'active',
      });
      results.loginAttempts = result.deletedCount;
    }

    const totalDeleted = Object.values(results).reduce((sum, count) => sum + count, 0);

    if (totalDeleted > 0) {
      logInfo(`Log cleanup: Permanently deleted ${totalDeleted} old active logs`, results);
    }

    return {
      success: true,
      deleted: {
        ...results,
        total: totalDeleted,
      },
    };
  } catch (error) {
    logError('Failed to cleanup old active logs', error);
    throw error;
  }
};

/**
 * Get log statistics for monitoring
 */
export const getLogStatistics = async () => {
  try {
    const [auditCount, clientCount, securityCount, loginCount] = await Promise.all([
      AuditLog.countDocuments(),
      ClientLog.countDocuments(),
      SecurityLog.countDocuments(),
      LoginAttempt.countDocuments(),
    ]);

    const [auditDeletedCount, clientDeletedCount, securityDeletedCount, loginDeletedCount] = await Promise.all([
      AuditLog.countDocuments({ status: 'deleted' }),
      ClientLog.countDocuments({ status: 'deleted' }),
      SecurityLog.countDocuments({ status: 'deleted' }),
      LoginAttempt.countDocuments({ status: 'deleted' }),
    ]);

    // Calculate approximate size (rough estimate: ~500 bytes per document)
    const estimatedSizeMB = ((auditCount + clientCount + securityCount + loginCount) * 500) / (1024 * 1024);

    return {
      totalLogs: auditCount + clientCount + securityCount + loginCount,
      totalDeleted: auditDeletedCount + clientDeletedCount + securityDeletedCount + loginDeletedCount,
      estimatedSizeMB: estimatedSizeMB.toFixed(2),
      byType: {
        auditLogs: {
          total: auditCount,
          deleted: auditDeletedCount,
          active: auditCount - auditDeletedCount,
        },
        clientLogs: {
          total: clientCount,
          deleted: clientDeletedCount,
          active: clientCount - clientDeletedCount,
        },
        securityLogs: {
          total: securityCount,
          deleted: securityDeletedCount,
          active: securityCount - securityDeletedCount,
        },
        loginAttempts: {
          total: loginCount,
          deleted: loginDeletedCount,
          active: loginCount - loginDeletedCount,
        },
      },
    };
  } catch (error) {
    logError('Failed to get log statistics', error);
    throw error;
  }
};
