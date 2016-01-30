'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let pbCategorySchema = new mongoose.Schema({
  descriptors: [{type: 'String'}],
  plaid_id: String,
  primary: String,
  type: String,
  created: {type: Date, default: Date.now},
  pbcat: {type: String, ref: 'PBCategory'}
})

pbCategorySchema.plugin(deepPopulate)

module.exports = mongoose.model('PBCategory', pbCategorySchema)
