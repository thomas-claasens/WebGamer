'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  guild: String,
  realm: Boolean,
  members: [{ type: Schema.Types.ObjectId, ref: 'Battlenet' }]
  
});

module.exports = mongoose.model('Team', TeamSchema);