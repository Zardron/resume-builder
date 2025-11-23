import TeamMember from '../models/TeamMember.js';
import Organization from '../models/Organization.js';

/**
 * Middleware to check if user has required role in organization
 */
export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const organizationId = req.params.orgId || req.body.organizationId || req.query.organizationId;

      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: 'Organization ID is required',
        });
      }

      // Super admin bypass
      if (user.role === 'super_admin') {
        req.organizationId = organizationId;
        return next();
      }

      // Check if user belongs to organization
      if (user.organizationId?.toString() !== organizationId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Not a member of this organization',
        });
      }

      // Get team member record for role check
      const teamMember = await TeamMember.findOne({
        organizationId,
        userId: user._id,
        status: 'active',
      });

      if (!teamMember) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Not an active team member',
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(teamMember.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Requires one of these roles: ${allowedRoles.join(', ')}`,
        });
      }

      req.organizationId = organizationId;
      req.teamMember = teamMember;
      next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: error.message,
      });
    }
  };
};

/**
 * Middleware to check if user has specific permission
 */
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const organizationId = req.params.orgId || req.body.organizationId || req.query.organizationId;

      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: 'Organization ID is required',
        });
      }

      // Super admin bypass
      if (user.role === 'super_admin') {
        req.organizationId = organizationId;
        return next();
      }

      // Get team member record
      const teamMember = await TeamMember.findOne({
        organizationId,
        userId: user._id,
        status: 'active',
      });

      if (!teamMember) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Not an active team member',
        });
      }

      // Check permission
      if (!teamMember.permissions[permission]) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Requires permission: ${permission}`,
        });
      }

      req.organizationId = organizationId;
      req.teamMember = teamMember;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: error.message,
      });
    }
  };
};

/**
 * Middleware to ensure user belongs to organization (for data access)
 */
export const ensureOrganizationAccess = async (req, res, next) => {
  try {
    const user = req.user;
    const organizationId = req.params.orgId || req.body.organizationId || req.query.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID is required',
      });
    }

    // Super admin bypass
    if (user.role === 'super_admin') {
      req.organizationId = organizationId;
      return next();
    }

    // For applicants, they can only access their own data
    if (user.userType === 'applicant' && !user.organizationId) {
      // Applicants can access their own applications
      req.organizationId = organizationId;
      return next();
    }

    // For recruiters, check organization membership
    if (user.organizationId?.toString() !== organizationId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Not a member of this organization',
      });
    }

    req.organizationId = organizationId;
    next();
  } catch (error) {
    console.error('Organization access check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message,
    });
  }
};

/**
 * Middleware to check if user is applicant
 */
export const requireApplicant = (req, res, next) => {
  if (req.user.userType === 'applicant' || req.user.userType === 'both') {
    return next();
  }
  res.status(403).json({
    success: false,
    message: 'Access denied: Applicant access required',
  });
};

/**
 * Middleware to check if user is recruiter
 */
export const requireRecruiter = (req, res, next) => {
  if (req.user.userType === 'recruiter' || req.user.userType === 'both' || req.user.organizationId) {
    return next();
  }
  res.status(403).json({
    success: false,
    message: 'Access denied: Recruiter access required',
  });
};

