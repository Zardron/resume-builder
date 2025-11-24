import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const BrowseJobs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    employmentType: '',
    salaryRange: '',
  });

  useEffect(() => {
    // TODO: Fetch jobs from API
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setJobs([
            {
              id: 1,
              title: 'Senior Frontend Developer',
              company: 'Tech Corp',
              location: 'San Francisco, CA',
              employmentType: 'Full-time',
              salary: '$120k - $150k',
              postedDate: '2024-01-10',
              description: 'We are looking for an experienced frontend developer...',
            },
            {
              id: 2,
              title: 'Product Manager',
              company: 'StartupXYZ',
              location: 'Remote',
              employmentType: 'Full-time',
              salary: '$100k - $130k',
              postedDate: '2024-01-12',
              description: 'Join our team as a product manager...',
            },
            {
              id: 3,
              title: 'UX Designer',
              company: 'DesignCo',
              location: 'New York, NY',
              employmentType: 'Contract',
              salary: '$80k - $100k',
              postedDate: '2024-01-13',
              description: 'We need a creative UX designer...',
            },
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesType = !filters.employmentType || job.employmentType === filters.employmentType;
    return matchesSearch && matchesLocation && matchesType;
  });

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Find your next opportunity</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="san francisco">San Francisco</option>
              <option value="new york">New York</option>
            </select>
            <select
              value={filters.employmentType}
              onChange={(e) => setFilters(prev => ({ ...prev, employmentType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/dashboard/applicant/jobs/${job.id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.employmentType}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-4 line-clamp-2">{job.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/applicant/jobs/${job.id}`);
                  }}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;

