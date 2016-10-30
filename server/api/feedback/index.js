'use strict';

import {Router} from 'express';
import * as auth from '../../auth/auth.service';

var controller = require('./feedback.controller');
var express = require('express');
var router = express.Router();

router.get('/', controller.fetch);
router.post('/', auth.isAuthenticated(), controller.save);

module.exports = router;
