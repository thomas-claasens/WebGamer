'use strict';

var express = require('express');
var controller = require('./battlenet.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/diablo/:tag', controller.show);
router.get('/wow/:realm/:guild', controller.showGuild);
router.get('/wow/classes', controller.showClasses);
router.get('/wow/char/:realm/:charName', controller.showCharacterInfo);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;