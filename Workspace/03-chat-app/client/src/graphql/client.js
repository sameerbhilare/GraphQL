import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from 'apollo-boost';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { getAccessToken } from '../auth';

const httpUrl = 'http://localhost:9000/graphql';
const wsUrl = 'ws://localhost:9000/graphql';

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
      operation.setContext({ headers: { authorization: `Bearer ${token}` } });
    }
    return forward(operation);
  }),
  new HttpLink({ uri: httpUrl }),
]);

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    // By default "lazy" is "false" which means Apollo Client will start a WebSocket connection
    // as soon as the application is loaded.
    lazy: true, // create websocker connection only when needed

    // if the WebSocket connection is interrupted for whatever reason, the client will try to reconnect.
    reconnect: true,
  },
});

const isSubscription = (operartion) => {
  const definition = getMainDefinition(operartion.query);

  // as per Apollo documentation
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // 'split' function works a bit like 'if-else'
  // If the condition we pass as 1st arg is true, then it will use the 2nd arg, otherwise it will use 3rd arg
  link: split(isSubscription, wsLink, httpLink),
  defaultOptions: { query: { fetchPolicy: 'no-cache' } },
});

export default client;
