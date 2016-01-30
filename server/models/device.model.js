'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let deviceSchema = new mongoose.Schema({
  user: {type: String, ref: 'User'},
  uuid: String,
  model: String,
  platform: String,
  version: String,
  cordova: String,
  added: {type: Date, default: Date.now}
})

deviceSchema.plugin(deepPopulate)

module.exports = mongoose.model('Device', deviceSchema)
