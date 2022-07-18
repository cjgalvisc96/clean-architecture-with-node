require("dotenv").config();
const express = require("express");
const routes = require("./frameworks/expressSpecific/routes");
const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "/api/v1";
const dependencies = require("./config/dependencies");

module.exports = {
  start: () => {
    // Midlewares
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    // Routes
    app.use(API_PREFIX, routes(dependencies));

    // Common Error handler
    app.listen(PORT, () => {
      console.log(`WOHOOO our server is running under port ${PORT}`);
    });
  },
};
