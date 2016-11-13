'use strict';

var express = require('express');
var controller = require('./activities.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);

router.delete('/:id', controller.destroy);
router.get('/:id', controller.show);
router.put('/:id', controller.updateById);

module.exports = router;
