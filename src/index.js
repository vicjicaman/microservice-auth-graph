
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


console.log(process.env)

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers
});

var app = express();
app.use(process.env['SERVICE_URL_PATH_GRAPHQL'], express_graphql({
  schema: schema,
  graphiql: true
}));
app.listen(process.env['SERVICE_PORT'], () => console.log('Auth GraphQL running...'));
