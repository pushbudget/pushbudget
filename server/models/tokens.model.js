'use strict';
let mongoose = require('mongoose'),
  deepPopulate = require('mongoose-deep-populate')(mongoose)

let tokensSchema = new mongoose.Schema({
    "institution": String,
    "public_token": String,
    "access_token":String,
    "user": { type: String, ref: "User"},
    "lastPull": Date
})

tokensSchema.plugin(deepPopulate)

module.exports = mongoose.model('Tokens', tokensSchema)
