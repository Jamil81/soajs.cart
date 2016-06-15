"use strict";
var assert = require("assert");
var async = require("async");
var request = require("request");
var helper = require("../helper");
var mongo = helper.getMongo();

// Any file that is not in the test folder should be required using the helper,
// because you do not want to worry about location path with reference to the test folder
var config = helper.requireModule('./config');

// ***** load the error messages for easier matching
var errorCodes = config.errors;

var extKey = helper.getKey();

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
    before(function (done) {
        console.log("------------------------ Do Something Before All tests ------------------------");
        done();
    });

    beforeEach(function (done) {
        console.log("============================================================================== ");
        done();
    });

    it("Login", function (done) {
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
        helper.requester('post', loginParams, function (err, body) {
            assert.ifError(err);
            assert.ok(body);
            assert.equal(body.result, true);
            assert.ok(body.soajsauth);
            console.log(JSON.stringify(body.data, null, 2));
            userId = body.data._id.toString();
            // ****** add this to the headers, for example if you need all you subsequent tests to be in private mode
            soajsauth = body.soajsauth;
            done();
        });

    });

    // group tests for a single api in a describe
    describe("Testing Actions on empty data", function () {

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


        it('empty Cart on empty db', function (done) {
            var params = {
                qs: {
                    userId: userId
                },
                headers: {
                    soajsauth: soajsauth
                }
            };
            executeMyRequest(params, 'cart/emptyCart', 'delete', function (body) {
                assert.ok(body.result);
                assert.ok(!body.errors);
                assert.equal(body.result, true);
                console.log(JSON.stringify(body, null, 2));

                //assert.equal(body.errors.details[0].code, 403);
                //assert.equal(body.errors.details[0].message, "User have no cart");

                done();
            });
        });

        it.skip('Add items', function (done) {

            // Load Chance
            var Chance = require('chance');

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
                    "items": [
                        {
                            "productId": "10000002",
                            "title":  chance.word({length: 5}) ,
                            "imagePath": "",
                            "price": 245,
                            "groupId": "10000002",
                            "merchantId": "10000001",
                            "GTIN": "1111111111",
                            "currency": "USD",
                            "quantity": 2,
                            "shippingPrice": 0,
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
                                    "price": chance.dollar() ,
                                    "selected": "false"
                                }
                            ],
                            "filters": {
                                "color": ["black", "white"],
                                "weight": chance.natural({min: 1, max: 12})+"g"
                            }
                        }
                    ]
                },
                headers: {
                    "Content-Type":"application/json",
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



        it(' Bulk Add items', function (done) {

            // Load Chance
            var Chance = require('chance');

            // Instantiate Chance so it can be used
            var chance = new Chance();

            // Use Chance here.
            var my_random_string = chance.string();
            console.log("This is chance");
            console.log(my_random_string);


            var items =[];
            var numberItems = chance.integer({min: 1, max: 20});

            for( var i=0 ; i < numberItems; i++)
            {
                items[i] =
                {
                    "productId":  chance.string({length: 8, pool: '1234567890'}) ,
                    "title":  chance.word({length: 7}) ,
                    "imagePath": chance.avatar(),
                    "price": chance.integer({min:20, max:2000}),
                    "groupId": chance.string({length: 8, pool: '1234567890'}),
                    "merchantId": chance.string({length: 8, pool: '1234567890'}) ,
                    "GTIN": chance.string({length: 10, pool: '1234567890'}) ,
                    "currency": "USD",
                    "quantity": chance.integer({min:1, max:12}),
                    "shippingPrice": chance.integer({min:1, max:70}),
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
                            "price": chance.dollar() ,
                            "selected": "false"
                        }
                    ],
                    "filters": {
                        "color": ["black", "white"],
                        "weight": chance.natural({min: 1, max: 12})+"g"
                    }
                };
            }

            console.log(items);
            var params = {
                qs: {
                    userId: userId
                },
                form: {
                    "items": items
                },
                headers: {
                    "Content-Type":"application/json",
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




    describe("Testing no tenant user", function () {


        it.skip("Login", function (done) {
            var loginParams = {
                uri: 'http://127.0.0.1:4000/urac/login',
                body: {
                     "username": "user1",
                     "password": "123456"
                },
                headers: {
                    'key': extKey
                }
            };
            helper.requester('post', loginParams, function (err, body) {
                assert.ifError(err);
                assert.ok(body);
                assert.equal(body.result, true);
                assert.ok(body.soajsauth);
                console.log(JSON.stringify(body.data, null, 2));
                userId = body.data._id.toString();
                // ****** add this to the headers, for example if you need all you subsequent tests to be in private mode
                soajsauth = body.soajsauth;
                done();
            });

        });

        it.skip('Add items', function (done) {
            var params = {
                qs: {
                    userId: userId
                },
                form: {
                    "items": [
                        {
                            "productId": "10000002",
                            "title": "phone",
                            "imagePath": "",
                            "price": 245,
                            "groupId": "10000002",
                            "merchantId": "10000001",
                            "GTIN": "1111111111",
                            "currency": "USD",
                            "quantity": 2,
                            "shippingPrice": 0,
                            "shippingMethods": [
                                {
                                    "id": 1,
                                    "methodeName": "Client Pickup",
                                    "price": "0.00",
                                    "selected": "true"
                                },
                                {
                                    "id": 2,
                                    "methodeName": "Liban Post",
                                    "price": "12",
                                    "selected": "false"
                                },
                                {
                                    "id": 3,
                                    "methodeName": "Urgent Delivery",
                                    "price": "20",
                                    "selected": "false"
                                }
                            ],
                            "filters": {
                                "color": ["black", "white"],
                                "weight": "1.2g"
                            }
                        }
                    ]
                },
                headers: {
                    "Content-Type":"application/json",
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

    }); // end no tenant user


    describe("Testing Error messages", function () {

        it('getCart of no user', function (done) {
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

    });
});