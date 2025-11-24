import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Pause, Play, Briefcase } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const JobsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    // TODO: Fetch jobs from API
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setJobs([
            { id: 1, title: 'Senior Frontend Developer', status: 'active', applications: 45, views: 234, postedDate: '2024-01-10' },
            { id: 2, title: 'Product Manager', status: 'active', applications: 32, views: 189, postedDate: '2024-01-12' },
            { id: 3, title: 'UX Designer', status: 'draft', applications: 0, views: 0, postedDate: '2024-01-13' },
            { id: 4, title: 'Backend Engineer', status: 'paused', applications: 12, views: 67, postedDate: '2024-01-08' }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      closed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.draft;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Postings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your job postings and track applications
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/recruiter/jobs/new')}
          className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
        >
          <Plus className="h-4 w-4" />
          Post New Job
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-md border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{job.applications} applications</span>
                    <span>{job.views} views</span>
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/recruiter/jobs/${job.id}`)}
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/recruiter/jobs/${job.id}/edit`)}
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    title="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No jobs found
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Get started by posting your first job'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/dashboard/recruiter/jobs/new')}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--secondary-color)]"
              >
                <Plus className="h-4 w-4" />
                Post New Job
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;

