import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Building2,
  CreditCard,
  UserPlus,
  BarChart3,
  FileText,
  Sparkles,
  User,
  FolderKanban,
  CheckSquare,
  Shield,
  Monitor,
} from 'lucide-react';

// SideNavData - Centralized navigation data based on RolePermissions.md
export const getBasePath = (userRole) => {
  if (userRole === 'super_admin') {
    return '/dashboard/admin';
  }
  if (['admin', 'manager', 'recruiter'].includes(userRole)) {
    return '/dashboard/recruiter';
  }
  return '/dashboard';
};

// Helper function to get path with correct base
export const getPath = (relativePath, basePath) => {
  if (relativePath.startsWith('/dashboard/')) {
    if (relativePath.startsWith('/dashboard/recruiter')) {
      return relativePath.replace('/dashboard/recruiter', basePath);
    }
    if (relativePath.startsWith('/dashboard/admin')) {
      return relativePath.replace('/dashboard/admin', basePath);
    }
    return relativePath;
  }
  return `${basePath}${relativePath}`;
};

// Navigation items for Super Admin - platform-wide access
const superAdminNavItems = [
  {
    label: 'Dashboard',
    path: '/dashboard/admin',
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Platform Analytics',
    path: '/dashboard/admin/analytics',
    icon: BarChart3,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Team Management',
    path: '/dashboard/admin/team',
    icon: UserPlus,
    allowedRoles: ['super_admin'],
    submenu: [
      { label: 'All Teams', path: '/dashboard/admin/team' },
      { label: 'Manage Organizations', path: '/dashboard/admin/team?view=organizations' },
    ],
  },
  {
    label: 'Organization Management',
    path: '/dashboard/admin/organization',
    icon: Building2,
    allowedRoles: ['super_admin'],
    submenu: [
      { label: 'All Organizations', path: '/dashboard/admin/organization' },
      { label: 'Create Organization', path: '/dashboard/admin/create-team-organization-account' },
    ],
  },
  {
    label: 'User Management',
    path: '/dashboard/admin/recruiters',
    icon: Users,
    allowedRoles: ['super_admin'],
    submenu: [
      { label: 'All Users', path: '/dashboard/admin/recruiters' },
      { label: 'Create Accounts', path: '/dashboard/admin/create-recruiter-account' },
    ],
  },
  {
    label: 'Recruiter Applications',
    path: '/dashboard/admin/recruiter-applications',
    icon: FileText,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Login Attempts',
    path: '/dashboard/admin/login-attempts',
    icon: Shield,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Security Logs',
    path: '/dashboard/admin/security-logs',
    icon: Shield,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Audit Logs',
    path: '/dashboard/admin/audit-logs',
    icon: FileText,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'Client Logs',
    path: '/dashboard/admin/client-logs',
    icon: Monitor,
    allowedRoles: ['super_admin'],
  },
  {
    label: 'System Configuration',
    path: '/dashboard/admin/settings',
    icon: Settings,
    allowedRoles: ['super_admin'],
  },
];

// Navigation items for Organization Admin - company/team owner
const organizationAdminNavItems = [
  {
    label: 'Dashboard',
    path: '/dashboard/recruiter',
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ['admin'],
  },
  {
    label: 'Job Postings',
    path: '/dashboard/recruiter/jobs',
    icon: Briefcase,
    allowedRoles: ['admin'],
    submenu: [
      { label: 'All Jobs', path: '/dashboard/recruiter/jobs' },
      { label: 'Create Job', path: '/dashboard/recruiter/jobs/new' },
      { label: 'Drafts', path: '/dashboard/recruiter/jobs?status=draft' },
    ],
  },
  {
    label: 'Candidates',
    path: '/dashboard/recruiter/candidates',
    icon: Users,
    allowedRoles: ['admin'],
    submenu: [
      { label: 'Pipeline', path: '/dashboard/recruiter/candidates' },
      { label: 'All Candidates', path: '/dashboard/recruiter/candidates?view=all' },
      { label: 'Favorites', path: '/dashboard/recruiter/candidates?view=favorites' },
    ],
  },
  {
    label: 'Interviews',
    path: '/dashboard/recruiter/interviews',
    icon: Calendar,
    allowedRoles: ['admin'],
    submenu: [
      { label: 'Calendar', path: '/dashboard/recruiter/interviews' },
      { label: 'Schedule', path: '/dashboard/recruiter/interviews/new' },
      { label: 'Upcoming', path: '/dashboard/recruiter/interviews?status=upcoming' },
    ],
  },
  {
    label: 'Messages',
    path: '/dashboard/recruiter/messages',
    icon: MessageSquare,
    badge: 0,
    allowedRoles: ['admin'],
  },
  {
    label: 'Analytics',
    path: '/dashboard/recruiter/analytics',
    icon: BarChart3,
    allowedRoles: ['admin'],
  },
  {
    label: 'Team Management',
    path: '/dashboard/recruiter/team',
    icon: UserPlus,
    allowedRoles: ['admin'],
    submenu: [
      { label: 'All Members', path: '/dashboard/recruiter/team' },
      { label: 'Invite Members', path: '/dashboard/recruiter/team?action=invite' },
    ],
  },
  {
    label: 'Organization Settings',
    path: '/dashboard/recruiter/organization',
    icon: Building2,
    allowedRoles: ['admin'],
    submenu: [
      { label: 'Profile', path: '/dashboard/recruiter/organization' },
      { label: 'Branding', path: '/dashboard/recruiter/organization?tab=branding' },
    ],
  },
  {
    label: 'Billing',
    path: '/dashboard/recruiter/billing',
    icon: CreditCard,
    allowedRoles: ['admin'],
  },
];

