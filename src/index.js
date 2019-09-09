require('dotenv').config()

var express = require('express');
var express_graphql = require('express-graphql');
var {
  makeExecutableSchema
} = require('graphql-tools');
var {
  schema: rootSchema,
  resolvers: rootResolvers
} = require('./schema');

const INTERNAL_HOST_DATA = process.env['INTERNAL_HOST_DATA'];
const INTERNAL_PORT_DATA = process.env['INTERNAL_PORT_DATA'];
const ROUTE_GRAPH = process.env['ROUTE_GRAPH'];
const INTERNAL_PORT_GRAPH = process.env['INTERNAL_PORT_GRAPH'];

const mongoose = require('mongoose');

//microservice-auth-data.auth-stateful-microservices-namespace:27017
mongoose.connect('mongodb://' + INTERNAL_HOST_DATA + ':' + INTERNAL_PORT_DATA + '/auth', {
  useNewUrlParser: true
});

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers
});

var app = express();
app.use(ROUTE_GRAPH, express_graphql({
  schema: schema,
  graphiql: true
}));
app.listen(INTERNAL_PORT_GRAPH, () => console.log('Auth GraphQL running...'));


function shutdown(signal) {
  return async function(err) {
    console.log(`${signal}...`);
    if (err) {
      console.error(err.stack || err);
    }

    console.log("Closing connection");
    mongoose.connection.close();

    setTimeout(() => {
      process.exit(
        err ?
        1 :
        0);
    }, 1000).unref();
  };
}

process.on('SIGTERM', shutdown('SIGTERM')).on('SIGINT', shutdown('SIGINT')).on('uncaughtException', shutdown('uncaughtException'));
