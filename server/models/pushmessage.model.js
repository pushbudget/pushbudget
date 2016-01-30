'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let pushMessageSchema = new mongoose.Schema({
  content: String,
  device: {type: String, ref: 'Device'},
  user: {type: String, ref: 'User'},
  created: {type: Date, default: Date.now}
})

pushMessageSchema.plugin(deepPopulate)

module.exports = mongoose.model('PushMessage', pushMessageSchema)
