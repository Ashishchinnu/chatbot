import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  onNewChat: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewChat }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to ChatBot
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          Start a new conversation with our AI assistant. Ask questions, get help, or just have a chat!
        </p>
        <button
          onClick={onNewChat}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
          Start New Chat
        </button>
      </div>
    </div>
  );
};

export default EmptyState;