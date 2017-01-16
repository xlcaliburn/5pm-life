'use strict';

import express from 'express';
import passport from 'passport';
import config from '../../config/environment';
import {setTokenCookie} from '../auth.service';
import {setMobileTokenCookie} from '../auth.service';
import {getTokenCookie} from '../auth.service';

var router = express.Router();

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me', 'public_profile', 'user_birthday'],
    failureRedirect: '/signup',
    session: false,
    callbackURL: config.facebook.callbackURL
  }))
  .get('/mobile/:fbid', getTokenCookie)
  .get('/mobileCallback', passport.authenticate('facebook', {
      session: false,
      mobile: true,
      callbackURL: config.facebook.mobileCallbackURL
  }), setMobileTokenCookie)
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false,
    callbackURL: config.facebook.callbackURL
  }), setTokenCookie);

export default router;
