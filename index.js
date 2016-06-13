'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var BLModule = require("./lib/index");

var service = new soajs.server.service(config);

function initBLModel(req, res, cb) {
	var modelName = "mongo";
	if(process.env.SOAJS_TEST && req.soajs.inputmaskData.model){
		modelName = req.soajs.inputmaskData.model;
	}
	BLModule.init(modelName, function (error, BL) {
		if (error) {
			req.soajs.log.error(error);
			return res.json(req.soajs.buildResponse({"code": 407, "msg": config.errors[407]}));
		}
		else {
			return cb(BL);
		}
	});
}

service.init(function () {

	/**
	 * getCart: the getCart api returns the content of the cart for the current logged in user
	 */
	service.get("/cart/getCart", function (req, res) {

		var myUrac = req.soajs.session.getUrac();
		console.log(myUrac);

		console.log("test");

		res.json(req.soajs.buildResponse(null, {
				result : myUrac
			}
		));

		/*
		initBLModel(req, res, function (BL) {
			BL.getItems(config, req.soajs, function (error, response) {
				return res.json(req.soajs.buildResponse(error, response));
			});

		});*/
	});

	/**
	 * setCart: the setCart api will add items to the cart; it updates an existing cart or creates a new one
	 */
	service.post("/cart/setCart", function (req, res) {
		initBLModel(req, res, function (BL) {

		});
	});

	/**
	 * emptyCart: the emptyCart api will delete all items from the cart
	 */
	service.delete("/cart/emptyCart", function (req, res) {
		initBLModel(req, res, function (BL) {

		});
	});


	/**
	 * getCarts: this api returns all the carts of all the tenant’s users; it takes a limit and sorts the entries by most recent
	 */
	service.get("/cart/getCarts", function (req, res) {
		initBLModel(req, res, function (BL) {

		});
	});



	service.start();
});