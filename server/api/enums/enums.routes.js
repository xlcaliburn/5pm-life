import {Router} from 'express';

var mongoose = require('mongoose');
var Enums = mongoose.model('Enums');
var router = new Router();

router.get('/activities', function(req,res) {
		Enums.find({
			enum_type : "activity"
		}, function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.get('/tags', function(req,res) {
		Enums.find({
			enum_type : "tag"
		}, function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		Enums.create({
				enum_type : req.body.enum_type,
				enum_name : req.body.enum_name
		 }, function(err, data) {
			if (err)
				res.send(err);

			Enums.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});

router.delete('/:enum_id', function(req, res) {
		Enums.remove({
			_id : req.params.enum_id
		}, function(err, data) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Enums.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});

module.exports = router;
