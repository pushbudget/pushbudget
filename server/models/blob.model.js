'use strict';
let mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose)

let blobSchema = new mongoose.Schema({
  blob: Object
})

blobSchema.plugin(deepPopulate)

module.exports = mongoose.model('Blob', blobSchema)
