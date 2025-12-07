import cron from 'node-cron';
import { cleanupSoftDeletedLogs, cleanupOldActiveLogs } from '../services/logCleanupService.js';
import { logInfo, logError } from './logger.js';

/**
 * Scheduled Tasks Manager
 * Handles all cron jobs for maintenance and cleanup
 */

let tasksInitialized = false;

/**
 * Initialize all scheduled tasks
 */
export const initializeScheduledTasks = () => {
  if (tasksInitialized) {
    logInfo('Scheduled tasks already initialized');
    return;
  }

  try {
    // Cleanup soft-deleted logs daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      logInfo('Running scheduled task: Cleanup soft-deleted logs');
      try {
        const result = await cleanupSoftDeletedLogs();
        logInfo(`Soft-deleted logs cleanup completed: ${result.deleted.total} logs deleted`, result.deleted);
      } catch (error) {
        logError('Scheduled task failed: Cleanup soft-deleted logs', error);
      }
    }, {
      scheduled: true,
      timezone: 'UTC',
    });

    // Cleanup old active logs weekly on Sunday at 3 AM
    cron.schedule('0 3 * * 0', async () => {
      logInfo('Running scheduled task: Cleanup old active logs');
      try {
        const result = await cleanupOldActiveLogs('all');
        logInfo(`Old active logs cleanup completed: ${result.deleted.total} logs deleted`, result.deleted);
      } catch (error) {
        logError('Scheduled task failed: Cleanup old active logs', error);
      }
    }, {
      scheduled: true,
      timezone: 'UTC',
    });

    tasksInitialized = true;
    logInfo('Scheduled tasks initialized successfully');
  } catch (error) {
    logError('Failed to initialize scheduled tasks', error);
  }
};

/**
 * Stop all scheduled tasks
 */
export const stopScheduledTasks = () => {
  // Cron tasks don't need explicit stopping in node-cron,
  // but we can mark them as not initialized
  tasksInitialized = false;
  logInfo('Scheduled tasks stopped');
};
