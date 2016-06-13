'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var BLModule = require("./lib/index");

var service = new soajs.server.service(config);

service.init(function () {

    /**
     *
     * jamil id: 575a7d4c349e672f123990d5
     * getCart: the getCart api returns the content of the cart for the current logged in user
     */
    service.get("/cart/getCart", function (req, res) {
            initBLModel(req, res, function (BL) {
                BL.getCart(config, req.soajs, function (error, response) {
                    return res.json(req.soajs.buildResponse(error, response));
                });
            });
    });

    /**
     * setCart: the setCart api will add items to the cart; it updates an existing cart or creates a new one
     */
    service.post("/cart/setCart", function (req, res) {
        initBLModel(req, res, function (BL) {
            BL.setCart(config, req.soajs, function (error, response) {
                return res.json(req.soajs.buildResponse(error, response));
            });
        });
    });

    /**
     * emptyCart: the emptyCart api will delete all items from the cart
     */
    service.delete("/cart/emptyCart", function (req, res) {
        initBLModel(req, res, function (BL) {
            BL.emptyCart(config, req.soajs, function (error, response) {
                return res.json(req.soajs.buildResponse(error, response));
            });
        });
    });


    /**
     * getCarts: this api returns all the carts of all the tenant’s users; it takes a limit and sorts the entries by most recent
     */
    service.get("/cart/getCarts", function (req, res) {
        initBLModel(req, res, function (BL) {
            BL.getCarts(config, req.soajs, function (error, response) {
                return res.json(req.soajs.buildResponse(error, response));
            });

        });
    });


    service.start();
});


/**
 * Mongo connection
 * @param req
 * @param res
 * @param cb
 */
function initBLModel(req, res, cb) {
    var modelName = "mongo";
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



/**
 * Common function to validate if the user is logged in and
 * if the logged in user is the same as the user id given
 * @param req
 * @returns {number}

function validateUser(req) {
    var userId = req.soajs.inputmaskData.userId;
    var myUrac = req.soajs.session.getUrac();
    req.soajs.log.debug("Checking Validity of user: " + userId);

    // check if the user is logged in

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
 */