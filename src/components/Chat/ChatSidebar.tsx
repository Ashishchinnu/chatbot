import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHATS } from '../../graphql/queries';
import { Chat } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ selectedChatId, onSelectChat }) => {
  const { data, loading, error } = useQuery(GET_CHATS);

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600 text-sm">
          Failed to load chats
        </div>
      </div>
    );
  }

  const chats: Chat[] = data?.chats || [];

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-500 text-sm">
          No chats yet. Start a new conversation!
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Recent Chats</h2>
        <div className="space-y-2">
          {chats.map((chat) => {
            const lastMessage = chat.messages[0];
            const isSelected = selectedChatId === chat.id;
            
            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {chat.title}
                    </h3>
                    {lastMessage && (
                      <p className={`text-xs mt-1 truncate ${
                        isSelected ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {lastMessage.is_bot ? '🤖 ' : ''}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`text-xs mt-2 ${
                  isSelected ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;