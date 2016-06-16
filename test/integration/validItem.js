"use strict";
// Instantiate Chance so it can be used
var Chance = require("chance");
var chance = new Chance(Math.random);

module.exports = {
    "productId": chance.string({length: 8, pool: '1234567890'}),
    "title": chance.word({length: 7}),
    "imagePath": '',
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