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

router.post('/', function(req, res) {
	Queue.create({
		user : req.body.user._id,
		status : 1,
		search_parameters : req.body.search_parameters,
		queue_start_time : req.body.queue_start_time
	 }, function(err, data) {
		if (err)
			res.send(err);

		Queue.find(function(err, data) {
			if (err)
				res.send(err);
			res.json(data);
		});
	});
});

router.put('/:Queue_id', function(req, res) {
	Queue.findOneAndUpdate({
		_id : req.body._id
	}, 
	{ 
		activity : req.body.activity,
		venue : req.body.venue 
	}, {} , function(err, data) {
		if (err)
			res.send(err);


		Queue.find(function(err, data) {
			if (err)
				res.send(err);
			res.json(data);
		});
	});
});


module.exports = router;