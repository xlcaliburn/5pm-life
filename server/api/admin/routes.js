import {Router} from 'express';

var mongoose = require('mongoose');
var models = require('./model.js')(mongoose);

var Venue = mongoose.model('Venue');
var Enums = mongoose.model('Enums');

var Tags 		= Enums.find({type : 'tag'});
var Activity 	= Enums.find({type : 'activity'});

var router = new Router();
router.get('/', function(req,res) {
		Tags.find(function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		Enums.create({
				type : "tag",
				enum_name : req.body.tag_name
		 }, function(err, data) {
			if (err)
				res.send(err);

			Tags.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
		});
	});

router.delete('/:tag_id', function(req, res) {
		Enums.remove({
			_id : req.params.tag_id
		}, function(err, data) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Tags.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
		});
	});

module.exports = router;
