"use strict";
const nearestCities = require("find-nearest-cities");

module.exports = function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query.lat && req.query.lng) {
    const cities = nearestCities(
      parseFloat(req.query.lat),
      parseFloat(req.query.lng),
      req.query.dist ? parseInt(req.query.dist) : 50000,
      req.query.max ? parseInt(req.query.max) : 50
    );
    res.json({
      cities,
    });
  } else {
    res.json({ message: "Latitude and longitude not provided" });
  }
};
