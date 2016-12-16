'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', controller.show);
router.get('/settings/:token', auth.isAuthenticated(), controller.getUserSettings);
router.get('/verification/user', auth.isAuthenticated(), controller.getUserVerification);
router.get('/:id/queue', controller.getQueueByUserid);
router.get('/:id/unqueue', controller.unqueueByUserId);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id', auth.hasRole('admin'), controller.updateById);

router.post('/', controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
