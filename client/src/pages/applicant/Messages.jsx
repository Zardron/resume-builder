import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Send, Paperclip, Plus, X, Briefcase } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { messagesAPI, applicationsAPI } from '../../services/api';
import { useAppSelector } from '../../store/hooks';
import {
  initializeSocket,
  joinConversation,
  leaveConversation,
  onNewMessage,
  onConversationUpdate,
} from '../../services/socketService';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    initializeSocket();
    return () => {
      // Cleanup is handled by UserActivityTracker
    };
  }, []);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const data = await messagesAPI.getConversations();
        
        // Transform data to match component expectations
        const transformedConversations = data.map((conv) => {
          const otherParticipant = conv.participants?.find(
            (p) => p.userId?._id?.toString() !== user?.id?.toString()
          );
          
          return {
            id: conv._id,
            conversationId: conv._id,
            recruiter: otherParticipant?.userId?.fullName || 'Unknown',
            company: conv.relatedTo?.applicationId?.organizationId?.name || 'Unknown Company',
            jobTitle: conv.relatedTo?.applicationId?.jobTitle || 'General',
            lastMessage: conv.lastMessage?.body || 'No messages yet',
            lastMessageTime: conv.lastMessageAt || conv.createdAt,
            unread: conv.unreadCount || 0,
            participant: otherParticipant,
            conversation: conv,
          };
        });
        
        setConversations(transformedConversations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  // Join conversation room and fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation?.conversationId) {
      const conversationId = selectedConversation.conversationId;
      
      // Join socket room for real-time updates
      joinConversation(conversationId);
      
      // Fetch messages from API
      const fetchMessages = async () => {
        try {
          const data = await messagesAPI.getMessages(conversationId);
          
          // Transform messages
          const transformedMessages = data.map((msg) => ({
            id: msg._id,
            sender: msg.senderId?._id?.toString() === user?.id?.toString() ? 'applicant' : 'recruiter',
            message: msg.body,
            timestamp: msg.createdAt,
            senderId: msg.senderId?._id,
            senderName: msg.senderId?.fullName || msg.senderId?.email,
            readAt: msg.readAt,
          }));
          
          setMessages(transformedMessages);
          scrollToBottom();
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      
      fetchMessages();
      
      // Cleanup: leave conversation room when component unmounts or conversation changes
      return () => {
        leaveConversation(conversationId);
      };
    } else {
      setMessages([]);
    }
  }, [selectedConversation, user?.id]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!selectedConversation?.conversationId) return;

    const unsubscribeNewMessage = onNewMessage((data) => {
      if (data.conversationId === selectedConversation.conversationId) {
        const msg = data.message;
        const transformedMessage = {
          id: msg._id || msg.id,
          sender: msg.senderId?._id?.toString() === user?.id?.toString() 
            ? 'applicant' 
            : 'recruiter',
          message: msg.body,
          timestamp: msg.createdAt || new Date().toISOString(),
          senderId: msg.senderId?._id || msg.senderId,
          senderName: msg.senderId?.fullName || msg.senderId?.email,
          readAt: msg.readAt,
        };
        
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === transformedMessage.id)) {
            return prev;
          }
          return [...prev, transformedMessage];
        });
        
        scrollToBottom();
      }
    });

    const unsubscribeConversationUpdate = onConversationUpdate((data) => {
      if (data.conversationId === selectedConversation.conversationId) {
        // Update conversation in list if needed
        setConversations((prev) =>
          prev.map((conv) =>
            conv.conversationId === data.conversationId
              ? {
                  ...conv,
                  lastMessageTime: data.lastMessageAt || conv.lastMessageTime,
                  unread: data.unreadCount?.[user?.id] || 0,
                }
              : conv
          )
        );
      }
      
      // Update all conversations in list
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          unread: data.unreadCount?.[conv.conversationId] || conv.unread,
        }))
      );
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeConversationUpdate();
    };
  }, [selectedConversation, user?.id]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.conversationId) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Optimistically add message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: 'applicant',
      message: messageText,
      timestamp: new Date().toISOString(),
      senderId: user?.id,
      senderName: user?.fullName || user?.email,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    scrollToBottom();

    try {
      // Send via REST API - server will emit socket event for real-time delivery
      await messagesAPI.sendMessage(selectedConversation.conversationId, {
        body: messageText,
      });
      // Message will arrive via socket event, so we can remove the optimistic one
      // or keep it - socket will update with real message ID
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      alert('Failed to send message. Please try again.');
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.recruiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  // Fetch applications for new message modal
  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const data = await applicationsAPI.getAll();
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Handle opening new message modal
  const handleNewMessage = () => {
    setIsModalClosing(false);
    setShowNewMessageModal(true);
    if (applications.length === 0) {
      fetchApplications();
    }
  };

  // Handle closing modal with animation
  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowNewMessageModal(false);
      setIsModalClosing(false);
    }, 200); // Match animation duration
  };

  // Handle starting conversation from application
  const handleStartConversation = async (application) => {
    try {
      const applicationId = application._id || application.id;

      if (!applicationId) {
        alert('Unable to start conversation: Invalid application.');
        return;
      }

      // Use createConversation with applicationId - it will find the right recipient
      const conversationData = await messagesAPI.createConversation({
        applicationId,
      });

      // Transform conversation data
      const otherParticipant = conversationData.participants?.find(
        (p) => p.userId?._id?.toString() !== user?.id?.toString()
      );

      const transformedConversation = {
        id: conversationData._id,
        conversationId: conversationData._id,
        recruiter: otherParticipant?.userId?.fullName || 'Unknown',
        company: application.organizationId?.name || application.jobPostingId?.organizationId?.name || 'Unknown Company',
        jobTitle: application.jobPostingId?.title || application.jobTitle || 'General',
        lastMessage: 'No messages yet',
        lastMessageTime: conversationData.createdAt,
        unread: 0,
        participant: otherParticipant,
        conversation: conversationData,
      };

      // Add to conversations list if not already there
      setConversations((prev) => {
        const exists = prev.some((c) => c.conversationId === conversationData._id);
        if (exists) return prev;
        return [transformedConversation, ...prev];
      });

      // Select the new conversation
      setSelectedConversation(transformedConversation);
      setShowNewMessageModal(false);
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-8rem)] flex flex-col relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Communicate with recruiters</p>
        </div>
        <button
          onClick={handleNewMessage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Message
        </button>
      </div>

      <div className="flex-1 flex gap-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {conversation.recruiter}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {conversation.company}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                    {conversation.jobTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {conversation.lastMessageTime
                      ? new Date(conversation.lastMessageTime).toLocaleDateString()
                      : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {selectedConversation.recruiter}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedConversation.company} • {selectedConversation.jobTitle}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'applicant' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'applicant'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'applicant'
                              ? 'text-blue-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div 
          className={`absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/10 dark:bg-black/10 transition-opacity duration-200 ${
            isModalClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
              isModalClosing 
                ? 'opacity-0 scale-95 translate-y-2' 
                : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Start New Conversation
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select an application to start a conversation with the recruiter
              </p>
              {loadingApplications ? (
                <div className="py-8">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      </div>
                      <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded ml-4" />
                    </div>
                  </div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You don't have any applications yet.</p>
                  <p className="text-sm mt-2">Apply to jobs to start messaging recruiters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((application) => {
                    const companyName = application.organizationId?.name || application.jobPostingId?.organizationId?.name || 'Unknown Company';
                    const jobTitle = application.jobPostingId?.title || application.jobTitle || 'Unknown Position';
                    const status = application.status || 'pending';

                    return (
                      <div
                        key={application._id || application.id}
                        onClick={() => handleStartConversation(application)}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {jobTitle}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {companyName}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  status === 'accepted' || status === 'approved'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : status === 'interview'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <MessageSquare className="h-5 w-5 text-gray-400 ml-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
