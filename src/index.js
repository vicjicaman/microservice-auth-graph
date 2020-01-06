require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { schema: rootSchema, resolvers: rootResolvers } = require("./schema");

import * as GraphCommon from "@nebulario/microservice-graph-common";
import * as AuthLib from "@nebulario/microservice-auth-common";
import * as Utils from "@nebulario/microservice-utils";
import * as Logger from "@nebulario/microservice-logger";

const ENV_MODE = process.env["ENV_MODE"];
const ENV_LOG_FOLDER = process.env["ENV_LOG_FOLDER"];

const ACCOUNT_INTERNAL_URL_GRAPH = process.env["ACCOUNT_INTERNAL_URL_GRAPH"];
const AUTH_CACHE_INTERNAL_HOST = process.env["AUTH_CACHE_INTERNAL_HOST"];
const AUTH_CACHE_INTERNAL_PORT = process.env["AUTH_CACHE_INTERNAL_PORT"];
const AUTH_ROUTE_GRAPH = process.env["AUTH_ROUTE_GRAPH"];
const AUTH_INTERNAL_PORT_GRAPH = process.env["AUTH_INTERNAL_PORT_GRAPH"];
const AUTH_CACHE_SECRET_PASSWORD = process.env["AUTH_CACHE_SECRET_PASSWORD"];

const AUTH_QUEUE_SECRET_USER = process.env["AUTH_QUEUE_SECRET_USER"];
const AUTH_QUEUE_SECRET_PASSWORD = process.env["AUTH_QUEUE_SECRET_PASSWORD"];
const AUTH_QUEUE_INTERNAL_HOST = process.env["AUTH_QUEUE_INTERNAL_HOST"];
const AUTH_QUEUE_INTERNAL_PORT = process.env["AUTH_QUEUE_INTERNAL_PORT"];

const AUTH_EMAIL_CLIENTID = process.env["AUTH_EMAIL_CLIENTID"];
const AUTH_EMAIL_CLIENT = process.env["AUTH_EMAIL_CLIENT"];
const AUTH_EMAIL_REFRESH = process.env["AUTH_EMAIL_REFRESH"];

const AUTH_EVENTS_QUEUE_NAME = "auth.accounts.events";

const cxt = {
  secrets: {
    token: { private: AUTH_TOKEN_PRIVATE, public: AUTH_TOKEN_PUBLIC },
    mail: {
      refresh: AUTH_EMAIL_REFRESH,
      client: AUTH_EMAIL_CLIENT,
      clientid: AUTH_EMAIL_CLIENTID
    }
  },
  services: {
    mail: null,
    queue: null,
    events: {
      queue: AUTH_EVENTS_QUEUE_NAME
    },
    accounts: {
      url: ACCOUNT_INTERNAL_URL_GRAPH
    }
  },
  env: {
    mode: ENV_MODE,
    logs: {
      folder: ENV_LOG_FOLDER
    }
  },
  logger: null
};

cxt.logger = Logger.create({ path: ENV_LOG_FOLDER });

(async () => {
  await EmailModel.init(cxt);

  const app = express();
  Logger.Service.use(app, cxt);

  const { passport } = AuthLib.init(
    {
      app,
      cache: {
        host: AUTH_CACHE_INTERNAL_HOST,
        port: AUTH_CACHE_INTERNAL_PORT,
        secret: AUTH_CACHE_SECRET_PASSWORD
      },
      accounts: {
        url: ACCOUNT_INTERNAL_URL_GRAPH
      }
    },
    cxt
  );

  cxt.services.queue = await GraphCommon.Queue.connect(
    "auth",
    {
      queues: [
        {
          name: AUTH_EVENTS_QUEUE_NAME,
          type: "exchange",
          mode: "fanout"
        }
      ]
    },
    {
      host: AUTH_QUEUE_INTERNAL_HOST,
      port: AUTH_QUEUE_INTERNAL_PORT,
      user: AUTH_QUEUE_SECRET_USER,
      password: AUTH_QUEUE_SECRET_PASSWORD
    },
    cxt
  );

  const schema = makeExecutableSchema({
    typeDefs: rootSchema,
    resolvers: rootResolvers
  });

  app.get("/auth/backend/validate", function(req, res) {
    const token = req.query.token;
    cxt.logger.debug("auth.route.validation", { token });
    AccountModel.validate(null, token, cxt).finally(rs =>
      res.redirect("/auth")
    );
  });

  app.use(
    AUTH_ROUTE_GRAPH,
    graphqlHTTP(request => ({
      schema: schema,
      graphiql: true,
      context: {
        ...cxt,
        passport,
        request
      }
    }))
  );
  app.listen(AUTH_INTERNAL_PORT_GRAPH, () =>
    cxt.logger.info("service.running", { port: AUTH_INTERNAL_PORT_GRAPH })
  );
})().catch(e => cxt.logger.error("service.error", { error: e.toString() }));

Utils.Process.shutdown(signal =>
  cxt.logger.info("service.shutdown", { signal })
);
