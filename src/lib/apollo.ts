import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { nhost } from './nhost';

const httpLink = createHttpLink({
  uri: `https://${import.meta.env.REACT_APP_NHOST_SUBDOMAIN || 'your-nhost-subdomain'}.hasura.${import.meta.env.REACT_APP_NHOST_REGION || 'us-east-1'}.nhost.run/v1/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://${import.meta.env.REACT_APP_NHOST_SUBDOMAIN || 'your-nhost-subdomain'}.hasura.${import.meta.env.REACT_APP_NHOST_REGION || 'us-east-1'}.nhost.run/v1/graphql`,
    connectionParams: () => ({
      headers: {
        Authorization: `Bearer ${nhost.auth.getAccessToken()}`,
      },
    }),
  })
);

const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});