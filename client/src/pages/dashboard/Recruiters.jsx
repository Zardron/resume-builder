import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, Eye, Edit, Users, Calendar, Mail, Building2, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const Recruiters = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [recruiters, setRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const fetchRecruiters = async () => {
      if (!isSuperAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await adminAPI.getAllRecruiters();
        setRecruiters(data || []);
      } catch (err) {
        console.error('Error fetching recruiters:', err);
        if (err.status === 404) {
          setError('API route not found. Please ensure the server is running and has been restarted to load the new admin routes.');
        } else if (err.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.status === 403) {
          setError('Access denied. Super admin access required.');
        } else {
          setError(err.message || 'Failed to load recruiters. Please check the server logs.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecruiters();
  }, [isSuperAdmin]);

  const getUserTypeLabel = (userType) => {
    const typeMap = {
      recruiter: 'Recruiter',
      applicant: 'Applicant',
      both: 'Both',
    };
    return typeMap[userType] || userType || '-';
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      user: 'User',
      admin: 'Admin',
      super_admin: 'Super Admin',
    };
    return roleMap[role] || role || '-';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const handleViewDetails = (recruiterId) => {
    // TODO: Navigate to recruiter details page or open modal
    console.log('View recruiter:', recruiterId);
  };

  const handleEdit = (recruiterId) => {
    // TODO: Navigate to edit recruiter page or open modal
    console.log('Edit recruiter:', recruiterId);
  };

  if (!isSuperAdmin) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Access denied. Super admin access required.
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage all recruiters and their accounts
          </p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error Loading Recruiters</h3>
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalRecruiters = recruiters.length;
  const activeRecruiters = recruiters.filter(r => r.teamMemberStatus === 'active' || r.isEmailVerified).length;
  const pendingRecruiters = recruiters.filter(r => r.teamMemberStatus === 'pending' || !r.isEmailVerified).length;
  const withOrganization = recruiters.filter(r => r.organizationId).length;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiters</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage all recruiters and their accounts
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/admin/create-accounts')}
          className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
        >
          <Plus className="h-4 w-4" />
          Create Recruiter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Recruiters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalRecruiters}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Recruiters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeRecruiters}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingRecruiters}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">With Organization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{withOrganization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiters Table */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Recruiter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Jobs Posted
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
              {recruiters.length > 0 ? (
                recruiters.map((recruiter) => (
                  <tr key={recruiter._id || recruiter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        {recruiter.profile?.avatar ? (
                          <img
                            src={recruiter.profile.avatar}
                            alt={recruiter.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{recruiter.fullName}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Mail className="h-3 w-3" />
                            {recruiter.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {recruiter.organizationId ? (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {recruiter.organizationId.name || 'N/A'}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {getRoleLabel(recruiter.role)}
                        </span>
                        {recruiter.teamMemberRole && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {recruiter.teamMemberRole}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                            recruiter.teamMemberStatus || (recruiter.isEmailVerified ? 'active' : 'pending')
                          )}`}
                        >
                          {recruiter.teamMemberStatus || (recruiter.isEmailVerified ? 'Active' : 'Pending')}
                        </span>
                        {!recruiter.isEmailVerified && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Email not verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {recruiter.jobCount || 0}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {recruiter.createdAt
                        ? new Date(recruiter.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(recruiter._id || recruiter.id)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(recruiter._id || recruiter.id)}
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
                      <User className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          No recruiters found
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get started by creating your first recruiter account
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/dashboard/admin/create-accounts')}
                        className="mt-2 flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
                      >
                        <Plus className="h-4 w-4" />
                        Create Recruiter
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

export default Recruiters;

