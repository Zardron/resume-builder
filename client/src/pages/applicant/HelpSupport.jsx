import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Send, AlertCircle, CheckCircle, Clock, X, FileText, Bug, CreditCard, Settings, Lightbulb, MessageSquare } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { supportAPI } from '../../services/api';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addNotification } from '../../store/slices/notificationsSlice';

const HelpSupport = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // all, open, in_progress, resolved, closed

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general_inquiry',
    priority: 'medium',
    description: '',
  });

  const categoryOptions = [
    { value: 'technical_issue', label: 'Technical Issue', icon: Settings },
    { value: 'account_issue', label: 'Account Issue', icon: FileText },
    { value: 'billing_issue', label: 'Billing Issue', icon: CreditCard },
    { value: 'feature_request', label: 'Feature Request', icon: Lightbulb },
    { value: 'bug_report', label: 'Bug Report', icon: Bug },
    { value: 'general_inquiry', label: 'General Inquiry', icon: MessageSquare },
    { value: 'other', label: 'Other', icon: HelpCircle },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
  ];

  const statusConfig = {
    open: { label: 'Open', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: AlertCircle },
    resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
    closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: X },
  };

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const params = filter !== 'all' ? { status: filter } : {};
        const data = await supportAPI.getUserTickets(params);
        setTickets(data || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        dispatch(addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load support tickets',
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [filter]);

  // Fetch ticket details when selected
  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (selectedTicket) {
        try {
          const data = await supportAPI.getTicketById(selectedTicket._id);
          setSelectedTicket(data);
          // Update in tickets list
          setTickets(prev => prev.map(t => t._id === data._id ? data : t));
        } catch (error) {
          console.error('Error fetching ticket details:', error);
          dispatch(addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to load ticket details',
          }));
        }
      }
    };

    fetchTicketDetails();
  }, [selectedTicket?._id]);

  // Handle opening modal with animation
  const handleOpenModal = () => {
    setIsModalClosing(false);
    setShowNewTicketModal(true);
  };

  // Handle closing modal with animation
  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowNewTicketModal(false);
      setIsModalClosing(false);
    }, 200); // Match animation duration
  };

  // Trigger opening animation when modal becomes visible
  useEffect(() => {
    if (showNewTicketModal && !isModalClosing) {
      // Force reflow to ensure opening animation plays
      requestAnimationFrame(() => {
        // Animation will play automatically via CSS transition
      });
    }
  }, [showNewTicketModal, isModalClosing]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      dispatch(addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      }));
      return;
    }

    try {
      setIsSubmitting(true);
      const newTicket = await supportAPI.createTicket(formData);
      dispatch(addNotification({
        type: 'success',
        title: 'Success',
        message: 'Support ticket created successfully',
      }));
      setTickets(prev => [newTicket, ...prev]);
      handleCloseModal();
      setFormData({
        subject: '',
        category: 'general_inquiry',
        priority: 'medium',
        description: '',
      });
      setSelectedTicket(newTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create support ticket',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResponse = async (ticketId, message) => {
    if (!message.trim()) {
      dispatch(addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a message',
      }));
      return;
    }

    try {
      const updatedTicket = await supportAPI.addResponse(ticketId, message);
      setSelectedTicket(updatedTicket);
      setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
      dispatch(addNotification({
        type: 'success',
        title: 'Success',
        message: 'Response added successfully',
      }));
    } catch (error) {
      console.error('Error adding response:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to add response',
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category) => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.icon : HelpCircle;
  };

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                Help & Support
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Report issues, ask questions, or request assistance
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              New Ticket
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'all' ? 'All' : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Tickets ({filteredTickets.length})
                </h2>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4">
                    <LoadingSkeleton type="default" />
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="p-8 text-center">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No tickets found</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => {
                    const StatusIcon = statusConfig[ticket.status]?.icon || Clock;
                    const CategoryIcon = getCategoryIcon(ticket.category);
                    return (
                      <div
                        key={ticket._id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                          selectedTicket?._id === ticket._id
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {ticket.subject}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <CategoryIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {categoryOptions.find(c => c.value === ticket.category)?.label}
                              </span>
                            </div>
                          </div>
                          <StatusIcon className={`h-5 w-5 ${statusConfig[ticket.status]?.color.split(' ')[1]}`} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${statusConfig[ticket.status]?.color}`}>
                            {statusConfig[ticket.status]?.label}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedTicket.subject}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                        {selectedTicket.resolvedAt && (
                          <span>Resolved: {formatDate(selectedTicket.resolvedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedTicket.status]?.color}`}>
                        {statusConfig[selectedTicket.status]?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const CategoryIcon = getCategoryIcon(selectedTicket.category);
                        return <CategoryIcon className="h-5 w-5 text-gray-400" />;
                      })()}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {categoryOptions.find(c => c.value === selectedTicket.category)?.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Priority: <span className="font-medium">{selectedTicket.priority}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Responses */}
                  {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Responses ({selectedTicket.responses.length})
                      </h3>
                      <div className="space-y-4">
                        {selectedTicket.responses.map((response, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg ${
                              response.responderRole === 'admin' || response.responderRole === 'super_admin'
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {response.responderName}
                                {response.responderRole === 'admin' || response.responderRole === 'super_admin' ? (
                                  <span className="ml-2 text-xs px-2 py-0.5 bg-blue-600 text-white rounded">
                                    Support Team
                                  </span>
                                ) : null}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(response.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {response.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Response Form */}
                  {selectedTicket.status !== 'closed' && (
                    <TicketResponseForm
                      ticketId={selectedTicket._id}
                      onAddResponse={handleAddResponse}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a ticket to view details
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a ticket from the list or create a new one
                </p>
              </div>
            )}
          </div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <NewTicketModal
            formData={formData}
            setFormData={setFormData}
            categoryOptions={categoryOptions}
            priorityOptions={priorityOptions}
            onSubmit={handleSubmitTicket}
            onClose={handleCloseModal}
            isSubmitting={isSubmitting}
            isModalClosing={isModalClosing}
          />
        )}
      </div>
    </div>
  );
};

// Ticket Response Form Component
const TicketResponseForm = ({ ticketId, onAddResponse }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await onAddResponse(ticketId, message);
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add Response</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your response here..."
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3 resize-none"
        rows={4}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? 'Sending...' : 'Send Response'}
      </button>
    </form>
  );
};

// New Ticket Modal Component
const NewTicketModal = ({ formData, setFormData, categoryOptions, priorityOptions, onSubmit, onClose, isSubmitting, isModalClosing }) => {
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    // Trigger opening animation
    if (!isModalClosing) {
      // Start with closed state, then immediately transition to open
      setIsOpening(true);
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isModalClosing]);

  return (
    <div 
      className={`absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/10 dark:bg-black/10 transition-opacity duration-200 ${
        isModalClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
          isModalClosing 
            ? 'opacity-0 scale-95 translate-y-2' 
            : isOpening
            ? 'opacity-0 scale-95 translate-y-2'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={6}
              placeholder="Please provide detailed information about your issue..."
              required
            />
          </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Ticket'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
