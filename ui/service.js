"use strict";
var shoppingCartService = soajsApp.components;
shoppingCartService.service('shoppingCartSrv', [ function() {
	return {

		'printGrid': function($scope, response) {
			var options = {
				'grid': {
					recordsPerPageArray: [20, 50, 100, 200],
					'columns': [
						{'label': 'ID', 'field': '_id'},
						{'label': 'Username', 'field': 'username'},
						{'label': 'Items', 'field': 'items'}
					],
					'defaultLimit': 20
				},
				'defaultSortField': '',
				'data': response,
				'left': [
					{
						'icon': 'search',
						'label': 'View Cart',
						'handler': 'viewEntry'
					}
				]
			};
			buildGrid($scope, options);
		} 
	}
}]);