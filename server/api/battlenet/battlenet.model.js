'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BattlenetSchema = new Schema({
    achievementPoints: Number,
    battlegroup: String,
    class: Number,
    className: String,
    gender: Number,
    guild: String,
    guildRealm: String,
    lastModified: Number,
    level: Number,
    name: String,
    race: String,
    realm: String,
    spec: {
        backgroundImage: String,
        description: String,
        icon: String,
        name: String,
        order: Number,
        role:String
    },
    thumbnail: String
});

module.exports = mongoose.model('Battlenet', BattlenetSchema);