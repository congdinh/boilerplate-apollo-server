import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
// import get from "lodash.get";
import models from "./models";
import schema from "./graphql";
import { connect } from "./external-libs/elasticsearch";
import { connect as connectMongoDB } from "./external-libs/mongoose";
import Logger from "./external-libs/winston";
import Redis from "./external-libs/redis";

require("dotenv").config();

const port = parseInt(process.env.PORT, 10) || 9007;
const playground = (process.env.APOLLO_PLAYGROUND === "true" && true) || false;
const introspection =
  (process.env.APOLLO_INTROSPECTION === "true" && true) || false;
const debug = (process.env.APOLLO_DEBUG === "true" && true) || false;
const apollo_path = process.env.APOLLO_PATH || "/graphql";

const whitelist = process.env.SERVER_REQUEST_WHITE_LIST;
const corsEnabled = process.env.SERVER_CORS_ENABLED;

async function init() {
  const Client = await connect();

  const app = express();
  const logger = new Logger("apollo", false);

  // parse application/json
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  let corsOptions = {
    origin: function(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed access!"));
      }
    }
  };

  const loggingMiddleware = (req, res, next) => {
    if (
      req.body.operationName &&
      !["IntrospectionQuery"].includes(req.body.operationName)
    ) {
      const getIP =
        (
          req.headers["X-Forwarded-For"] ||
          req.headers["x-forwarded-for"] ||
          ""
        ).split(",")[0] || req.client.remoteAddress;
      const ip = (getIP.length < 15 && getIP) || getIP.slice(7) || req.ip;
      const { query, ...body } = req.body;
      logger.info(`[GraphQL.request] ${ip}`, body);
    }
    next();
  };
  if (corsEnabled !== "true") {
    corsOptions = {};
  }

  app.use(cors(corsOptions));
  app.use(loggingMiddleware);

  // error handler
  app.use((err, req, res, next) => {
    // render the error page
    // logger.error(err.message);
    res.status(err.status || 500);
    res.json({ message: "Not allowed access!" });
  });

  // Append apollo to our API
  const server = new ApolloServer({
    schema,
    context: {
      Client,
      models,
      Redis
    },
    introspection,
    playground,
    debug,
    formatError: error => {
      // filter whatever errors your don't want to log
      logger.error(`[GraphQL.error]`, error);
      return {
        message: error.message,
        errorCode: (error.extensions && error.extensions.code) || null
      };
    }
    // formatResponse: response => {
    //   // don't log auth mutations or schema requests
    //   const name = Object.keys(get(response, "data") || { unknown: 0 })[0];
    //   if (!["__schema"].includes(name)) {
    //     logger.info(`[GraphQL.response] ${name}`, response);
    //   }
    //   return response;
    // }
  });
  server.applyMiddleware({ app, path: apollo_path, cors: false });

  connectMongoDB()
    .then(() => {
      logger.info("Mongo connect successful!");
      // The `listen` method launches a web server.
      app.listen(port, () => {
        logger.info(
          `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
        );
        logger.info(
          `Try your health check at: http://localhost:${port}${server.graphqlPath}/.well-known/apollo/server-health`
        );
      });
    })
    .catch(error => {
      logger.error(error);
      process.exit(1);
    });
}

init();
