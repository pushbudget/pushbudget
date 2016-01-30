'use strict';
let mongoose = require('mongoose'),
  deepPopulate = require('mongoose-deep-populate')(mongoose)

let subBudgetSchema = new mongoose.Schema({
  budget: {
    type: String,
    ref: 'Budget'
  },
  name: String,
  user: {
    type: String,
    ref: 'User'
  },
  allocated: Number,
  category: String,
  created: {
    type: Date,
    default: Date.now
  },
  transactions: [{
    type: String,
    ref: 'Transaction'
  }],
  splits: [{
    type: String,
    ref: 'SplitTransaction'
  }],
  color: String,
  goodData: Boolean,
  totalDisplay: String,
  sum: Number
})

subBudgetSchema.plugin(deepPopulate)

module.exports = mongoose.model('SubBudget', subBudgetSchema)
