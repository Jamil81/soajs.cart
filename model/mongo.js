'use strict';
var soajs = require('soajs');
var Mongo = soajs.mongo;
var mongo;

var dbName = "cart";
var tbItems = "items";
var tbCart = "mycart";

function checkIfMongo(soajs) {
	if (!mongo) {
		mongo = new Mongo(soajs.registry.coreDB[dbName]);
	}
}

function validateId(id, cb) {
	try {
		return cb(null, mongo.ObjectId(id));
	}
	catch (e) {
		return cb(e);
	}
}

module.exports = {

	"getCart": function (soajs, cb) {
		checkIfMongo(soajs);
		validateId(soajs.inputmaskData.id, function (error, id) {
			if (error) {
				return cb(error);
			}
			mongo.findOne(tbCart, {"_id": id}, cb);
		});
	},

	"getItems": function (soajs, cb) {
		checkIfMongo(soajs);
		var options = {};
		if (soajs.inputmaskData.from && soajs.inputmaskData.to) {
			options = {
				start: soajs.inputmaskData.from,
				limit: soajs.inputmaskData.to
			};
		}
		mongo.find(tbItems, {}, options, cb);
	}
};