'use strict';
var fs = require('fs');


module.exports = {
	"init": function (modelName, cb) {
		var modelPath = __dirname + "/../model/mongo.js";
		if (modelName) {
			modelPath = __dirname + "/../model/" + modelName + ".js";
		}
		return requireModel(modelPath, cb);

		/**
		 * checks if model file exists, requires it and returns it.
		 * @param filePath
		 * @param cb
		 */
		function requireModel(filePath, cb) {
			//check if file exist. if not return error
			fs.exists(filePath, function (exists) {
				if (!exists) {
					return cb(new Error("Requested Model Not Found!"));
				}

				cartModule.model = require(filePath);
				return cb(null, cartModule);
			});
		}
	}
};


function buildResponse(soajs, opts, cb) {
	if (opts.error) {
		soajs.log.error(opts.error);
		var msg = opts.error.message || opts.config.errors[opts.code];
		var code = opts.error.code || opts.code;
		return cb({"code": code, "msg": msg});
	}
	return cb(null, opts.data);
}

/**
 * Common function to validate if the user is logged in and
 * if the logged in user is the same as the user id given
 * @param soajs
 * @returns {number}
 */
function validateUser(soajs) {
	var userId = soajs.inputmaskData.userId;
	var myUrac = soajs.session.getUrac();
	soajs.log.debug("Checking Validity of user: " + userId + " against " + myUrac._id.toString());

	//check if the user is logged in
	if (!myUrac || myUrac._id.toString() !== userId) {
		return 401;
	}

	// all fine, let them in
	return true;
}

var cartModule = {

	model: null,

	"getCart": function (config, soajs, cb) {
		var validation = validateUser(soajs);
		soajs.log.debug("validation returned: " + validation);
		if (validation === true) {
			cartModule.model.getCart(soajs, function (error, data) {
				var items =[];
				if (data && data.items) {
					items = data.items;
				}

				var opts = {
					error: error,
					code: 400,
					config: config,
					data: items
				};
				return buildResponse(soajs, opts, cb);
			});
		}//end validation
		else {
			// return the validation error{
			//return buildResponse({"code": validation, "msg": config.errors[validation]});
			var opts = {
				error: true,
				code: validation,
				config: config
			};
			return buildResponse(soajs, opts, cb);
		}
	},

	"setCart": function (config, soajs, cb) {
		var validation = validateUser(soajs);
		if (validation === true) {
			cartModule.model.setCart(soajs, function (error, data) {
				var opts = {
					error: error,
					code: 400,
					config: config,
					data: data.items
				};
				return buildResponse(soajs, opts, cb);
			});
		}
		else{
			var opts = {
				error: true,
				code: validation,
				config: config
			};
			return buildResponse(soajs, opts, cb);
		}
	},

	"emptyCart": function (config, soajs, cb) {
		var validation = validateUser(soajs);
		if (validation === true) {
			cartModule.model.emptyCart(soajs, function (error) {
				var opts = {
					error: error,
					config: config,
					data: true
				};
				return buildResponse(soajs, opts, cb);
			});
		}
		else {
			var opts = {
				error: true,
				code: validation,
				config: config
			};
			return buildResponse(soajs, opts, cb);
		}
	},

	"getCarts": function (config, soajs, cb) {
		cartModule.model.getCarts(soajs, function (error, data) {
			var opts = {
				error: error,
				code: 400,
				config: config,
				data: data
			};
			return buildResponse(soajs, opts, cb);
		});
	},

	"addCart": function (config, soajs, cb) {
		cartModule.model.getCarts(soajs, function (error, data) {
			var opts = {
				error: error,
				code: 400,
				config: config,
				data: data
			};
			return buildResponse(soajs, opts, cb);
		});
	}
};