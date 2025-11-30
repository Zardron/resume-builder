import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Building2, Briefcase, UserCheck, Search, Filter, Download, Eye, Sparkles, Shield, User, Circle, XCircle } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ConfirmationModal from '../../utils/ConfirmationModal';
import { adminAPI } from '../../services/api';
import { useAppSelector } from '../../store/hooks';
import { onUserStatusUpdate } from '../../services/socketService';

const PlatformAnalytics = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    organizations: [],
    users: [],
    recruiters: [],
    jobs: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showSubscribersOnly, setShowSubscribersOnly] = useState(false);
  const [showBanConfirmation, setShowBanConfirmation] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [banningUserId, setBanningUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch users from API
        const users = await adminAPI.getAllUsers();
        
        // Ensure users is an array
        const usersArray = Array.isArray(users) ? users : [];
        
        setData({
          organizations: [],
          users: usersArray,
          recruiters: [],
          jobs: []
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching platform data:', error);
        setError(error.message || 'Failed to load users. Please try again.');
        setIsLoading(false);
        // Set empty data on error
        setData({
          organizations: [],
          users: [],
          recruiters: [],
          jobs: []
        });
      }
    };

    fetchData();
  }, []);

  // Check for subscriber filter in URL params
  useEffect(() => {
    const showSubscribers = searchParams.get('subscribers');
    if (showSubscribers === 'true' && !showSubscribersOnly) {
      setShowSubscribersOnly(true);
      setActiveTab('users');
      setSearchQuery('');
      // Remove the query param from URL after applying
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('subscribers');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showSubscribersOnly]);

  // Listen for real-time user status updates
  useEffect(() => {
    if (activeTab !== 'users') {
      return;
    }

    const unsubscribe = onUserStatusUpdate((statusUpdate) => {
      // Update user status in real-time
      setData(prevData => ({
        ...prevData,
        users: prevData.users.map(user => {
          // Handle both string and ObjectId comparison
          const userId = typeof user.id === 'object' ? user.id.toString() : String(user.id);
          const updateUserId = String(statusUpdate.userId);
          
          return userId === updateUserId
            ? { ...user, status: statusUpdate.status }
            : user;
        }),
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [activeTab]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'recruiters', label: 'Recruiters', icon: UserCheck },
    { id: 'jobs', label: 'All Jobs', icon: Briefcase }
  ];

  const getFilteredData = () => {
    let items = [];
    switch (activeTab) {
      case 'organizations':
        items = data.organizations;
        break;
      case 'users':
        items = data.users;
        break;
      case 'recruiters':
        items = data.recruiters;
        break;
      case 'jobs':
        items = data.jobs;
        break;
      default:
        return [];
    }

    let filtered = items;
    
    // Filter for subscribers if enabled
    if (activeTab === 'users' && showSubscribersOnly) {
      filtered = filtered.filter(item => item.hasAISubscription === true);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (activeTab === 'organizations') {
          return item.name.toLowerCase().includes(query) || item.industry.toLowerCase().includes(query);
        } else if (activeTab === 'users') {
          return item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query);
        } else if (activeTab === 'recruiters') {
          return item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query);
        } else if (activeTab === 'jobs') {
          return item.title.toLowerCase().includes(query) || item.organization.toLowerCase().includes(query);
        }
        return true;
      });
    }

    if (filter !== 'all' && activeTab === 'jobs') {
      filtered = filtered.filter(item => item.status === filter);
    }

    return filtered;
  };

  // Calculate total subscribers
  const totalSubscribers = Array.isArray(data.users) 
    ? data.users.filter(user => user && user.hasAISubscription === true).length 
    : 0;

  // Handle clicking on Total Subscriber card
  const handleSubscriberClick = useCallback(() => {
    // Update all states together - React will batch these
    setSearchQuery('');
    setShowSubscribersOnly(true);
    setActiveTab('users');
  }, []);

  // Handle ban toggle
  const handleBanToggle = async (user, currentBanStatus) => {
    if (!user || !user.id) {
      console.error('Invalid user data');
      return;
    }

    // Check if user is trying to ban themselves
    const isCurrentUser = currentUser && (currentUser.id === user.id || currentUser.email === user.email);
    if (isCurrentUser && !currentBanStatus) {
      alert('You cannot ban your own account');
      return;
    }

    // If trying to ban (toggle from false to true), show confirmation
    if (!currentBanStatus) {
      setUserToBan(user);
      setShowBanConfirmation(true);
    } else {
      // If unbanning (toggle from true to false), do it directly
      await toggleBanStatus(user.id, false);
    }
  };

  // Confirm ban action
  const confirmBan = async () => {
    if (userToBan) {
      await toggleBanStatus(userToBan.id, true);
      setShowBanConfirmation(false);
      setUserToBan(null);
    }
  };

  // Toggle ban status
  const toggleBanStatus = async (userId, isBanned) => {
    if (!userId) {
      console.error('Invalid user ID');
      return;
    }

    try {
      setBanningUserId(userId);
      await adminAPI.toggleUserBan(userId, isBanned);
      
      // Update local state
      setData(prevData => ({
        ...prevData,
        users: (prevData.users || []).map(user => 
          user && user.id === userId ? { ...user, isBanned } : user
        )
      }));
    } catch (error) {
      console.error('Error toggling ban status:', error);
      const errorMessage = error.response?.message || error.message || 'Failed to update user ban status. Please try again.';
      alert(errorMessage);
    } finally {
      setBanningUserId(null);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View and manage all platform data
            </p>
          </div>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View and manage all platform data
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Clear subscriber filter when switching tabs (except when going to users from subscriber click)
                  if (tab.id !== 'users') {
                    setShowSubscribersOnly(false);
                  }
                }}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>
        {activeTab === 'users' && showSubscribersOnly && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSubscribersOnly(false);
                setSearchQuery('');
              }}
              className="flex items-center gap-2 rounded-md border border-pink-300 bg-pink-50 px-3 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100 dark:border-pink-600 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/50"
            >
              <XCircle className="h-4 w-4" />
              Clear Subscriber Filter
            </button>
          </div>
        )}
        {activeTab === 'jobs' && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Organizations</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.organizations.length}</p>
              </div>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900/30">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.users.length}</p>
              </div>
              <div className="rounded-md bg-green-100 p-3 dark:bg-green-900/30">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSearchQuery('');
              setShowSubscribersOnly(true);
              setActiveTab('users');
            }}
            className="w-full rounded-md border border-gray-200 bg-white p-6 shadow-sm text-left dark:border-gray-700 dark:bg-gray-800 cursor-pointer transition-all hover:border-pink-300 hover:shadow-md dark:hover:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscriber</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalSubscribers}</p>
              </div>
              <div className="rounded-md bg-pink-100 p-3 dark:bg-pink-900/30">
                <Sparkles className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </button>
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Recruiters</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.recruiters.length}</p>
              </div>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900/30">
                <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.jobs.length}</p>
              </div>
              <div className="rounded-md bg-orange-100 p-3 dark:bg-orange-900/30">
                <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                <tr>
                  {activeTab === 'organizations' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Industry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Users</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Jobs</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                    </>
                  )}
                  {activeTab === 'users' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Ban</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                    </>
                  )}
                  {activeTab === 'recruiters' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Jobs Posted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Candidates</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                    </>
                  )}
                  {activeTab === 'jobs' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posted</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {getFilteredData().length > 0 ? (
                  getFilteredData().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      {activeTab === 'organizations' && (
                        <>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.industry}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{item.size}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.users}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.jobs}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="text-[var(--primary-color)] hover:text-[var(--secondary-color)]">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === 'users' && (
                        <>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900 dark:text-white">{item?.name || 'N/A'}</div>
                              {item?.hasAISubscription && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300" title="AI Subscribed">
                                  <Sparkles className="h-3 w-3" />
                                  AI
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item?.email || 'N/A'}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                              {item?.role === 'admin' && <Shield className="h-3 w-3" />}
                              {item?.role === 'manager' && <UserCheck className="h-3 w-3" />}
                              {item?.role === 'recruiter' && <Briefcase className="h-3 w-3" />}
                              {item?.role === 'applicant' && <User className="h-3 w-3" />}
                              {item?.role || 'N/A'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item?.organization || 'N/A'}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                              item?.status === 'online' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              <Circle className={`h-3 w-3 fill-current ${
                                item?.status === 'online' 
                                  ? 'text-green-600 dark:text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.6)]' 
                                  : 'text-red-600 dark:text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]'
                              }`} />
                              {item?.status || 'offline'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {item?.joinedAt ? new Date(item.joinedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {(() => {
                              if (!item || !item.id) return null;
                              const isCurrentUser = currentUser && (currentUser.id === item.id || currentUser.email === item.email);
                              const isDisabled = banningUserId === item.id || (isCurrentUser && !item.isBanned);
                              return (
                                <label className={`relative inline-flex items-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                  <input
                                    type="checkbox"
                                    checked={item.isBanned || false}
                                    onChange={() => handleBanToggle(item, item.isBanned || false)}
                                    disabled={isDisabled}
                                    className="sr-only peer"
                                    title={isCurrentUser && !item.isBanned ? 'You cannot ban your own account' : ''}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                                </label>
                              );
                            })()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="text-[var(--primary-color)] hover:text-[var(--secondary-color)]">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === 'recruiters' && (
                        <>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.email}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.organization}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                              {item.role === 'admin' && <Shield className="h-3 w-3" />}
                              {item.role === 'manager' && <UserCheck className="h-3 w-3" />}
                              {item.role === 'recruiter' && <Briefcase className="h-3 w-3" />}
                              {item.role === 'applicant' && <User className="h-3 w-3" />}
                              {item.role}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.jobsPosted}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.candidatesManaged}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="text-[var(--primary-color)] hover:text-[var(--secondary-color)]">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === 'jobs' && (
                        <>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.organization}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              item.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.applications}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(item.postedAt).toLocaleDateString()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="text-[var(--primary-color)] hover:text-[var(--secondary-color)]">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={activeTab === 'users' ? 8 : activeTab === 'organizations' ? 7 : activeTab === 'recruiters' ? 7 : 6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      No {activeTab} found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ban Confirmation Modal */}
      {showBanConfirmation && userToBan && (
        <ConfirmationModal
          title="Ban User"
          message={`Are you sure you want to ban ${userToBan.name} (${userToBan.email})? This will prevent them from accessing the platform.`}
          confirmButtonText="Ban User"
          cancelButtonText="Cancel"
          setShowConfirmationModal={setShowBanConfirmation}
          onConfirm={confirmBan}
        />
      )}
    </div>
  );
};

export default PlatformAnalytics;

