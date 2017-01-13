'use strict';
import {Router} from 'express';
import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./preferences.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);

router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;
