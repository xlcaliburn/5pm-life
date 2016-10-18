'use strict';

var express = require('express');
var controller = require('./queue.controller');
var matchmake = require('./queue.matchmake');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/status/:status', controller.getByStatus);
router.get('/user/:token', controller.getUserStatus);
router.get('/cancel/:token', controller.cancelEventSearch);

router.post('/', controller.create);
router.post('/triggerEvent', controller.triggerEvent);
router.post('/matchmake', matchmake.matchmake);

router.put('/:id', controller.update);

router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
