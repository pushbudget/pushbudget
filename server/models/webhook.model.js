'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let webhookSchema = new mongoose.Schema({
  total_transactions: Number,
  code: Number,
  message: String,
  resolve: String,
  access_token: String,
  receivedAt: {type: Date, default: Date.now}
})

webhookSchema.plugin(deepPopulate)

module.exports = mongoose.model('Webhook', webhookSchema)
