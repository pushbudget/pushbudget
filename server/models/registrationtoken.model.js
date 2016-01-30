'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let regtokenSchema = new mongoose.Schema({
  token: Object,
  user: {type: String, ref: 'User'}
})

regtokenSchema.plugin(deepPopulate)

module.exports = mongoose.model('RegToken', regtokenSchema)
