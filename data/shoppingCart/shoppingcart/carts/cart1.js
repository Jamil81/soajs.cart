'use strict';

var cart1 = {
	"_id": ObjectId('5210a64f846cb004b5000001'),
	"tenantid": "57592b296146f0e902b797c6",
	"user": {
	"id": "575a7d4c349e672f123990d5",
		"username": "jamil"
		},
	"created": 360763200,
	"modified": 1465300800,
	"items": [
	{
		"productId": 1,
		"title": "laptop",
		"imagePath": "",
		"price": "500",
		"groupId": 1,
		"merchantId": 100001,
		"GTIN": 11111,
		"currency": "USD",
		"quantity": 1,
		"shippingPrice": "0",
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
				"price": "5",
				"selected": "false"
			},
			{
				"id": 3,
				"methodeName": "Urgent Delivery",
				"price": "20",
				"selected": "false"
			}
		],
		"filters": [
			{
				"color": "black",
				"weight": "2kg"
			}
		]
	}
]
};