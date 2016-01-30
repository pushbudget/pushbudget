'use strict';
let mongoose = require('mongoose'),
  deepPopulate = require('mongoose-deep-populate')(mongoose)

let transactionSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User'
  },
  name: String,
  account: String,
  amount: Number,
  plaid_id: String,
  posted: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  category: String,
  tagged: {
    type: Boolean,
    default: false
  },
  manual: {
    type: Boolean,
    default: false
  }
});

transactionSchema.plugin(deepPopulate)

module.exports = mongoose.model('Transaction', transactionSchema)
