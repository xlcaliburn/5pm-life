'use strict';
import {Router} from 'express';
var express = require('express');
var controller = require('./queue.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/status/:status', controller.getByStatus);
router.get('/user/:token', controller.getUserStatus)
router.get('/cancel/:token', controller.cancelEventSearch);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/status', controller.updateMultipleStatus);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
