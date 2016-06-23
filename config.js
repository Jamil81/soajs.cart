'use strict';

var itemProp = require(__dirname + "/model/schemas/item.js");
module.exports = {
    "serviceName": "shoppingCart",
    "serviceVersion": 1,
    "servicePort": 4900,
    "serviceGroup": "SOAJS Shopping Cart",
    "extKeyRequired": true,
    "session": true,
    type: "service",
    prerequisites: {
        cpu: '',
        memory: ''
    },
    "errors": {
        400: "Failed to connect to Database", // unknown db connection error
        401: "Invalid user Id provided", //user id does not match the logged in user
        402: "You are not logged in",//invalid login,
        403: "Cart is empty", //deprecated,
        407: "Internal Server Error"
    },
    "schema": {

        "commonFields": {
            "userId": {
                "source": ['query.userId'],
                "required": true,
                "validation": {
                    "type": "string"
                }
            },
	        "model": {
		        "source": ['query.model'],
		        "required": false,
		        "default": "mongo",
		        "validation": {
			        "type": "string",
			        "enum": ["testModel" , "mongo"]
		        }
	        },
	        "dbname": {
		        "source": ['query.dbname'],
		        "required": false,
		        "validation": {
			        "type": "string"
		        }
	        }
        },

        "/cart/getCart": {
            "_apiInfo": {
                "l": "Get all items of a given user cart",
                "group": "Basic"
            },
            "commonFields": ["userId", "model","dbname"]
        },

        "/cart/setCart": {
            "_apiInfo": {
                "l": "Add items to cart",
                "group": "Basic"
            },
            "commonFields": ["userId", "model","dbname"],
            // reset the cart or add items to the old ones
            "add" : {
                "source": ['query.add'],
                "default" : false,
                "validation": {
                    "type" : "boolean"
                }

            },
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
            "commonFields": ["userId", "model","dbname"]
        },//emptyCart

        "/cart/getCarts":{
            "_apiInfo": {
                "l": "list all user carts",
                "group": "Manage"
            }
            ,
            "start": {
                "source": ['query.start'],
                "required": false,
                "default" : 0,
                "validation": {
                    "type": "integer"
                }
            },
            "limit": {
                "source": ['query.limit'],
                "default" : 1000,
                "required": false,
                "validation": {
                    "type": "integer"
                }
            },
            "commonFields": [ "model","dbname"]
        },//getCarts


	    "/cart/addCart": {
		    "_apiInfo": {
			    "l": "Add a cart for any given user",
			    "group": "Basic"
		    },
		    "commonFields": ["userId", "model","dbname"],

		    "tenantId": {
			    "source": ['query.tenantId'],
			    "required": true,
			    "validation": {
				    "type": "string"
			    }
		    },
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


    }//schema,
};//exports;