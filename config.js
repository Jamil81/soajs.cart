'use strict';

var itemProp = require(__dirname + "/model/schemas/item.js");
module.exports = {
    "serviceName": "shoppingCart",
    "serviceVersion": 1,
    "servicePort": 1993,
    "serviceGroup": "SOAJS Shopping Cart",
    "extKeyRequired": true,
    "session": true,
    type: "service",
    prerequisites: {
        cpu: '',
        memory: ''
    },
    "errors": {
        400: "Error Executing Operations!",
        401: "Entry not found!"
    },
    "schema": {

        "commonFields": {
            "id": {
                "source": ['query.id'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            }
        },

        "/cart/getCart": {
            "_apiInfo": {
                "l": "Get all items of a given user",
                "group": "Basic"
            },
            "commonFields": ["id"]
        },

        "/cart/setCart": {
            "_apiInfo": {
                "l": "Add items to cart",
                "group": "Basic"
            },
            "commonFields": ["id"],
            "items": {
                "source": ['body.items'],
                "validation": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": itemProp

                    },
                    "minItems": 0,
                    "uniqeItems": true,
                    "additionalItems": false
                }// validation


            }//items
        },//set cart

        "/cart/emptyCart":{
            "_apiInfo": {
                "l": "empty cart",
                "group": "Basic"
            },
            "commonFields": ["id"]
        },//emptyCart

        "/cart/getCarts":{
            "_apiInfo": {
                "l": "empty cart",
                "group": "Manage"
            }
            ,
            "start": {
                "source": ['query.start'],
                "required": false,
                "validation": {
                    "type": "integer",
                    "default" : 0
                }
            },
            "limit": {
                "source": ['query.limit'],
                "required": false,
                "validation": {
                    "type": "integer",
                    "default" : 1000
                }
            }
        }//getCarts

    }//schema,
};//exports;