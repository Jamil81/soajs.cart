var core_services = [
    {
        "name": "urac",
        "port": 4001,
        "requestTimeout": 30,
        "requestTimeoutRenewal": 5,
        "versions": {
            "1": {
                "extKeyRequired": true,
                "apis": []
            }
        }
    },
    {
        "_id": ObjectId('576010f6ce4636e30cc09c38'),
        "name": "shoppingCart",
        "group": "SOAJS Shopping Cart",
        "port": 4900,
        "requestTimeout": null,
        "requestTimeoutRenewal": null,
        "versions": {
            "1": {
                "extKeyRequired": true,
                "apis": [
                    {
                        "l": "Get all items of a given user cart",
                        "v": "/cart/getCart",
                        "group": "Basic"
                    },
                    {
                        "l": "Add items to cart",
                        "v": "/cart/setCart",
                        "group": "Basic"
                    },
                    {
                        "l": "empty cart",
                        "v": "/cart/emptyCart",
                        "group": "Basic"
                    },
                    {
                        "l": "list all user carts",
                        "v": "/cart/getCarts",
                        "group": "Manage"
                    }
                ],
                "awareness": true
            }
        }
    }
    
];

var core_hosts = [
    {
        "env": "dev",
        "name": "controller",
        "ip": "127.0.0.1",
        "version": 1
    },
    {
        "env": "dev",
        "name": "urac",
        "ip": "127.0.0.1",
        "version": 1
    },
    {
        "env": "dev",
        "name": "shoppingCart",
        "ip": "127.0.0.1",
        "version": 1
    }
];