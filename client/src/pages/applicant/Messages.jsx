import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Send, Paperclip } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const Messages = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch conversations from API
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setConversations([
            {
              id: 1,
              recruiter: 'John Smith',
              company: 'Tech Corp',
              jobTitle: 'Senior Frontend Developer',
              lastMessage: 'Thank you for your interest. We would like to schedule an interview.',
              lastMessageTime: '2024-01-15T10:30:00',
              unread: 2,
            },
            {
              id: 2,
              recruiter: 'Jane Doe',
              company: 'StartupXYZ',
              jobTitle: 'Product Manager',
              lastMessage: 'We have reviewed your application and would like to move forward.',
              lastMessageTime: '2024-01-14T14:20:00',
              unread: 0,
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // TODO: Fetch messages for selected conversation
      setMessages([
        {
          id: 1,
          sender: 'recruiter',
          message: 'Thank you for your interest in the Senior Frontend Developer position.',
          timestamp: '2024-01-15T10:00:00',
        },
        {
          id: 2,
          sender: 'recruiter',
          message: 'We would like to schedule an interview with you. Are you available next week?',
          timestamp: '2024-01-15T10:30:00',
        },
      ]);
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Send message to API
    const message = {
      id: messages.length + 1,
      sender: 'applicant',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="p-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Communicate with recruiters</p>
      </div>

      <div className="flex-1 flex gap-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{conversation.recruiter}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{conversation.company}</p>
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
                  {new Date(conversation.lastMessageTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.recruiter}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedConversation.company} • {selectedConversation.jobTitle}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
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
                      <p className={`text-xs mt-1 ${
                        message.sender === 'applicant' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <p className="text-gray-600 dark:text-gray-400">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

