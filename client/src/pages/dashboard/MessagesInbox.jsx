import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Send, User } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const MessagesInbox = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch conversations from API
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        // Simulated data
        setTimeout(() => {
          setConversations([
            { id: 1, name: 'John Doe', job: 'Senior Developer', lastMessage: 'Thank you for the opportunity...', unread: 2, time: '2h ago' },
            { id: 2, name: 'Jane Smith', job: 'Product Manager', lastMessage: 'I am very interested...', unread: 0, time: '1d ago' },
            { id: 3, name: 'Bob Johnson', job: 'Designer', lastMessage: 'When can we schedule...', unread: 1, time: '3h ago' }
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

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.job.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Communicate with candidates
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => navigate(`/dashboard/recruiter/messages/${conversation.id}`)}
                  className="cursor-pointer p-4 transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {conversation.name}
                        </h3>
                        {conversation.unread > 0 && (
                          <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                        {conversation.job}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {conversation.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No conversations found
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Choose a conversation from the list to view messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesInbox;

