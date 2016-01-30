'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let institutionSchema = new mongoose.Schema({
  name: String,
  products: [{type: String}],
  logo: String,
  colors: Object,
  plaid_id: String,
  institution_type: String,
  added: {type: Date, default: Date.now}
})

institutionSchema.plugin(deepPopulate)

module.exports = mongoose.model('Institution', institutionSchema)
