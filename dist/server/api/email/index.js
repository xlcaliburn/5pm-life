'use strict';

var express = require('express');
var controller = require('./email.controller');

var router = express.Router();

// put routes here
router.post('/', controller.saveEmail);

module.exports = router;
//# sourceMappingURL=index.js.map
