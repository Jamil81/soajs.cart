"use strict";
var assert = require("assert");
var async = require("async");
var request = require("request");
var Chance = require('chance');

var helper = require("../helper");
// var config = helper.requireModule('./config');
var extKey = helper.getKey();
var mongo = helper.getMongo();

var globalMe = {};

function generateRandomItem() {
	var chance = new Chance(Math.random);
	return {
		"productId": chance.string({length: 8, pool: '1234567890'}),
		"title": chance.word({length: 7}),
		"imagePath": "",
		"price": chance.integer({min: 20, max: 2000}),
		"groupId": chance.string({length: 8, pool: '1234567890'}),
		"merchantId": chance.string({length: 8, pool: '1234567890'}),
		"GTIN": chance.string({length: 10, pool: '1234567890'}),
		"currency": "USD",
		"quantity": chance.integer({min: 1, max: 12}),
		"shippingPrice": chance.integer({min: 1, max: 70}),
		"shippingMethods": [
			{
				"id": 1,
				"methodeName": "Client Pickup",
				"price": chance.dollar(),
				"selected": "true"
			},
			{
				"id": 2,
				"methodeName": "Liban Post",
				"price": chance.dollar(),
				"selected": "false"
			},
			{
				"id": 3,
				"methodeName": "Urgent Delivery",
				"price": chance.dollar(),
				"selected": "false"
			}
		],
		"filters": {
			"color": ["black", "white"],
			"weight": chance.natural({min: 1, max: 12}) + "g"
		}
	};
}

// reusable function for executing requests
function executeMyRequest(params, apiPath, method, cb) {

	requester(apiPath, method, params, function (error, body) {
		assert.ifError(error);
		assert.ok(body);
		return cb(body);
	});

	function requester(apiName, method, params, cb) {
		var options = {
			uri: 'http://localhost:4000/shoppingCart/' + apiName,
			headers: {
				'Content-Type': 'application/json',
				key: extKey
			},
			json: true
		};

		if (params.headers) {
			for (var h in params.headers) {
				if (params.headers.hasOwnProperty(h)) {
					options.headers[h] = params.headers[h];
				}
			}
		}

		if (params.form) {
			options.body = params.form;
		}

		if (params.qs) {
			options.qs = params.qs;
		}
		else
		{
			options.qs = {};
		}

		options.qs.dbname = "test_shoppingcart";


		request[method](options, function (error, response, body) {
			assert.ifError(error);
			assert.ok(body);
			return cb(null, body);
		});
	}
}

