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

router.get('/:event_id', function(req,res) {
	Event.find({
		id : req.params.event_id
	}, function(err, data) {
		if (err)
			res.send(err);

		res.json(data);
	});
});

router.post('/', function(req, res) {
	Event.create({
			activity : req.body.activity,
			venue : req.body.venue,
			dt_start : req.body.dt_start,
			dt_end : req.body.dt_end,
			dt_search_start : req.body.dt_search_start,
			status : "Pending",
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

router.put('/', function(req, res) {
	Event.findOneAndUpdate({
		_id : req.body._id
	}, 
	{ 
		activity : req.body.activity,
		venue : req.body.venue 
	}, {} , function(err, data) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Event.find(function(err, data) {
			if (err)
				res.send(err);
			res.json(data);
		});
	});
});


router.delete('/:event_id', function(req, res) {
	Event.remove({
		_id : req.params.event_id
	}, function(err, data) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Event.find(function(err, data) {
			if (err)
				res.send(err);
			res.json(data);
		});
	});
});

module.exports = router;