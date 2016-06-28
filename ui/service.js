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


	function cloneItem(index, data) {

		data = data? data : {
			"productId" : "",
			"groupId" : "",
			"merchantId" : "",
			"GTIN" : "",
			"title" : "",
			"imagePath" : "",
			"price" : 0,
			"currency" : "$",
			"quantity" :0,
			"shippingPrice" : 0,
			"shippingMethods" : [],
			"filters" : {}
		};
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
				"maxLength": 8,
				"value": data.productId
			},
			{
				'name': 'groupId' + '-' + index,
				'label': 'Group Id',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 8,
				"maxLength": 8,
				"value": data.groupId
			},
			{
				'name': 'merchantId' + '-' + index,
				'label': 'Merchant Id',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 8,
				"maxLength": 8,
				"value": data.merchantId
			},
			{
				'name': 'GTIN' + '-' + index,
				'label': 'GTIN',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"minLength": 10,
				"maxLength": 10,
				"value": data.GTIN
			},
			{
				'name': 'title' + '-' + index,
				'label': 'Title',
				'type': 'text',
				'placeholder': 'Product_Title',
				'required': true,
				"minLength": 5,
				"value": data.title
			},
			{
				'name': 'imagePath' + '-' + index,
				'label': 'Image Path',
				'type': 'text',
				'placeholder': '',
				'required': true,
				"value": data.imagePath
			},
			{
				'name': 'price' + '-' + index,
				'label': 'Price',
				'type': 'number',
				'placeholder': '',
				'required': true,
				"min": 0,
				"value": data.price
			},
			{
				'name': 'currency' + '-' + index,
				'label': 'Currency',
				'type': 'text',
				"value": data.currency
			},
			{
				'name': 'quantity' + '-' + index,
				'label': 'Quantity',
				'type': 'number',
				'required': true,
				"min": 0,
				"value": data.quantity
			},
			{
				'name': 'shippingPrice' + '-' + index,
				'label': 'Shipping Price',
				'type': 'number',
				'placeholder': '',
				'required': true,
				"value": data.quantity
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
				'required': true,
				"value": data.shippingMethods
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
				'required': true,
				"value": data.filters
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
					},
					{
						'icon': 'pencil2',
						'label': 'Edit Cart',
						'handler': 'addCart'
					}
				]
			};
			buildGrid($scope, options);
		},

		'buildForm': function ($scope, $modal, submitAction) {
			console.log ($scope.data) ;console.log("____");

			console.log( "teneant id:" + $scope.data.tenantid);
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
							'value':  $scope.users,
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

						}
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
			if( $scope.editMode )
			{
				var $head =
				{
					"name": "head",
					"type": "html",
					"value": '<span class="">Tenant: '+$scope.data.tenantid+'</span><br>' +
					'<span class="">user: '+$scope.data.user.name + '(' + $scope.data.user.id +')</span>'


				};

				config.form.entries.splice(0,2,$head);
			}
			var formConf = config.form;
			var count =0;// $scope.countItems;

			if ( $scope.editMode )
			{
				var itemData = $scope.data.raw.items;
				itemData.forEach( function (item)
				{
					var oneClone = cloneItem(count,item);
					config.form.entries.forEach(function (entry) {
						if (entry.name === 'items' && entry.type === 'group') {
							entry.entries = entry.entries.concat(oneClone);
						}
					});
					$scope.countItems=++count;
				});

			}
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
							$scope.countItems=++count;
						};
					}
				});
				cb();
			}
			//call buildForm
			if( $scope.editMode )
			{
				buildFormWithModal($scope, $modal, config );
			}
			else{
				addItem( function (){
					buildFormWithModal($scope, $modal, config );
					// after form built console.log($scope.form.entries); will be the valid scope
				});// create one empty item
			}
		}
	}
}]);