var mongoose = require('mongoose');
var models = require('./model.js')(mongoose);

var Venue = mongoose.model('Venue');
var Enums = mongoose.model('Enums');

var Tags 		= Enums.find({type : 'tag'})
var Activity 	= Enums.find({type : 'activity'});

module.exports = function(app) {

	// Tags
	app.get('/api/tags', function(req,res) {
		Tags.find(function(err, data) {
			if (err)
				res.send(err)

			res.json(data);
		});
	});

	app.post('/api/tags', function(req, res) {
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

	app.delete('/api/tags/:tag_id', function(req, res) {
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

	// Activities
	app.get('/api/activities', function(req, res) {
		Activity.find(function(err,data) {
			if (err)
				res.send(err)

			res.json(data);
		});
	});

	app.post('/api/activities', function(req, res) {
		Enums.create({
				type : "activity",
				enum_name : req.body.activity_name
		 }, function(err, data) {
			if (err)
				res.send(err);

			Activity.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
		});
	});

	app.delete('/api/activities/:activity_id', function(req, res) {
		Enums.remove({
			_id : req.params.activity_id
		}, function(err, data) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Activity.find(function(err, data) {
				if (err)
					res.send(err)
				res.json(data);
			});
		});
	});	

	// Venues
	app.get('/api/venues', function(req, res) {
		Venue.find(function(err,data) {
			if (err)
				res.send(err)

			res.json(data);
		});
	});

	app.post('/api/venues', function(req, res) {
		Venue.create({
			activity : req.body.activity,
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

	app.delete('/api/venues/:venue_id', function(req, res) {
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

	app.get('*', function(req, res) {
		res.sendFile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};