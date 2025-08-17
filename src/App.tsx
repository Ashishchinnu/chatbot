import React, { useState } from 'react';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { nhost } from './lib/nhost';
import { apolloClient } from './lib/apollo';
import AuthWrapper from './components/Auth/AuthWrapper';
import Layout from './components/Layout/Layout';
import ChatSidebar from './components/Chat/ChatSidebar';
import ChatWindow from './components/Chat/ChatWindow';
import EmptyState from './components/Chat/EmptyState';
import { useChat } from './hooks/useChat';

const ChatApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    selectedChatId,
    selectedChat,
    chats,
    createChat,
    selectChat,
  } = useChat();

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = async () => {
    await createChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    setSidebarOpen(false);
  };

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={handleToggleSidebar}
      onNewChat={handleNewChat}
      sidebar={
        <ChatSidebar
          selectedChatId={selectedChatId || undefined}
          onSelectChat={handleSelectChat}
        />
      }
    >
      {selectedChatId ? (
        <ChatWindow
          chatId={selectedChatId}
          chatTitle={selectedChat?.title}
        />
      ) : (
        <EmptyState onNewChat={handleNewChat} />
      )}
    </Layout>
  );
};

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <AuthWrapper>
          <ChatApp />
        </AuthWrapper>
      </ApolloProvider>
    </NhostProvider>
  );
}

export default App;