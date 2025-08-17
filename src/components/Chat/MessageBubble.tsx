import React from 'react';
import { Message } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-xs lg:max-w-md`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600 ml-3' : 'bg-gray-300 mr-3'
        }`}>
          {isUser ? (
            <span className="text-white text-sm font-medium">U</span>
          ) : (
            <span className="text-gray-700 text-sm">🤖</span>
          )}
        </div>
        <div className={`rounded-2xl px-4 py-2 shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-900 border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <p className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;