'use strict';
import {Router} from 'express';
import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./events.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/admin/:id', auth.isAuthenticated(), controller.admin_show);
router.get('/attendees/:event_id', auth.isAuthenticated(), controller.getAttendees);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/confirm', auth.isAuthenticated(), controller.confirmEvent);
router.post('/decline', auth.isAuthenticated(), controller.declineEvent);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
