'use strict';
let mongoose = require('mongoose'),
  deepPopulate = require('mongoose-deep-populate')(mongoose)

let splitTransactionSchema = new mongoose.Schema({

  transaction: {
    type: String,
    ref: "Transaction"
  },
  amount: Number
});

splitTransactionSchema.plugin(deepPopulate)

module.exports = mongoose.model('SplitTransaction', splitTransactionSchema)