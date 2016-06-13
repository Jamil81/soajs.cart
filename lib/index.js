'use strict';
var fs = require('fs');

module.exports = {
    "init": function (modelName, cb) {
        var modelPath;

        if (modelName) {
            modelPath = __dirname + "/../model/" + modelName + ".js";
            return requireModel(modelPath, cb);
        }

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
        return cb({"code": opts.code, "msg": opts.config.errors[opts.code]});
    }
    return cb(null, opts.data);
}

/**
 * Common function to validate if the user is logged in and
 * if the logged in user is the same as the user id given
 * @param req
 * @returns {number}
 */
function validateUser(soajs) {
    var userId = soajs.inputmaskData.userId;
    var myUrac = soajs.session.getUrac();
    soajs.log.debug("Checking Validity of user: " + userId + " against " + myUrac._id.toString());

    /**
     * check if the user is logged in
     *
     */
    if (!myUrac) {
        //ja: case of non-logged in users, I know this is being taken care of by SOAJS(I came I saw I override... )
        return 402;
    }
    else if (myUrac._id.toString() !== userId) {
        // the users sent in the request does not match the id of the logged in user
        return 401;
    }
    else
    // all fine,, let them in
        return true;
}

var cartModule = {

    model: null,
    "getCart": function (config, soajs, cb) {
        var validation = validateUser(soajs);
        soajs.log.debug("validation returned: " + validation);
        if (validation === true) {
            cartModule.model.getCart(soajs, function (error, data) {
                if( data && data.items){
                    var items= data.items;
                }
                else{
                    var items = [];

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
    
    "emptyCart": function (config, soajs, cb) {
        var validation = validateUser(soajs);
        if (validation == true) {
            cartModule.model.emptyCart(soajs, function (error, data) {
                var opts = {
                    error: error,
                    code: 400,
                    config: config,
                    data: data.items
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
    }
};