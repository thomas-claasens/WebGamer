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
var raidMember = require('../battlenet/battlenet.model');
// Gets a list of Raidteams
exports.index = function (req, res) {
  Team.find({}).populate('members').exec(function (err, result) {
    console.log(result);
    return res.status(200).json(result);
  });
};
// Updates an existing battlenet in the DB.
exports.update = function (req, res) {
  console.log('Update called');
  Team.findById(req.params.id, function (err, teamData) {

    raidMember.find({ name: req.body.name }).exec(function (err, memberData) {
      console.log('Searching for team member', req.body.name);

      if (memberData.length == 0) {
        console.log('Could not find member', req.body.name, ' Creating member');

        raidMember.create(req.body, function (err, battlenet) {
          if (err) { return handleError(res, err); }

          console.log('Created member ', req.body.name, ' Adding to raid team');
          teamData.members.push(battlenet);
          console.log(teamData.members);
          teamData.save();
          return res.status(201).json(battlenet);
        });
      } else { 
        console.log('Found member ', req.body.name , memberData[0]._id);
        Team.find({ _id: req.params.id, members: memberData[0]._id }).exec(function (err, responseValue) {
          console.log('Member already in the team');
          return res.status(200).json(memberData[0]);
        });
      }
    });
  });

};
function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}