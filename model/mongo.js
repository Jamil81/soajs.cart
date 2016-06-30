'use strict';
var Mongo = require('soajs').mongo;
var mongo;

var dbName = "shoppingcart";
var collName = "carts";

function checkIfMongo(soajs) {
	if (soajs.inputmaskData.dbname) {
		dbName = soajs.inputmaskData.dbname;
	}
	if (!mongo) {
		mongo = new Mongo(soajs.registry.coreDB[dbName]);
	}
}

module.exports = {
	
	"getCart": function (soajs, cb) {
		checkIfMongo(soajs);
		var options = {fields: {items: 1}};
		var userId = soajs.inputmaskData.userId;
		mongo.findOne(collName, {"user.id": userId}, options, cb);
	},
	
	"setCart": function (soajs, cb) {
		checkIfMongo(soajs);
		
		var curTime = new Date().getTime();
		var myUrac = soajs.session.getUrac();
		var userId = myUrac._id.toString();
		
		var username = myUrac.username;
		var input = {
			"user": {
				"id": userId,
				"username": username
			},
			"tenantid": myUrac.tenant.id,
			"created": curTime
		};
		
		mongo.update(collName, {"user.id": userId},
			{
				"$setOnInsert": input,
				"$set": {
					"items": soajs.inputmaskData.items,
					"modified": curTime
				}
			},
			{"multi": false, "upsert": true, "safe": true}, cb);
	},
	
	"emptyCart": function (soajs, cb) {
		checkIfMongo(soajs);
		var userId = soajs.session.getUrac()._id.toString();
		
		mongo.count(collName, {"user.id": userId}, function (error, count) {
			if (!count) {
				return cb(null, true);
			}
			var updateRec = {
				"$set": {
					"items": []
				}
			};
			mongo.update(collName, {"user.id": userId}, updateRec, {"multi": false, "upsert": false, "safe": true}, cb);
		});
	},
	
	"getCarts": function (soajs, cb) {
		checkIfMongo(soajs);
		var options = {
			start: soajs.inputmaskData.start,
			limit: soajs.inputmaskData.limit
		};
		
		mongo.find(collName, {}, {}, options, cb);
	},
	
	"addCart": function (soajs, cb) {
		checkIfMongo(soajs);
		console.log( "Adding CArt");
		var curTime = new Date().getTime();
		var userId = soajs.inputmaskData.userId;
		var username = soajs.inputmaskData.userName;
		var tenantId = soajs.inputmaskData.tenantId;

		console.log(soajs.inputmaskData);
		console.log(username);
		var input = {
			"user": {
				"id": userId,
				"username": username
			},
			"tenantid": tenantId,
			"created": curTime
		};
		
		mongo.update(collName, {"user.id": userId},
			{
				"$setOnInsert": input,
				"$set": {
					"items": soajs.inputmaskData.items,
					"modified": curTime
				}
			},
			{"multi": false, "upsert": true, "safe": true}, cb);
	}
	
};