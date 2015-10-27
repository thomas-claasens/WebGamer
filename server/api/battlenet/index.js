'use strict';

var express = require('express');
var controller = require('./battlenet.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/diablo/:tag', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;