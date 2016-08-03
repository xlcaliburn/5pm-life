import {Router} from 'express';

var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var router = new Router();
router.get('/', function(req,res) {
		Event.find(function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		Event.create({
				activity : req.body.activity,
				dt_start : req.body.dt_start,
				dt_end : req.body.dt_end,
				dt_created : req.body.dt_created,
				status : "Active",
				users : req.body.users
		 }, function(err, data) {
			if (err)
				res.send(err);

			Event.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});

module.exports = router;