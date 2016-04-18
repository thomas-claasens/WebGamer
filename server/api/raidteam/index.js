'use strict';

var express = require('express');
var controller = require('./raidteam.controller');

var router = express.Router();

router.get('/', controller.index);
router.put('/:id', controller.update);
module.exports = router;
