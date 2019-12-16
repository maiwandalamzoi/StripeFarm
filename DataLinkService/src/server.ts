/**
 * Class run on startup of the server
 */
import http from "http";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import routes from "./services";
import { runDataRetrievers } from "./middleware/index";

const express = require('express');
const router = express();

// Let the routers use a json format.
router.use(express.json());

// Apply the middleware to the server.
applyMiddleware(middleware, router);

// Apply the routes to the server.
applyRoutes(routes, router);

// Run the data retrievers on start up, to periodically save data to the database.
runDataRetrievers();

// Run the server on port 3000.
const { PORT = 3000 } = process.env;
const server = http.createServer(router);

server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);
