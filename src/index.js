var express = require('express');
var express_graphql = require('express-graphql');
var {
  makeExecutableSchema
} = require('graphql-tools');
var {
  schema: rootSchema,
  resolvers: rootResolvers
} = require('./schema');

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers
});

var app = express();
app.use('/', express_graphql({
  schema: schema,
  graphiql: true
}));
app.listen(4100, () => console.log('Auth GraphQL running...'));
