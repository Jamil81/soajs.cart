'use strict';

var cart2 = {
	"_id": ObjectId('575e71cc89bca0ee1a000001'),
	"tenantid": "57592b296146f0e902b797c6",
	"user": {
	"id": "54ee1a511856706c23639308",
		"username": "test"
		},
	"created": "360763200",
	"modified": "1465300800",
	"items": [
	{
		"productId": 1,
		"title": "mouse",
		"imagePath": "",
		"price": "5",
		"groupId": 1,
		"merchantId": 100001,
		"GTIN": 11111,
		"currency": "USD",
		"quantity": 1,
		"shippingPrice": "0",
		"shippingMethod": [
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
				"color": ["black","white","blue"],
				"weight": "2.3g"
			}
		]
	}
]
};
