import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, User, Star, MessageSquare, Calendar, FileText } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const CandidatesPipeline = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || 'all');

  const stages = [
    { id: 'applied', label: 'Applied', color: 'blue' },
    { id: 'screening', label: 'Screening', color: 'yellow' },
    { id: 'interview', label: 'Interview', color: 'purple' },
    { id: 'offer', label: 'Offer', color: 'green' },
    { id: 'rejected', label: 'Rejected', color: 'red' }
  ];

  useEffect(() => {
    // TODO: Fetch candidates from API
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setCandidates([
            { id: 1, name: 'John Doe', job: 'Senior Developer', stage: 'screening', score: 92, appliedDate: '2024-01-10' },
            { id: 2, name: 'Jane Smith', job: 'Product Manager', stage: 'interview', score: 88, appliedDate: '2024-01-12' },
            { id: 3, name: 'Bob Johnson', job: 'Designer', stage: 'applied', score: 85, appliedDate: '2024-01-13' },
            { id: 4, name: 'Alice Williams', job: 'Frontend Developer', stage: 'offer', score: 95, appliedDate: '2024-01-08' }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const getStageColor = (stage) => {
    const stageData = stages.find(s => s.id === stage);
    return stageData?.color || 'gray';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.job.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = candidates.filter(c => c.stage === stage.id);
    return acc;
  }, {});

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidate Pipeline</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track candidates through your hiring process
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            <option value="all">All Stages</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="grid gap-4 lg:grid-cols-5">
        {stages.map((stage) => {
          const stageCandidates = candidatesByStage[stage.id] || [];
          const filtered = stageCandidates.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 c.job.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
          });

          return (
            <div key={stage.id} className="rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
              <div className={`border-b border-gray-200 bg-${stage.color}-50 p-4 dark:border-gray-700 dark:bg-${stage.color}-900/20`}>
                <h3 className="font-semibold text-gray-900 dark:text-white">{stage.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{filtered.length} candidates</p>
              </div>
              <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => navigate(`/dashboard/recruiter/candidates/${candidate.id}`)}
                      className="cursor-pointer rounded-md border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">{candidate.name}</h4>
                          </div>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{candidate.job}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              Match: {candidate.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/recruiter/candidates/${candidate.id}?tab=messages`);
                          }}
                          className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          <MessageSquare className="inline h-3 w-3 mr-1" />
                          Message
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/recruiter/interviews/new?candidateId=${candidate.id}`);
                          }}
                          className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          <Calendar className="inline h-3 w-3 mr-1" />
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">
                    No candidates
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidatesPipeline;

