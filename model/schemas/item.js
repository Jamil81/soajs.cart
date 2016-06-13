"use strict";

module.exports = {

    "productId": {
        "type": "string",
        "required": true,
        "minLength": 8,
        "maxLength": 8
    },
    "groupId": {
        "type": "string",
        "required": true,
        "minLength": 8,
        "maxLength": 8
    },
    "merchantId": {
        "type": "string",
        "required": true,
        "minLength": 8,
        "maxLength": 8
    },
    "GTIN": {
        "type": "string",
        "required": true,
        "minLength": 10,
        "maxLength": 10
    },
    "title": {
        "type": "string",
        "required": true,
        "minLength": 5
    },
    "imagePath": {
        "type": "string",
        "required": true
    },
    "price": {
        "type": "number",
        "required": true,
        "min":0
    },
    "currency": {
        "type": "string",
        "required": true
    },
    "quantity": {
        "type": "integer",
        "required": true,
        "min":0
    },
    "shippingPrice": {
        "type": "number",
        "required": true
    },
    "shippingMethods": {
        "type": "array",
        "required": true,

        "items": {
            "methodeName": {
                "type": "string",
                "required": true
            },
            "price": {
                "type": "integer",
                "default": 0
            },
            "selected": {
                "type": "boolean",
                "default": false
            }

        }

    },
    "filters": {
        "type": "object",
        "required": true
    }
};// expots;