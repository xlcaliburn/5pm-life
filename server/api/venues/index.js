'use strict';

var express = require('express');
var controller = require('./venues.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

module.exports = router;
