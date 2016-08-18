'use strict';

var express = require('express');
var controller = require('./enums.controller');

var router = express.Router();

router.get('/:type', controller.getByType);			// Standard call to return only key value pairs of a type
router.get('/name/:type/', controller.getByTypeNames); 	// To be handled client side, also returns other attributes
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

// To be removed
router.get('/', controller.index);
router.get('/:id', controller.show);
router.patch('/:id', controller.update);


module.exports = router;