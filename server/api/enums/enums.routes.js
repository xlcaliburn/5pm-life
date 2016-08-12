import {Router} from 'express';

var mongoose = require('mongoose');
var Enums = mongoose.model('Enums');
var router = new Router();

router.get('/', function(req,res) {
		Enums.find(function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		Enums.create({
				type : req.body.type,
				list : req.body.list
				
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
