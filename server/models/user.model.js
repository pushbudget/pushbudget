'use strict';
let mongoose = require('mongoose'),
  deepPopulate = require('mongoose-deep-populate')(mongoose)

let userSchema = new mongoose.Schema({
  userName: String,
  userPassword: String,
  email: String, //for later
  accounts: [{
    type: String,
    ref: 'Account'
  }],
  institutions: [{
    type: String,
    ref: 'Institution'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  budget: {
    type: String,
    ref: 'Budget',
    default: ''
  },
  savings: {
    type: Number,
    default: 0
  }
})

userSchema.plugin(deepPopulate)

module.exports = mongoose.model('User', userSchema)