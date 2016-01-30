'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let budgetSchema = new mongoose.Schema({
  user: {type: String, ref: 'User'},
  name: String,
  amount: {type: Number, default: 0},
  subbudgets: [{type: String, ref: 'SubBudget'}],
  created: {type: Date, default: Date.now},
  sum: {type: Number, default: 0},
  savings: {type: Number, default: 0}
})

budgetSchema.plugin(deepPopulate)

module.exports = mongoose.model('Budget', budgetSchema)
