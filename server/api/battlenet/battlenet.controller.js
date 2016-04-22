'use strict';

var _ = require('lodash');
var Battlenet = require('./battlenet.model');
var bnet = require('battlenet-api')('qrfwx6c29zs8g2hw8ze2qz7yke9r36v2');
// Get list of battlenets
exports.index = function (req, res) {
  bnet.wow.realmStatus({ origin: 'eu' }, function (err, data) { 
    return res.status(200).json(data);
  });
};

exports.showCharacterInfo = function(req, res) {
//:realm/:name
    var realm = req.params.realm;
    var toonName = req.params.charName;
    
   toonName = require('querystring').escape(toonName);
    
    var searchData = { 
        origin: 'eu', 
        realm: realm, 
        name: toonName, 
        fields: ['items', 'progression', 'feed']
    };
    bnet.wow.character.aggregate(searchData, function (err, data) {
      console.log(data);
        return res.json(data);        
    }); 
};
// Get a single battlenet
exports.show = function (req, res) {
  var tag = req.params.tag;
  tag = 'ONeX%232407';
  bnet.d3.profile.career({ origin: 'eu', tag: tag }, function (err, data) {
    // console.log(err);
    // console.log(data);
    return res.json(data);
   });
 
};
exports.showClasses = function (req, res) {
    bnet.wow.data.characterClasses({ origin: 'eu' }, function(err, data) {
        // console.log(data);
        // console.log(err);
        return res.json(data);
     });
};

exports.showGuild = function (req, res) {
    var tag = req.params.realm;
    var guildName = req.params.guild;
   // console.log(tag);
   // console.log(guildName);
    bnet.wow.guild.aggregate({ origin: 'eu', realm: 'silvermoon', name: 'Forward%20%C3%BAnto%20Dawn', fields: ['members', 'achievements', 'Progression'] }, function(err, data) {
       // console.log(data);
       // console.log(err);
        return res.json(data);
     });
};
// Creates a new battlenet in the DB.
exports.create = function(req, res) {
  Battlenet.create(req.body, function(err, battlenet) {
      if (err) { return handleError(res, err); }
      // console.log(battlenet);
    return res.status(201).json(battlenet);
  });
};

// Updates an existing battlenet in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Battlenet.findById(req.params.id, function (err, battlenet) {
    if (err) { return handleError(res, err); }
    if(!battlenet) { return res.status(404).send('Not Found'); }
    var updated = _.merge(battlenet, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(battlenet);
    });
  });
};

// Deletes a battlenet from the DB.
exports.destroy = function(req, res) {
  Battlenet.findById(req.params.id, function (err, battlenet) {
    if(err) { return handleError(res, err); }
    if(!battlenet) { return res.status(404).send('Not Found'); }
    battlenet.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}