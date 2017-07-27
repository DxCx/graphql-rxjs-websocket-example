const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { executeReactive, prepareSchema, subscribe } = require('graphql-rxjs');
const { schema } = require('./my-schema');
prepareSchema(schema);

const WS_PORT = 5000;

// Create WebSocket listener server
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

// Bind it to port and start listening
websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on http://localhost:${WS_PORT}`
));

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute: executeReactive,
    subscribe,
  },
  {
    server: websocketServer,
    path: '/graphql',
  }
);
