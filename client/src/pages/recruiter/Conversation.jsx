import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, User } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const Conversation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch conversation and messages from API
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setConversation({
            id: parseInt(id),
            candidate: {
              name: 'John Doe',
              job: 'Senior Frontend Developer',
            },
          });
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
            {
              id: 3,
              sender: 'candidate',
              message: 'Yes, I am available. I can do Tuesday or Wednesday afternoon.',
              timestamp: '2024-01-15T11:00:00',
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Send message to API
    const message = {
      id: messages.length + 1,
      sender: 'recruiter',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  if (!conversation) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Conversation not found</p>
        <button
          onClick={() => navigate('/dashboard/recruiter/messages')}
          className="mt-4 text-blue-600 hover:text-blue-700"
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
            onClick={() => navigate('/dashboard/recruiter/messages')}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{conversation.candidate.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{conversation.candidate.job}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'recruiter'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'recruiter' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 dark:border-gray-700">
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
            className="p-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;

