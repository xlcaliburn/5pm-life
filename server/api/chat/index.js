'use strict';

import {Router} from 'express';
import * as auth from '../../auth/auth.service';
var controller = require('./chat.controller');
var express = require('express');

var router = express.Router();

router.get('/history/:event_id', controller.fetch);
router.post('/', controller.store);

module.exports = router;
