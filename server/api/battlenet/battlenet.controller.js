'use strict';

var _ = require('lodash');
var Battlenet = require('./battlenet.model');
var bnet = require('battlenet-api')('w2gwwu25wwnm2vhw8bb5a3wcq2yfuvj3');
// Get list of battlenets
exports.index = function (req, res) {
  bnet.wow.realmStatus({ origin: 'eu' }, function (err, data) { 
    console.log(data);
    return res.status(200).json(data);
  });
  // Battlenet.find(function (err, battlenets) {
  //   if(err) { return handleError(res, err); }
  //   return res.status(200).json(battlenets);
  // });
};

// Get a single battlenet
exports.show = function(req, res) {
  Battlenet.findById(req.params.id, function (err, battlenet) {
    if(err) { return handleError(res, err); }
    if(!battlenet) { return res.status(404).send('Not Found'); }
    return res.json(battlenet);
  });
};

// Creates a new battlenet in the DB.
exports.create = function(req, res) {
  Battlenet.create(req.body, function(err, battlenet) {
    if(err) { return handleError(res, err); }
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