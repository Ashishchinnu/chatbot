import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CHAT, INSERT_MESSAGE } from '../graphql/mutations';
import { GET_CHATS } from '../graphql/queries';

export const useChat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });

  const { data: chatsData, loading: chatsLoading } = useQuery(GET_CHATS);

  const handleCreateChat = useCallback(async () => {
    try {
      const result = await createChat({
        variables: {
          title: `Chat ${new Date().toLocaleString()}`,
        },
      });

      if (result.data?.insert_chats_one) {
        setSelectedChatId(result.data.insert_chats_one.id);
        return result.data.insert_chats_one;
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }, [createChat]);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
  }, []);

  const selectedChat = chatsData?.chats?.find((chat: any) => chat.id === selectedChatId);

  return {
    selectedChatId,
    selectedChat,
    chats: chatsData?.chats || [],
    chatsLoading,
    createChat: handleCreateChat,
    selectChat: handleSelectChat,
  };
};