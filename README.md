# ChatBot Application

A modern, production-ready chatbot application built with React, TypeScript, Nhost Auth, Hasura GraphQL, and n8n integration.

## Features

- **Authentication**: Email-based sign-up/sign-in with Nhost Auth
- **Real-time Chat**: GraphQL subscriptions for live message updates
- **AI Integration**: Chatbot powered by n8n workflows and OpenRouter
- **Responsive Design**: Mobile-first design that works on all devices
- **Secure**: Row-level security (RLS) and proper permissions
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Authentication**: Nhost Auth
- **Database & API**: Hasura GraphQL with PostgreSQL
- **Automation**: n8n workflows
- **AI**: OpenRouter (free models available)
- **Icons**: Heroicons, Lucide React
- **Forms**: React Hook Form
- **Real-time**: GraphQL Subscriptions

## Setup Instructions

### 1. Nhost Setup

1. Visit [Nhost](https://nhost.io) and create a new account
2. Create a new project
3. Note your project's:
   - Subdomain (e.g., `your-project-name`)
   - Region (e.g., `us-east-1`)

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Update the environment variables:
   ```env
   REACT_APP_NHOST_SUBDOMAIN=your-project-subdomain
   REACT_APP_NHOST_REGION=your-region
   ```

### 3. Database Schema Setup

In your Nhost Hasura Console, run these SQL commands:

```sql
-- Create chats table
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_bot boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 4. Hasura Permissions Setup

#### Chats Table Permissions (user role):
- **Select**: Custom check: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`
- **Insert**: Custom check: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`
- **Update**: Custom check: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`
- **Delete**: Custom check: `{"user_id":{"_eq":"X-Hasura-User-Id"}}`

#### Messages Table Permissions (user role):
- **Select**: Custom check: `{"chat":{"user_id":{"_eq":"X-Hasura-User-Id"}}}`
- **Insert**: Custom check: `{"chat":{"user_id":{"_eq":"X-Hasura-User-Id"}}}`

### 5. Hasura Action Setup

1. Go to Actions tab in Hasura Console
2. Create a new action called `sendMessage`:

**Action Definition**:
```graphql
type Mutation {
  sendMessage(chat_id: uuid!, content: String!): SendMessageOutput
}

type SendMessageOutput {
  success: Boolean!
  message: String
}
```

**Handler**: `https://your-n8n-instance.com/webhook/hasura-send-message`

**Action Permissions**: Allow `user` role

### 6. n8n Workflow Setup

1. Set up n8n (self-hosted or cloud)
2. Create a new workflow with these nodes:

   a. **Webhook Node**:
      - Method: POST
      - Path: `/hasura-send-message`
      - Authentication: None (handle in next node)

   b. **Function Node** (Validation):
   ```javascript
   // Validate user has access to chat_id
   const chatId = $json.input.chat_id;
   const userId = $json.session_variables['x-hasura-user-id'];
   
   // You would query Hasura here to verify ownership
   return { chatId, userId, content: $json.input.content };
   ```

   c. **HTTP Request Node** (OpenRouter):
      - Method: POST
      - URL: `https://openrouter.ai/api/v1/chat/completions`
      - Headers: 
        - `Authorization: Bearer YOUR_OPENROUTER_API_KEY`
        - `Content-Type: application/json`
      - Body:
      ```json
      {
        "model": "meta-llama/llama-3.2-3b-instruct:free",
        "messages": [
          {
            "role": "user", 
            "content": "{{ $json.content }}"
          }
        ]
      }
      ```

   d. **HTTP Request Node** (Save to Hasura):
      - Method: POST
      - URL: `https://your-nhost-subdomain.hasura.your-region.nhost.run/v1/graphql`
      - Headers:
        - `Content-Type: application/json`
        - `x-hasura-admin-secret: your-admin-secret`
      - Body:
      ```json
      {
        "query": "mutation($chat_id: uuid!, $content: String!) { insert_messages_one(object: {chat_id: $chat_id, content: $content, is_bot: true}) { id } }",
        "variables": {
          "chat_id": "{{ $json.chatId }}",
          "content": "{{ $json.choices[0].message.content }}"
        }
      }
      ```

   e. **Respond to Webhook Node**:
   ```json
   {
     "success": true,
     "message": "Response generated successfully"
   }
   ```

### 7. OpenRouter Setup

1. Sign up at [OpenRouter](https://openrouter.ai)
2. Get your API key
3. Add it to your n8n workflow
4. Use free models like `meta-llama/llama-3.2-3b-instruct:free`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Enable form processing if using contact forms

## Security Considerations

- All database access is protected by RLS policies
- Users can only access their own chats and messages
- Hasura Actions are protected by authentication
- n8n workflows should validate user permissions
- API keys are stored securely in n8n
- Frontend never directly calls external APIs

## Architecture

```
Frontend (React/TypeScript)
    ↓ GraphQL (Queries/Mutations/Subscriptions)
Hasura GraphQL Engine
    ↓ PostgreSQL + RLS
Database Tables (chats, messages)
    ↓ Actions/Webhooks
n8n Workflows
    ↓ HTTP Requests
OpenRouter API (AI Models)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details