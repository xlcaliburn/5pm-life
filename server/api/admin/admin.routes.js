import {Router} from 'express';

var mongoose = require('mongoose');

var AdminSettings = mongoose.model('AdminSettings');

var router = new Router();
router.get('/', function(req,res) {
		AdminSettings.find(function(err, data) {
			if (err)
				res.send(err);

			res.json(data);
		});
	});

router.post('/', function(req, res) {
		AdminSettings.create({

		 }, function(err, data) {
			if (err)
				res.send(err);

			AdminSettings.find(function(err, data) {
				if (err)
					res.send(err);
				res.json(data);
			});
		});
	});

module.exports = router;