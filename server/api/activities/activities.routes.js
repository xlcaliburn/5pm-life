import {Router} from 'express';

var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');

var router = new Router();

router.get('/', function(req,res) {
		Activity.find(function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		Activity.create({
				activity_name : req.body.activity_name,
				tags : req.body.tags,
				allowed_capacity : req.body.allowed_capacity,
				required_equipment : req.body.required_equipment 
		 }, function(err, data) {
			if (err)
				res.send(err);

			Activity.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});

router.delete('/:activity_id', function(req, res) {
		Activity.remove({
			_id : req.params.activity_id
		}, function(err, data) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Activity.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});

module.exports = router;