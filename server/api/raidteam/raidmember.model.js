'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: String,
  guild: String,
  active: Boolean,
  role: {enum: ['TANK', 'HEALER', 'DPS']}
});

module.exports = mongoose.model('Member', MemberSchema);