describe("Testing Service APIs", function () {
	var soajsauth;
	var userId;
	var tenantId;
	before(function (done) {
		console.log("------------------------ About to Run Tests for SOAJS.CART ------------------------");
		done();
	});

	beforeEach(function (done) {
		console.log("============================================================================== ");
		done();
	});
o

	it("Login User", function (done) {

		console.log("============================================================================== ");
		console.log(" User about to login ");
		console.log("============================================================================== ");
		var loginParams = {
			uri: 'http://127.0.0.1:4000/urac/login',
			body: {
				/*
				 "username": "user1",
				 "password": "123456"
				 */
				"username": "jamil",
				"password": "password"
			},
			headers: {
				'key': extKey
			}
		};

		//executeMyRequest(loginParams, 'http://127.0.0.1:4000/urac/login', 'post', function (error, body) {
		// requester('http://127.0.0.1:4000/urac/login', 'post', loginParams, function (error, body){
		helper.requester('post', loginParams, function (err, body) {
			assert.ifError(err);
			assert.ok(body);
			assert.equal(body.result, true);
			assert.ok(body.soajsauth);
			console.log(JSON.stringify(body.data, null, 2));
			userId = body.data._id.toString();
			tenantId = body.data.tenant.id.toString();
			// ****** add this to the headers, for example if you need all you subsequent tests to be in private mode
			soajsauth = body.soajsauth;
			done();
		});

	});


	describe("Full Testing Empty Cart API:", function () {

		it('Simple Empty Cart', function (done) {
			var params = {
				qs: {
					userId: userId
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
				console.log(JSON.stringify(body, null, 2));
				assert.ok(body.result);
				assert.ok(!body.errors);
				assert.equal(body.result, true);
				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});

		it('Empty Cart on emptied items', function (done) {
			var params = {
				qs: {
					userId: userId
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
				assert.ok(body.result);
				assert.ok(!body.errors);
				assert.equal(body.result, true);
				console.log(JSON.stringify(body, null, 2));

				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});

		it('empty Cart when fake user provided', function (done) {
			var params = {
				qs: {
					userId: 123
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
				assert.ok(!body.result);
				assert.ok(body.errors);
				assert.equal(body.errors.codes[0], 401, "Illegal user provided");
				done();
			});
		});

		it('Wrong model', function (done) {
			var params = {
				qs: {
					userId: userId,
					model: "testModel"
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
				assert.ok(!body.result);
				assert.ok(body.errors);
				done();
			});
		});

		it('select dbname', function (done) {
			var params = {
				qs: {
					userId: userId,
					dbname: "test_shoppingcart"
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
				assert.ok(body.result);
				assert.ok(!body.errors);
				done();
			});
		});


		it('No cart', function (done) {
			var params = {
				qs: {
					userId: userId
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			mongo.testCase.remove('carts', {"user.id": userId}, function (error) {
				assert.ifError(error);
				console.log("Removed the carts  of user: " + userId);
				console.log( mongo.testCase );
				executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
					console.log("-------");
					console.log(body);
					//process.exit(0);
					done();
				});
			});
		});

	});

	describe("Testing Actions on empty data", function () {

		it('empty Cart on empty db', function (done) {
			var params = {
				qs: {
					userId: userId
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
				assert.ok(body.result);
				assert.ok(!body.errors);
				assert.equal(body.result, true);
				console.log(JSON.stringify(body, null, 2));

				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});

		it('getCart on empty db', function (done) {
			var params = {
				qs: {
					userId: userId
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/getCart', 'get', function (body) {
				// console.log(JSON.stringify(body, null, 2) );
				assert.ok(body.result);
				assert.deepEqual(body.data, [], "Empty string ok");
				done();
			});
		});

		it('Add items', function (done) {

			// Instantiate Chance so it can be used
			var chance = new Chance();

			// Use Chance here.
			var my_random_string = chance.string();
			console.log("This is chance");
			console.log(my_random_string);

			var params = {
				qs: {
					userId: userId
				},
				form: {
					"items": [generateRandomItem()
					]
				},
				headers: {
					"Content-Type": "application/json",
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/setCart', 'post', function (body) {
				assert.ok(body.result);
				console.log(JSON.stringify(body, null, 2));

				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});

	});

	describe("Testing on filled DB", function () {

		it(' Bulk Add items', function (done) {


			// Instantiate Chance so it can be used
			var chance = new Chance();

			var items = [];
			var numberItems = globalMe["numberItems"] = chance.integer({min: 1, max: 20});

			for (var i = 0; i < numberItems; i++) {
				items[i] = generateRandomItem();
			}// end loop

			console.log(items);
			var params = {
				qs: {
					userId: userId
				},
				form: {
					"items": items
				},
				headers: {
					"Content-Type": "application/json",
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/setCart', 'post', function (body) {
				assert.ok(body.result);
				// console.log(JSON.stringify(body, null, 2));
				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});

		it('getCart', function (done) {
			var params = {
				qs: {
					userId: userId
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/getCart', 'get', function (body) {
				assert.ok(body.result);
				assert.equal(body.data.length, globalMe["numberItems"], body.data.length + " Items should be equal to " + globalMe["numberItems"]);
				done();
			});
		});

		it('getCarts', function (done) {
			var params = {
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/getCarts', 'get', function (body) {
				assert.ok(body.result);
				done();
			});
		});

	});

	describe("Testing Error messages", function () {

		console.log("============================================================================== ");
		console.log(" Now testing error messages ");
		console.log("============================================================================== ");

		it('getCart when no user provided', function (done) {
			var params = {
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/getCart', 'get', function (body) {
				assert.ok(!body.result);
				assert.ok(body.errors);
				assert.equal(body.errors.codes[0], 172, "No user provided");
				done();
			});
		});

		it('getCart when fake user provided', function (done) {
			var params = {
				qs: {
					userId: "123"
				},
				headers: {
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/getCart', 'get', function (body) {
				assert.ok(!body.result);
				assert.ok(body.errors);
				assert.equal(body.errors.codes[0], 401, "Illegal user provided");
				done();
			});
		});


		it('Set when fake user provided', function (done) {
			var params = {
				qs: {
					userId: 123
				},
				form: {
					"items": [generateRandomItem()
					]
				},
				headers: {
					"Content-Type": "application/json",
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/setCart', 'post', function (body) {
				executeMyRequest(params, 'cart/emptyCart', 'del', function (body) {
					assert.ok(!body.result);
					assert.ok(body.errors);
					assert.equal(body.errors.codes[0], 401, "Illegal user provided");
					done();
				});
			});
		});

		it('Add missing fields items', function (done) {

			// Load Chance
			var Chance = require('chance');

			// Instantiate Chance so it can be used
			var chance = new Chance();


			var params = {
				qs: {
					userId: userId
				},
				form: {
					"items": [
						{}
					]
				},
				headers: {
					"Content-Type": "application/json",
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/setCart', 'post', function (body) {
				assert.ok(!body.result);
				console.log(JSON.stringify(body, null, 2));

				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});

	});


	describe("Testing administrator services:", function () {


		it(' Bulk Add items to existing user', function (done) {
			// Instantiate Chance so it can be used
			var chance = new Chance();
			var items = [];
			var numberItems = globalMe["numberItems"] = chance.integer({min: 2, max: 20});

			for (var i = 0; i < numberItems; i++) {
				items[i] = generateRandomItem();
			}// end loop

			console.log(items);
			var params = {
				qs: {
					userId: '54ee1a511856706c23639308',//alt usr userId,
					tenantId: tenantId
				},
				form: {
					"items": items
				},
				headers: {
					"Content-Type": "application/json",
					soajsauth: soajsauth
				}
			};
			executeMyRequest(params, 'cart/addCart', 'post', function (body) {
				assert.ok(body.result);
				 console.log(JSON.stringify(body, null, 2));
				//assert.equal(body.errors.details[0].code, 403);
				//assert.equal(body.errors.details[0].message, "User have no cart");

				done();
			});
		});


	});


});