// Navigation items for Recruiter Manager - team leadership role
const recruiterManagerNavItems = [
  {
    label: 'Dashboard',
    path: '/dashboard/recruiter',
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ['manager'],
  },
  {
    label: 'Job Postings',
    path: '/dashboard/recruiter/jobs',
    icon: Briefcase,
    allowedRoles: ['manager'],
    submenu: [
      { label: 'All Jobs', path: '/dashboard/recruiter/jobs' },
      { label: 'Create Job', path: '/dashboard/recruiter/jobs/new' },
      { label: 'Pending Approval', path: '/dashboard/recruiter/jobs?status=pending' },
    ],
  },
  {
    label: 'Candidates',
    path: '/dashboard/recruiter/candidates',
    icon: Users,
    allowedRoles: ['manager'],
    submenu: [
      { label: 'Team Pipeline', path: '/dashboard/recruiter/candidates' },
      { label: 'All Candidates', path: '/dashboard/recruiter/candidates?view=all' },
    ],
  },
  {
    label: 'Interviews',
    path: '/dashboard/recruiter/interviews',
    icon: Calendar,
    allowedRoles: ['manager'],
    submenu: [
      { label: 'Calendar', path: '/dashboard/recruiter/interviews' },
      { label: 'Schedule', path: '/dashboard/recruiter/interviews/new' },
    ],
  },
  {
    label: 'Messages',
    path: '/dashboard/recruiter/messages',
    icon: MessageSquare,
    badge: 0,
    allowedRoles: ['manager'],
  },
  {
    label: 'Analytics',
    path: '/dashboard/recruiter/analytics',
    icon: BarChart3,
    allowedRoles: ['manager'],
    submenu: [
      { label: 'Team Reports', path: '/dashboard/recruiter/analytics' },
      { label: 'Performance', path: '/dashboard/recruiter/analytics?view=performance' },
    ],
  },
  {
    label: 'Team Management',
    path: '/dashboard/recruiter/team',
    icon: UserPlus,
    allowedRoles: ['manager'],
    submenu: [
      { label: 'My Team', path: '/dashboard/recruiter/team' },
      { label: 'Manage Recruiters', path: '/dashboard/recruiter/team?view=recruiters' },
    ],
  },
];

// Navigation items for Recruiter - primary hiring role
const recruiterNavItems = [
  {
    label: 'Dashboard',
    path: '/dashboard/recruiter',
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ['recruiter'],
  },
  {
    label: 'Job Postings',
    path: '/dashboard/recruiter/jobs',
    icon: Briefcase,
    allowedRoles: ['recruiter'],
    submenu: [
      { label: 'My Jobs', path: '/dashboard/recruiter/jobs' },
      { label: 'Create Job', path: '/dashboard/recruiter/jobs/new' },
    ],
  },
  {
    label: 'Candidates',
    path: '/dashboard/recruiter/candidates',
    icon: Users,
    allowedRoles: ['recruiter'],
    submenu: [
      { label: 'Assigned Candidates', path: '/dashboard/recruiter/candidates' },
    ],
  },
  {
    label: 'Interviews',
    path: '/dashboard/recruiter/interviews',
    icon: Calendar,
    allowedRoles: ['recruiter'],
    submenu: [
      { label: 'My Schedule', path: '/dashboard/recruiter/interviews' },
      { label: 'Schedule Interview', path: '/dashboard/recruiter/interviews/new' },
    ],
  },
  {
    label: 'Messages',
    path: '/dashboard/recruiter/messages',
    icon: MessageSquare,
    badge: 0,
    allowedRoles: ['recruiter'],
  },
  {
    label: 'Analytics',
    path: '/dashboard/recruiter/analytics',
    icon: BarChart3,
    allowedRoles: ['recruiter'],
    submenu: [
      { label: 'My Activity', path: '/dashboard/recruiter/analytics' },
    ],
  },
];

