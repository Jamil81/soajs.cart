"use strict";
var shoppingCartService = soajsApp.components;
shoppingCartService.service('shoppingCartSrv', ['$timeout', '$http', function ($timeout, $http) {

	/*
	ja: estgnayna 3n jhdmetik
	function callAPI(config, callback) {
		$http(config).success(function (response, status, headers, config) {
			$timeout(function () {
				return callback(null, response);
			}, 500);
		}).error(function (errData, status, headers, config) {
			$timeout(function () {
				return callback(errData);
			}, 500);
		});
	}
	*/


	function cloneItem(index) {

		var obj = [
			{
				"name": 'removeItem'+  '-' + index,
				"type": "html",
				"value": "<span class='red'><span class='icon icon-cross' title='Remove'></span></span>",
				"onAction": function (id, data, form) {
					console.log("Delete called ");

					// need to decrease count
					var itemattr = getItemAttributes();
					console.log(   form.formData );// this one retuens olny the tenant and the user and not the items
					itemattr.forEach(function (attr) {
						console.log(attr);
						console.log(form.formData[attr+'-'+index]);
						console.log("__________________");
						console.log(form.formData[attr+'-'+index]);
						delete form.formData[attr+'-'+index];
					});
					console.log(   form.formData );
				}
			},
			{
				'name': 'productId' + '-' + index,
				'label': 'Product Id',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 8,
				"maxLength": 8
			},
			{
				'name': 'groupId' + '-' + index,
				'label': 'Group Id',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 8,
				"maxLength": 8
			},
			{
				'name': 'merchantId' + '-' + index,
				'label': 'Merchant Id',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 8,
				"maxLength": 8
			},
			{
				'name': 'GTIN' + '-' + index,
				'label': 'GTIN',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 10,
				"maxLength": 10
			},
			{
				'name': 'title' + '-' + index,
				'label': 'Title',
				'type': 'text',
				'placeholder': 'Product_Title',
				'required': true,
				"minLength": 5
			},
			{
				'name': 'imagePath' + '-' + index,
				'label': 'Image Path',
				'type': 'text',
				'placeholder': '',
				'required': true
			},
			{
				'name': 'price' + '-' + index,
				'label': 'Price',
				'type': 'number',
				'placeholder': '',
				'required': true,
				"min": 0
			},
			{
				'name': 'currency' + '-' + index,
				'label': 'Currency',
				'type': 'text'
			},
			{
				'name': 'quantity' + '-' + index,
				'label': 'Quantity',
				'type': 'number',
				'required': true,
				"min": 0
			},
			{
				'name': 'shippingPrice' + '-' + index,
				'label': 'Shipping Price',
				'type': 'number',
				'placeholder': '',
				'required': true
			},
			{
				'name': 'shippingMethods' + '-' + index,
				'label': 'ShippingMethods',

				'type': 'jsoneditor',
				'options': {
					'mode': 'code',
					'availableModes': [{'v': 'code', 'l': 'Code View'}, {'v': 'tree', 'l': 'Tree View'}, {'v': 'form', 'l': 'Form View'}]
				},
				'height': '200px',
				'required': true
			},
			{
				'name': 'filters' + '-' + index,
				'label': 'Filters',
				'type': 'jsoneditor',
				'options': {
					'mode': 'code',
					'availableModes': [{'v': 'code', 'l': 'Code View'}, {'v': 'tree', 'l': 'Tree View'}, {'v': 'form', 'l': 'Form View'}]
				},
				'height': '200px',
				'required': true
			}

		];
		return obj;
	}

	return {

		/**
		 * get the list of the item attributes
		 * it makes code shorter to just loop over them and not hardcode them each time,
		 * @returns {string[]}
		 */
		 getItemAttributes:function ()
		{
			return [
				'productId','groupId','merchantId','GTIN','title','imagePath','price','currency','quantity','shippingPrice','shippingMethods','filters'
			];
		},
		'sendEntryToAPI': function ($scope,ngDataApi, opts, callback) {

			getSendDataFromServer($scope, ngDataApi, opts, callback);

		},
		'printGrid': function ($scope, response) {
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
		},

		'buildForm': function ($scope, $modal, submitAction) {
			var config = {
				"timeout": $timeout,
				"form": {
					"entries": [
						{
							'name': 'tenantId',
							'label': 'Tenants',
							'type': 'select',
							'placeholder': 'Choose Tenant',
							'value': $scope.tenant,
							'tooltip': 'Select tenant',
							'required': true,
							"onAction": function (id, data, form) {
								// generate the list of the users of the given tenant.'
								$scope.getusers(data, function () {
									form.entries.forEach(function (oneEntry) {
										if (oneEntry.type === 'select' && oneEntry.name === 'userId') {
											oneEntry.value = $scope.users;
										}
									});
								});
							}
						},
						{
							'name': 'userId',
							'label': 'Users',
							'type': 'select',
							'placeholder': 'Choose a user',
							'value': $scope.users,
							'tooltip': 'Select user( should select tenant first )',
							'required': true
						},

						{
							'name': 'items',
							'label': "Items",
							'tooltip': "Insert Items here",
							"type": "group",
							'collapsed': false,
							"class": "itemList",
							"entries": []
						},
						{
							"name": "addItem",
							"type": "html",
							"value": '<span class=""><input type="button" class="btn btn-sm btn-success" value="Add New Item"></span>'
						},
					]
				},
				"name": 'addCart',
				"label": 'Add New Cart',
				"actions": [
					{
						'type': 'submit',               //button type
						'label': 'Add cart',          //button label
						'btn': 'primary',               //button class name (AngularJs's Bootstrap)
						'action': submitAction
					},
					{
						'type': 'reset',
						'label': 'Cancel',
						'btn': 'danger',
						'action': function () {
							//reset the form and close modal
							$scope.modalInstance.dismiss('cancel');
							$scope.form.formData = {};
						}
					}
				]
			};
			var formConf = config.form;
			var count = 0;
			function addItem(cb)
			{
				formConf.entries.forEach(function (entry) {
					if (entry.name === 'addItem'&& entry.type === 'html') {
						entry.onAction = function (id, data, form) {
							var oneClone = cloneItem(count);
							form.entries.forEach(function (entry) {
								if (entry.name === 'items' && entry.type === 'group') {
									entry.entries = entry.entries.concat(oneClone);
								}
							});
							count++;//no need
						};
					}
				});
				cb();
			}
			//call buildForm
			addItem( function (){
				buildFormWithModal($scope, $modal, config );
				// after form built console.log($scope.form.entries); will be the valid scope
			});// create one empty item
		}
	}
}]);