'use strict';

var _express = require('express');

var mongoose = require('mongoose');

var Enums = mongoose.model('Enums');
var Tags = Enums.find({ type: 'tag' });

var router = new _express.Router();
router.get('/', function (req, res) {
	Tags.find(function (err, data) {
		if (err) res.send(err);

		res.json(data);
	});
});

router.post('/', function (req, res) {
	Enums.create({
		type: "tag",
		enum_name: req.body.tag_name
	}, function (err, data) {
		if (err) res.send(err);

		Tags.find(function (err, data) {
			if (err) res.send(err);
			res.json(data);
		});
	});
});

router.delete('/:tag_id', function (req, res) {
	Enums.remove({
		_id: req.params.tag_id
	}, function (err, data) {
		if (err) res.send(err);

		// get and return all the todos after you create another
		Tags.find(function (err, data) {
			if (err) res.send(err);
			res.json(data);
		});
	});
});

module.exports = router;
//# sourceMappingURL=routes.js.map
