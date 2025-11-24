import { useEffect, useState } from 'react';
import { 
  FileText, Search, Filter, Eye, Calendar, User, Building2, 
  Mail, Loader2, AlertCircle, CheckCircle, XCircle,
  Clock, Star, Tag, Check, X, MessageSquare
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { recruiterApplicationsAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { RECRUITER_PLANS } from '../../config/pricing';

const RecruiterApplications = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isSuperAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await recruiterApplicationsAPI.getAll(statusFilter !== 'all' ? statusFilter : undefined);
        setApplications(data || []);
      } catch (err) {
        console.error('Error fetching recruiter applications:', err);
        if (err.status === 404) {
          setError('API route not found. Please ensure the server is running.');
        } else if (err.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.status === 403) {
          setError('Access denied. Super admin access required.');
        } else {
          setError(err.message || 'Failed to load recruiter applications. Please check the server logs.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [isSuperAdmin, statusFilter]);

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: Clock,
      reviewing: Loader2,
      approved: CheckCircle,
      rejected: XCircle,
    };
    return iconMap[status] || FileText;
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      pending: 'Pending',
      reviewing: 'Reviewing',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return labelMap[status] || status;
  };

  const getPlanName = (plan) => {
    return RECRUITER_PLANS[plan]?.name || plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const getPlanPrice = (plan) => {
    return RECRUITER_PLANS[plan]?.price || 0;
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setIsUpdating(true);
      await recruiterApplicationsAPI.updateStatus(applicationId, newStatus, reviewNotes);
      // Refresh applications
      const data = await recruiterApplicationsAPI.getAll(statusFilter !== 'all' ? statusFilter : undefined);
      setApplications(data || []);
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setReviewNotes(application.reviewNotes || '');
  };

  // Calculate statistics
  const totalApplications = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const reviewingCount = applications.filter(a => a.status === 'reviewing').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  if (!isSuperAdmin) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Applications</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Applications</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View and manage recruiter account applications
          </p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error Loading Applications</h3>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Applications</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View and manage applications from users requesting recruiter accounts
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalApplications}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reviewing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reviewingCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => {
                  const StatusIcon = getStatusIcon(application.status);
                  return (
                    <tr key={application._id || application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {application.fullName}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              {application.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {application.company}
                            </span>
                            {application.position && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {application.position}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getPlanName(application.selectedPlan)}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ₱{getPlanPrice(application.selectedPlan).toLocaleString()}/month
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusLabel(application.status)}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {application.appliedAt
                          ? new Date(application.appliedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(application)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          No recruiter applications found
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Applications will appear here when users apply for recruiter accounts'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    setReviewNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.company}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.position}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selected Plan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {getPlanName(selectedApplication.selectedPlan)} - ₱{getPlanPrice(selectedApplication.selectedPlan).toLocaleString()}/month
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedApplication.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                      selectedApplication.status
                    )}`}
                  >
                    {getStatusLabel(selectedApplication.status)}
                  </span>
                </div>

                {selectedApplication.reviewedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reviewed By
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedApplication.reviewedBy?.fullName || 'N/A'}
                    </p>
                  </div>
                )}

                {selectedApplication.reviewedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reviewed At
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedApplication.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  />
                </div>

                {selectedApplication.status !== 'approved' && selectedApplication.status !== 'rejected' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication._id || selectedApplication.id, 'approved')}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication._id || selectedApplication.id, 'rejected')}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication._id || selectedApplication.id, 'reviewing')}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Loader2 className="h-4 w-4" />
                      Mark as Reviewing
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;

