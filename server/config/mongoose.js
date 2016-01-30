'use strict';
let mongoose = require("mongoose");
let secrets = require("./secrets")
mongoose.Promise = require("q").Promise;

module.exports = exports = {}

exports.db = function () {
  return mongoose.connect(`mongodb://${secrets.secrets.mongo_user}:${secrets.secrets.mongo_key}@ds039135.mongolab.com:39135/pushbudget`, function () {
    console.log('connected');
  });
}