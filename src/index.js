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


const mongoose = require('mongoose');

//microservice-auth-data.auth-stateful-microservices-namespace:27017
mongoose.connect('mongodb://' + process.env['URL_DATA'] + ':' + process.env['PORT_DATA'] + '/auth', {
  useNewUrlParser: true
});

console.log("DATA_CONNECTED");
console.log(process.env);

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers
});

var app = express();
app.use(process.env['PATH_URL_GRAPH'], express_graphql({
  schema: schema,
  graphiql: true
}));
app.listen(process.env['PORT'], () => console.log('Auth GraphQL running...'));


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
