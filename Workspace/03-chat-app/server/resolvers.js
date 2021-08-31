const { PubSub } = require('graphql-subscriptions');
const db = require('./db');

const MESSAGE_ADDED = 'MESSAGE_ADDED';

// this 'PubSub' is basic PubSub which will work properly on single server.
// for prod scenarios, you can use alternate pubsub implementations available.
const pubSub = new PubSub();

function requireAuth(userId) {
  if (!userId) {
    throw new Error('Unauthorized');
  }
}

const Query = {
  messages: (_root, _args, { userId }) => {
    requireAuth(userId);
    return db.messages.list();
  },
};

const Mutation = {
  addMessage: (_root, { input }, { userId }) => {
    requireAuth(userId);
    const messageId = db.messages.create({ from: userId, text: input.text });
    const message = db.messages.get(messageId);

    // 1st arg is event name as mentioned in the 'Subscription' asyncIterator.
    // 2nd arg is obj with property of the same name as the one in 'Subscription'
    pubSub.publish(MESSAGE_ADDED, { messageAdded: message });
    return message;
  },
};

const Subscription = {
  messageAdded: {
    // 'iterator' because with a subscription, the client doesn't receive a single value,
    // like with a query, but it can receive multiple values over time.
    // This will take care of notifying all the subscribers every time we publish a new message.
    // in 'subscribe', we receive 3rd param as context obj just like for queries and mutations.
    subscribe: (_root, _args, { userId }) => {
      requireAuth(userId);
      return pubSub.asyncIterator(MESSAGE_ADDED);
    },
  },
};

module.exports = { Query, Mutation, Subscription };
