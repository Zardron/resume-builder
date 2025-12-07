import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, User } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { messagesAPI } from '../../services/api';
import { useAppSelector } from '../../store/hooks';
import {
  initializeSocket,
  joinConversation,
  leaveConversation,
  onNewMessage,
  onConversationUpdate,
} from '../../services/socketService';

const Conversation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    initializeSocket();
  }, []);

  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        
        // Fetch conversation details
        const convData = await messagesAPI.getConversationById(id);
        
        if (!convData) {
          setIsLoading(false);
          return;
        }

        // Transform conversation data
        const otherParticipant = convData.participants?.find(
          (p) => p.userId?._id?.toString() !== user?.id?.toString()
        );

        setConversation({
          id: convData._id,
          conversationId: convData._id,
          recruiter: {
            name: otherParticipant?.userId?.fullName || 'Unknown',
            company: convData.relatedTo?.applicationId?.organizationId?.name || 'Unknown Company',
            jobTitle: convData.relatedTo?.applicationId?.jobTitle || 'General',
          },
          conversation: convData,
        });

        // Join socket room for real-time updates
        joinConversation(convData._id);

        // Fetch messages
        const messagesData = await messagesAPI.getMessages(convData._id);
        
        // Transform messages
        const transformedMessages = messagesData.map((msg) => ({
          id: msg._id,
          sender: msg.senderId?._id?.toString() === user?.id?.toString() ? 'applicant' : 'recruiter',
          message: msg.body,
          timestamp: msg.createdAt,
          senderId: msg.senderId?._id,
          senderName: msg.senderId?.fullName || msg.senderId?.email,
          readAt: msg.readAt,
        }));
        
        setMessages(transformedMessages);
        setIsLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchConversation();
    }

    // Cleanup: leave conversation room
    return () => {
      if (id) {
        leaveConversation(id);
      }
    };
  }, [id, user?.id]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!id) return;

    const unsubscribeNewMessage = onNewMessage((data) => {
      if (data.conversationId === id) {
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
      if (data.conversationId === id && conversation) {
        setConversation((prev) => ({
          ...prev,
          lastMessageAt: data.lastMessageAt,
        }));
      }
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeConversationUpdate();
    };
  }, [id, user?.id, conversation]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;

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
      await messagesAPI.sendMessage(id, {
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

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (!conversation) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Conversation not found</p>
        <button
          onClick={() => navigate('/dashboard/applicant/messages')}
          className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/applicant/messages')}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {conversation.recruiter.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {conversation.recruiter.company} • {conversation.recruiter.jobTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
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

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
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
            className="p-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;
