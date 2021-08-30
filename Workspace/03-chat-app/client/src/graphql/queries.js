import gql from 'graphql-tag';
import client from './client';

const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      from
      text
    }
  }
`;

const addMessageMutation = gql`
  mutation AddMessageMutation($input: MessageInput!) {
    message: addMessage(input: $input) {
      id
      from
      text
    }
  }
`;

// subscription
const messageAddedSubscription = gql`
  subscription {
    messageAdded {
      id
      from
      text
    }
  }
`;

export async function addMessage(text) {
  const { data } = await client.mutate({
    mutation: addMessageMutation,
    variables: { input: { text } },
  });
  return data.message;
}

export async function getMessages() {
  const { data } = await client.query({ query: messagesQuery });
  return data.messages;
}

export function onMessageAdded(handlerMessage) {
  // This initiates the GraphQL subscription with the server,
  // which means the server will send messages to this client over WebSocket.
  const observable = client.subscribe({ query: messageAddedSubscription }); // receive data from server

  // subscribe to ongoing messages between server and client
  return observable.subscribe(({ data }) => {
    handlerMessage(data.messageAdded); // dispatch data to other parts of client application
  });
}
