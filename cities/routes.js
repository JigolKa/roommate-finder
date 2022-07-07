"use strict";
const nearest = require("./handlers/nearest");

module.exports = function (app, opts) {
  app.get("/api/city", nearest);
};
