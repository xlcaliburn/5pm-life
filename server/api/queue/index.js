'use strict';
import {Router} from 'express';
var express = require('express');
var controller = require('./queue.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:type', controller.getByType);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;