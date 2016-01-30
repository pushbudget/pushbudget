'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let accountSchema = new mongoose.Schema({
  user: {type: String, ref: 'User'},
  institution_type: String,
  institution: {type: String, ref: 'Institution'},
  type: String,
  active: {type: Boolean, default: true},
  subtype: String,
  name: String,
  digits: String,
  created: {type: Date, default: Date.now}
})

accountSchema.plugin(deepPopulate)

module.exports = mongoose.model('Account', accountSchema)
