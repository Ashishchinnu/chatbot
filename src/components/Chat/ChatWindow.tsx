import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_CHAT_MESSAGES, SUBSCRIBE_TO_MESSAGES } from '../../graphql/queries';
import { INSERT_MESSAGE, SEND_MESSAGE_ACTION } from '../../graphql/mutations';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useUserId } from '@nhost/react';

interface ChatWindowProps {
  chatId: string;
  chatTitle?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, chatTitle }) => {
  const userId = useUserId();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data, loading } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId },
  });

  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
  });

  const [insertMessage] = useMutation(INSERT_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);

  const messages: Message[] = subscriptionData?.messages || data?.chats_by_pk?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chatId || isLoading) return;

    setIsLoading(true);

    try {
      // Insert user message
      await insertMessage({
        variables: {
          chat_id: chatId,
          content,
          is_bot: false,
        },
      });

      // Call the Hasura Action to trigger chatbot response
      await sendMessageAction({
        variables: {
          chat_id: chatId,
          content,
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {chatTitle || 'Chat'}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-4">💬</div>
            <p>Start the conversation!</p>
            <p className="text-sm mt-2">Send a message to begin chatting with the AI assistant.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.user_id === userId}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-700 text-sm">🤖</span>
              </div>
              <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatWindow;