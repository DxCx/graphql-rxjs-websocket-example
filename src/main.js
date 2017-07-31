const { SubscriptionServer } = require('subscriptions-transport-ws');
const {
  prepareSchema,
  specifiedRules,
  executeReactive,
  subscribe
} = require('graphql-rxjs');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const express = require('express');
const { rootValue, schema } = require('./my-schema');

const WS_PORT = 5000;
// TOOGLE This to switch to hybrid mode (Http + Ws)
const HYBRID = false;
let graphiqlWs = '/graphiql';

const app = express();
if ( HYBRID ) {
  const bodyParser = require('body-parser');
  app.use('/graphql', bodyParser.json(), graphqlExpress({
    schema,
    rootValue,
    validationRules: specifiedRules,
  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: `/graphql`,
    subscriptionsEndpoint: `ws://localhost:${WS_PORT}/graphql`,
  }));

  app.use('/graphiql-plain', graphiqlExpress({
    endpointURL: `/graphql`,
  }));

  graphiqlWs = '/graphiql-full';
}

app.use(graphiqlWs, graphiqlExpress({
  endpointURL: `ws://localhost:${WS_PORT}/graphql`,
  subscriptionsEndpoint: `ws://localhost:${WS_PORT}/graphql`,
}));

// Set up schema for GraphQL-RxJs
prepareSchema(schema);

const server = app.listen(WS_PORT, () => {
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      rootValue,
      execute: executeReactive,
      subscribe,
      validationRules: specifiedRules,
    },
    {
      server: server,
      path: '/graphql',
    }
  );

  console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`);
});
