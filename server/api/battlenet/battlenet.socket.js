/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Battlenet = require('./battlenet.model');

exports.register = function(socket) {
  Battlenet.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Battlenet.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('battlenet:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('battlenet:remove', doc);
}