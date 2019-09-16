require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { schema: rootSchema, resolvers: rootResolvers } = require("./schema");

import * as AuthLib from "@nebulario/microservice-auth-common";

const INTERNAL_URL_ACCOUNT_GRAPH = process.env["INTERNAL_URL_ACCOUNT_GRAPH"];
const INTERNAL_HOST_CACHE = process.env["INTERNAL_HOST_CACHE"];
const INTERNAL_PORT_CACHE = process.env["INTERNAL_PORT_CACHE"];
const INTERNAL_URL_DATA = process.env["INTERNAL_URL_DATA"];
const ROUTE_GRAPH = process.env["ROUTE_GRAPH"];
const INTERNAL_PORT_GRAPH = process.env["INTERNAL_PORT_GRAPH"];
const SECRET_PASSWORD_CACHE = process.env["SECRET_PASSWORD_CACHE"];

var app = express();
var { passport } = AuthLib.init({
  app,
  cache: {
    host: INTERNAL_HOST_CACHE,
    port: INTERNAL_PORT_CACHE,
    secret: SECRET_PASSWORD_CACHE
  },
  accounts: {
    url: INTERNAL_URL_ACCOUNT_GRAPH
  }
});

const schema = makeExecutableSchema({
  typeDefs: rootSchema,
  resolvers: rootResolvers
});

app.use(
  ROUTE_GRAPH,
  graphqlHTTP(request => ({
    schema: schema,
    graphiql: true,
    context: {
      passport,
      request,
      services: {
        accounts:{
          url: INTERNAL_URL_ACCOUNT_GRAPH
        }
      }
    }
  }))
);
app.listen(INTERNAL_PORT_GRAPH, () => console.log("Auth GraphQL running..."));

function shutdown(signal) {
  return async function(err) {
    console.log(`${signal}...`);
    if (err) {
      console.error(err.stack || err);
    }

    setTimeout(() => {
      process.exit(err ? 1 : 0);
    }, 500).unref();
  };
}

process
  .on("SIGTERM", shutdown("SIGTERM"))
  .on("SIGINT", shutdown("SIGINT"))
  .on("uncaughtException", shutdown("uncaughtException"));
