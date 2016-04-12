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
  Team.find(function (err, team) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(teams);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}