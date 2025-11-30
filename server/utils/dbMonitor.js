import mongoose from 'mongoose';
import { logDatabaseQuery } from './logger.js';

// Track slow query threshold (in milliseconds)
const SLOW_QUERY_THRESHOLD = 1000; // 1 second

// Sensitive collections that should be monitored closely
const SENSITIVE_COLLECTIONS = [
  'users',
  'payments',
  'credittransactions',
  'organizations',
  'systemconfigs',
  'logina attempts',
];

/**
 * Sanitize query to remove sensitive data
 */
const sanitizeQuery = (query) => {
  if (!query || typeof query !== 'object') return 'sanitized';
  
  const sanitized = { ...query };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'creditCard', 'ssn'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  // Recursively sanitize nested objects
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeQuery(sanitized[key]);
    }
  });
  
  return sanitized;
};

/**
 * Monitor database queries
 */
export const setupDatabaseMonitoring = () => {
  // Monitor all queries
  mongoose.set('debug', (collectionName, method, query, doc) => {
    const startTime = Date.now();
    
    // Set up a listener for when the query completes
    const originalExec = mongoose.Query.prototype.exec;
    
    mongoose.Query.prototype.exec = function () {
      const queryTime = Date.now() - startTime;
      const isSlow = queryTime > SLOW_QUERY_THRESHOLD;
      const isSensitive = SENSITIVE_COLLECTIONS.includes(collectionName.toLowerCase());
      
      // Log slow queries, failed queries, or queries on sensitive collections
      if (isSlow || isSensitive) {
        const sanitizedQuery = sanitizeQuery(query);
        
        logDatabaseQuery(
          method,
          collectionName,
          {
            slow: isSlow,
            queryTime,
            sanitizedQuery,
            isSensitive,
          },
          null // No request context for direct DB queries
        ).catch(() => {
          // Silently fail - don't break queries
        });
      }
      
      return originalExec.apply(this, arguments);
    };
  });
};

/**
 * Log database operation with context
 */
export const logDBOperation = async (operation, collection, data = {}, req = null) => {
  const isSensitive = SENSITIVE_COLLECTIONS.includes(collection.toLowerCase());
  
  if (isSensitive || data.failed || data.slow) {
    await logDatabaseQuery(
      operation,
      collection,
      {
        ...data,
        isSensitive,
      },
      req
    );
  }
};

/**
 * Create a mongoose plugin to log operations on models
 */
export const createAuditPlugin = () => {
  return function (schema) {
    const collectionName = schema.collection.name;
    const isSensitive = SENSITIVE_COLLECTIONS.includes(collectionName.toLowerCase());
    
    if (!isSensitive) {
      return; // Only monitor sensitive collections
    }
    
    // Log create operations
    schema.post('save', async function (doc, next) {
      try {
        await logDBOperation('create', collectionName, {
          documentId: doc._id,
          operation: 'create',
        });
      } catch (error) {
        // Don't break the save operation
      }
      next();
    });
    
    // Log update operations
    schema.post('findOneAndUpdate', async function (doc, next) {
      try {
        if (doc) {
          await logDBOperation('update', collectionName, {
            documentId: doc._id,
            operation: 'update',
          });
        }
      } catch (error) {
        // Don't break the update operation
      }
      next();
    });
    
    // Log delete operations
    schema.post('findOneAndDelete', async function (doc, next) {
      try {
        if (doc) {
          await logDBOperation('delete', collectionName, {
            documentId: doc._id,
            operation: 'delete',
          });
        }
      } catch (error) {
        // Don't break the delete operation
      }
      next();
    });
  };
};

