const { Observable } = require('rxjs');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
# Root Subscription
type Query {
  someLiveInt: Int
}
`;

const resolvers = {
  Query: {
    someLiveInt(root, args, ctx) {
      return Observable.interval(100);
    },
  },
};

module.exports = {
  schema: makeExecutableSchema({typeDefs, resolvers}),
};
