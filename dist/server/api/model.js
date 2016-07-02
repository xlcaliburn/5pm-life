'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Enum table for tags
module.exports = function (mongoose) {
	var _ref, _venue;

	var Enums = new Schema({
		type: String,
		enum_name: String,
		enum_value: String
	});

	var Venue = new Schema((_ref = {
		venue_name: String,
		activity: [{
			activity_name: String
		}],
		address: {
			street: String,
			city: String,
			province: String,
			postal_code: String,
			country: String
		},
		category: [String] }, (0, _defineProperty3.default)(_ref, 'activity', [String]), (0, _defineProperty3.default)(_ref, 'tags', [String]), _ref));

	// Internal use for filtering
	var Event = new Schema({
		activity: String,
		venue: (_venue = {
			venue_name: String,
			activity: [{
				activity_name: String
			}],
			address: {
				street: String,
				city: String,
				province: String,
				postal_code: String,
				country: String
			},
			category: [String] }, (0, _defineProperty3.default)(_venue, 'activity', [String]), (0, _defineProperty3.default)(_venue, 'tags', [String]), _venue),
		// Internal use for filtering			
		dt_start: Date,
		dt_end: Date,
		status: String,
		users: [ObjectId]
	});

	var models = {
		Enums: mongoose.model('Enums', Enums),
		Venue: mongoose.model('Venue', Venue),
		Event: mongoose.model('Event', Event)
	};

	return models;
};
//# sourceMappingURL=model.js.map
