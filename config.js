'use strict';

module.exports = {
	serviceName: "soajs.cart",
	serviceVersion: 1,
	servicePort: 1993,
	serviceGroup: "SOAJS Shopping Cart",
	extKeyRequired: false,
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
			"model": {
				"source": ['query.model'],
				"required": false,
				"default": "memory",
				"validation": {
					"type": "string",
					"enum": ["memory", "mongo"]
				}
			}
		}
	}
};