'use strict';

var express = require('express');
var controller = require('./enums.controller');

var router = express.Router();

router.get('/:type', controller.getByType);			// Standard call to return only key value pairs of a type
router.get('/name/:type/', controller.getByTypeNames); 	// To be handled client side, also returns other attributes
router.get('/all/:type', controller.getByTypeAll);

// To be removed
router.get('/', controller.index);


module.exports = router;
