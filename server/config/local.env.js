'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:3000',
  SESSION_SECRET: 'fivepm-secret',

  FACEBOOK_ID: '1270748296308656',
  FACEBOOK_SECRET: '5faf97872583c524af9b44db607743e4',
  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
