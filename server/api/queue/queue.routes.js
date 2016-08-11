import {Router} from 'express';

var mongoose = require('mongoose');
var Queue = mongoose.model('Queue');
var router = new Router();

router.get('/', function(req,res) {
	Queue.find(function(err, data) {
		if (err)
			res.send(err);

		res.json(data);
	});
});

