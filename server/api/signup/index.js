'use strict';

var express = require('express');
var controller = require('./signup.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

// put routes here
router.post('/', auth.isAuthenticated(), controller.validate_save);

module.exports = router;
