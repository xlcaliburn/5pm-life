'use strict';

import _ from 'lodash';
import enums from './enums.json';

// Gets a list of enums
export function index(req, res) {
	return res.json(enums);
}

// Gets all enums of a certain type and return as an array of key-value pairs
export function getByType(req, res) {
	var enumPairs = {};
	for(var tag in enums[req.params.type]){
		enumPairs[tag] = enums[req.params.type][tag].value;
	}
	return res.json(enumPairs);
}

// Gets all enums of a certain type and return the name values only
export function getByTypeNames(req, res) {
	var enumValues = [];
	var type = req.params.type;
	for (var val in enums[type]) {
		enumValues.push(enums[type][val]);
	}
	return res.json(enumValues);
}

// Gets all enums of a certain type and return everything
export function getByTypeAll(req, res) {
	return res.json(enums[req.params.type]);
}
