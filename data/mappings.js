'use strict';

var path = require('path');
var Datastore = require('nedb');

var db = {
	mappings: new Datastore({ filename: path.join(__dirname, 'mappings.db'), autoload: true })
};


var mappings = {
	get: function(alias, callback){
	db.mappings.findOne({ alias: alias }, function(err, mapping){
		if (err || !mappings || null == mapping) {
			return callback(new Error('URL not found'), undefined);
		}
		callback(null, mapping.url);
	});
	},

	create: function(alias, url, callback){
		db.mappings.insert({ alias: alias, url: url }, callback);
	},

	list: function(callback) {
		      db.mappings.find({}).sort({alias: 1}).exec(callback);
      }
};


module.exports = mappings;
