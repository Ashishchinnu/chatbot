import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: desc }, limit: 1) {
        content
        is_bot
        created_at
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      title
      messages(order_by: { created_at: asc }) {
        id
        content
        is_bot
        created_at
        user_id
      }
    }
  }
`;

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;