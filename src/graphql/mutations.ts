import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chat_id: uuid!, $content: String!, $is_bot: Boolean = false) {
    insert_messages_one(
      object: { 
        chat_id: $chat_id, 
        content: $content, 
        is_bot: $is_bot 
      }
    ) {
      id
      content
      is_bot
      created_at
    }
  }
`;

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      success
      message
    }
  }
`;