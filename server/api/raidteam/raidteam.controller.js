/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Team = require('./raidteam.model');
var Member = require('./raidmember.model');

// Gets a list of Raidteams
exports.index = function(req, res) {
    Team.find().populate('members').exec(function(err, result) {
        return res.status(200).json(result);
    });
//   Team.find(function (err, team) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(team);
//   });
};
// Updates an existing battlenet in the DB.
exports.update = function(req, res) {
    console.log('Update called');
  if(req.body._id) { delete req.body._id; }
  Team.findById(req.params.id, function (err, battlenet) {
    if (err) { return handleError(res, err); }
    if(!battlenet) { return res.status(404).send('Not Found'); }
    var updated = _.merge(battlenet, req.body);
    updated.save(function (err) {
        if (err) { return handleError(res, err); }
        console.log(battlenet);
      return res.status(200).json(battlenet);
    });
  });
};
function handleError(res, err) {
    console.log(err);
  return res.status(500).send(err);
}