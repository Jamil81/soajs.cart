/**
 * for testing
 * user: jamil id: 57592d0d37648aeb0231504e
 */
'use strict';
var soajs = require('soajs');
var Mongo = soajs.mongo;
var mongo;

var dbName = "shoppingcart";
var collName = "carts";

function checkIfMongo(soajs) {
    if (!mongo) {
        mongo = new Mongo(soajs.registry.coreDB[dbName]);
    }
}

module.exports = {

    "getCart": function (soajs, cb) {
        checkIfMongo(soajs);
        soajs.log.debug("Its up to mongo to get a cart");

        var options = {fields: {items: 1}};
        //mongo.find(collName, {user:{id: "57592d0d37648aeb0231504e"}}, options, cb);

        var userId = soajs.inputmaskData.userId;
        soajs.log.debug("fetching card for user " + userId);
        mongo.findOne(collName, {"user.id": userId}, options, cb);
    },

    
    
    "setCart": function (soajs, cb) {
        checkIfMongo(soajs);

        /**
         * check if the cart is already set then update its itemss
         * @type {{fields: {items: number}}}
         */

        var options = {};
        var userId = soajs.inputmaskData.userId;
        mongo.findOne(collName, {"user.id": userId}, options, function (error, data) {
            if (error) {
                return cb(error, data);
            }

            var curTime = new Date().getTime();
            console.log("time:" + curTime);
            console.log("Data:" + data);
            // check if the user already have an existing cart
            if (!data) {
                // insert new cart
                //var userUsername = soajs.inputmaskData.userId;
                //getting user data
                var myUrac = soajs.session.getUrac();
                var username = myUrac.username;
                var tenantId = myUrac.tenant.id;


                console.log("Urac:" + myUrac);
                var input = {
                    // id will be auto gen"_id": ObjectId('575e71cc89bca0ee1a000001'),
                    "tenantid": tenantId,
                    "user": {
                        "id": userId,
                        "username": username
                    },
                    "created": curTime,
                    "modified": curTime,
                    "items": soajs.inputmaskData.items

                };
                mongo.insert(collName, input, function (error) {
                    return cb(error, true);
                });


            }
            else {

                // add items to the existing list
                soajs.log.debug("updateing record  " + data._id);
                // in case of replacing the cart
                var items = soajs.inputmaskData.items;

                /*
                 soajs.log.debug("Items to add are:  " + soajs.inputmaskData.items);
                 console.log( soajs.inputmaskData.items );
                 */
                soajs.log.debug("Updated Items are:  " + items);
                console.log(items);
                var updateRec = {
                    $set: {
                        "items": items,
                        "modified": curTime//get current timestamp
                    }
                };
                mongo.update(collName, {"user.id": userId}, updateRec, {
                    "multi": false,
                    "upsert": false,
                    "safe": true
                }, cb);

            }
        });
    },

    "emptyCart": function (soajs, cb) {
        checkIfMongo(soajs);
        var userId = soajs.inputmaskData.userId;

        mongo.count(collName, {"user.id": userId}, function (error, count) {
            if (error) {
                return cb(error);
            }

            if (!count) {
                return cb(new Error("User have no cart"));
            }
            // #ja #2check what is upsert

            var updateRec = {
                $set: {
                    "items": []
                }
            };
            mongo.update(collName, {"user.id": userId}, updateRec, {"multi": false, "upsert": false, "safe": true}, cb);
        });
        /**
         * just for testing - this is not what we want we just wanna remove the items
         * keeping the rest of the record
         // var options = {fields: {items: 1}};it wonn't work this way
         mongo.remove(collName, {"user.id": userId }, function (error) {
            console.log(error);
            return cb(error, true);
        });
         **/
    },

    "getCarts": function (soajs, cb) {
        checkIfMongo(soajs);
        var options = {
            start: soajs.inputmaskData.start,
            limit: soajs.inputmaskData.limit
        };

        // #2fix #ja note start is not working
        mongo.find(collName, {}, {}, options, cb);
    }
};