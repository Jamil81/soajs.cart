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

        var curTime = new Date().getTime();
        var userId = soajs.inputmaskData.userId;
        var myUrac = soajs.session.getUrac();
        var username = myUrac.username;
        var tenantId = myUrac.tenant.id;
        var input = {
            // id will be auto gen"_id": ObjectId('575e71cc89bca0ee1a000001'),
            "tenantid": tenantId,
            "user": {
                "id": userId,
                "username": username
            },
            "created": curTime

        };
        mongo.update(
            collName,
            {"user.id": userId},
            {
                $setOnInsert: input,
                $set: {
                    "items": soajs.inputmaskData.items,
                    "modified": curTime
                }
            },
            {"multi": false, upsert: true, "safe": true} ,
            cb
        );
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