// Navigation items for Applicant - job seeker role
const applicantNavItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ['applicant'],
  },
  {
    label: 'Resume Builder',
    path: '/dashboard/builder',
    icon: FileText,
    allowedRoles: ['applicant'],
    submenu: [
      { label: 'Resume Builder', path: '/dashboard/builder' },
      { label: 'Create Resume', path: '/dashboard/builder?action=create' },
    ],
  },
  {
    label: 'Browse Jobs',
    path: '/dashboard/applicant/jobs',
    icon: Briefcase,
    allowedRoles: ['applicant'],
  },
  {
    label: 'My Applications',
    path: '/dashboard/applicant/applications',
    icon: CheckSquare,
    allowedRoles: ['applicant'],
    submenu: [
      { label: 'All Applications', path: '/dashboard/applicant/applications' },
      { label: 'Status', path: '/dashboard/applicant/applications?view=status' },
    ],
  },
  {
    label: 'Interviews',
    path: '/dashboard/applicant/interviews',
    icon: Calendar,
    allowedRoles: ['applicant'],
    submenu: [
      { label: 'My Interviews', path: '/dashboard/applicant/interviews' },
      { label: 'Upcoming', path: '/dashboard/applicant/interviews?status=upcoming' },
    ],
  },
  {
    label: 'Messages',
    path: '/dashboard/applicant/messages',
    icon: MessageSquare,
    badge: 0,
    allowedRoles: ['applicant'],
  },
  {
    label: 'Credits & Subscription',
    path: '/dashboard/purchase',
    icon: Sparkles,
    allowedRoles: ['applicant'],
    submenu: [
      { label: 'Buy Credits', path: '/dashboard/purchase' },
      { label: 'Subscription', path: '/dashboard/subscription' },
    ],
  },
];


// Get navigation items for a specific role
export const getNavItemsForRole = (userRole) => {
  const basePath = getBasePath(userRole);
  
  let roleNavItems = [];
  
  switch (userRole) {
    case 'super_admin':
      roleNavItems = superAdminNavItems;
      break;
    case 'admin':
      roleNavItems = organizationAdminNavItems;
      break;
    case 'manager':
      roleNavItems = recruiterManagerNavItems;
      break;
    case 'recruiter':
      roleNavItems = recruiterNavItems;
      break;
    case 'applicant':
      roleNavItems = applicantNavItems;
      break;
    default:
      roleNavItems = applicantNavItems; // Default to applicant
  }
  
  // Process items to update paths with correct base path
  const processedItems = roleNavItems.map(item => {
    const processedItem = {
      ...item,
      path: getPath(item.path, basePath),
    };
    
    // Process submenu items if they exist
    if (item.submenu) {
      processedItem.submenu = item.submenu.map(subItem => ({
        ...subItem,
        path: getPath(subItem.path, basePath),
      }));
    }
    
    return processedItem;
  });
  
  return processedItems;
};

// Filter navigation items based on user role
export const filterNavItemsByRole = (items, userRole) => {
  return items.filter(item => {
    if (item.allowedRoles) {
      return item.allowedRoles.includes(userRole);
    }
    // If no allowedRoles specified, allow for all roles
    return true;
  });
};

// Get all navigation items (for reference/debugging)
export const getAllNavItems = () => {
  return {
    superAdmin: superAdminNavItems,
    organizationAdmin: organizationAdminNavItems,
    recruiterManager: recruiterManagerNavItems,
    recruiter: recruiterNavItems,
    applicant: applicantNavItems,
  };
};

export default {
  getNavItemsForRole,
  filterNavItemsByRole,
  getBasePath,
  getPath,
  getAllNavItems,
};

