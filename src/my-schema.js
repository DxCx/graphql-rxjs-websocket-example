const { Observable } = require('rxjs');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
# Root Subscription
type Query {
  someLiveInt: Int
  slowInt: Int
  simpleInt: Int
}

type Subscription {
  clock: String
}
`;

const resolvers = {
  Query: {
    someLiveInt(root, args, ctx) {
      return Observable.interval(1000);
    },
    slowInt(root, args, ctx) {
      return new Promise(resolve => {
        setTimeout(() => resolve(1), 5000);
      });
    },
    simpleInt(root, args, ctx) {
      return 10;
    },
  },
  Subscription: {
    clock(root, args, ctx) {
      return new Date().toString();
    }
  }
};

module.exports = {
  schema: makeExecutableSchema({typeDefs, resolvers}),
  rootValue: {
    // Used for subscription's subscribe
    clock: Observable.interval(1000).shareReplay(1),
  }
};
