import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Eye, Edit, Users, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!isSuperAdmin) {
        // For non-super admins, show their own organization settings
        // TODO: Fetch single organization for regular admins
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await adminAPI.getAllOrganizations();
        setOrganizations(data || []);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        // Provide more helpful error messages
        if (err.status === 404) {
          setError('API route not found. Please ensure the server is running and has been restarted to load the new admin routes.');
        } else if (err.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.status === 403) {
          setError('Access denied. Super admin access required.');
        } else {
          setError(err.message || 'Failed to load organizations. Please check the server logs.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [isSuperAdmin]);

  const getSizeLabel = (size) => {
    const sizeMap = {
      startup: 'Startup (1-10)',
      small: 'Small (11-50)',
      medium: 'Medium (51-200)',
      large: 'Large (201-1000)',
      enterprise: 'Enterprise (1000+)',
    };
    return sizeMap[size] || size;
  };

  const getSubscriptionStatusColor = (status) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const handleViewDetails = (orgId) => {
    // TODO: Navigate to organization details page or open modal
    console.log('View organization:', orgId);
  };

  const handleEdit = (orgId) => {
    // TODO: Navigate to edit organization page or open modal
    console.log('Edit organization:', orgId);
  };

  if (!isSuperAdmin) {
    // For non-super admins, show the original organization settings form
    // This would be the original implementation
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your organization profile and settings
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            Organization settings for non-super admins (to be implemented)
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organizations</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage all organizations and create new accounts for recruiters
          </p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error Loading Organizations</h3>
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organizations</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage all organizations and create new accounts for recruiters
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/admin/create-accounts')}
          className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
        >
          <Plus className="h-4 w-4" />
          Create Organization
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{organizations.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.reduce((sum, org) => sum + (org.memberCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(org => org.subscription?.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trial Organizations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {organizations.filter(org => org.subscription?.status === 'trial').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <tr key={org._id || org.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{org.name}</div>
                          {org.website && (
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {org.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {org.industry || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {getSizeLabel(org.size)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {org.memberCount || 0}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {org.subscription?.plan || '-'}
                        </span>
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSubscriptionStatusColor(
                            org.subscription?.status
                          )}`}
                        >
                          {org.subscription?.status || 'none'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {org.createdAt
                        ? new Date(org.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(org._id || org.id)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(org._id || org.id)}
                          className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Building2 className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          No organizations found
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get started by creating your first organization
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/dashboard/admin/create-accounts')}
                        className="mt-2 flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
                      >
                        <Plus className="h-4 w-4" />
                        Create Organization
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
