import {Router} from 'express';

var mongoose = require('mongoose');

var Venue = mongoose.model('Venue');
var Enums = mongoose.model('Enums');

var Tags 		= Enums.find({type : 'tag'});
var Activity 	= Enums.find({type : 'activity'});

var router = new Router();
router.get('/', function(req,res) {
		Venue.find(function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		Venue.create({
			tags : req.body.tags,
			venue_name : req.body.venue_name,
			address: {
				street: req.body.street,
				city: req.body.city,
				province: req.body.province,
				postal_code: req.body.postal_code
			}
		 }, function(err, data) {
			if (err)
				res.send(err);

			Venue.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
		});
	});

router.delete('/:venue_id', function(req, res) {
		Venue.remove({
			_id : req.params.venue_id
		}, function(err, data) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Venue.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
		});
	});

module.exports = router;