"use strict";
console.log("in controller");
var shoppingCart = soajsApp.components;
shoppingCart.controller('shoppingCartCtrl', ['$scope', '$modal', 'ngDataApi', 'shoppingCartSrv', function ($scope, $modal, ngDataApi, shoppingCartSrv) {
	$scope.$parent.isUserLoggedIn();


	$scope.access = {};
	//call the method and compare the permissions with the ACL
	//allowed permissions are then stored in scope.access
	constructModulePermissions($scope, $scope.access, permissions);
	//function that lists the entries in a grid
	$scope.listEntries = function () {
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/shoppingCart/cart/getCarts"
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayAlert('danger', error.message);
			}
			else {
				$scope.data = angular.copy(response); //;
				for (var inc = 0; inc < response.length; inc++) {
					//$scope.data[inc] = {};
					$scope.data[inc]["_id"] = response[inc]["_id"];
					$scope.data[inc].username = response[inc].user.username;
					$scope.data[inc].raw = (response[inc]);

					var myItems = "";
					if (response[inc].items && response[inc].items.length > 0) {
						response[inc].items.forEach(function (item) {
							myItems += myItems != "" ? "," : "";
							$scope.data[inc].itemsCount = $scope.data[inc].itemsCount ? $scope.data[inc].itemsCount + 1 : 1;// ja this should sbe reducable
							myItems += item.quantity + " " + item.title + (item.quantity > 1 ? "(s)" : "");
						});
					}
					$scope.data[inc].items = myItems;
				}
				shoppingCartSrv.printGrid($scope, $scope.data);
			}
		});
	};


	//function that prints one data record to the console
	$scope.viewEntry = function (oneDataRecord) {
		$modal.open({
			templateUrl: "infoBox.html",
			size: 'lg',
			backdrop: false,
			keyboard: true,
			controller: function ($scope, $modalInstance) {
				$scope.title = "Viewing Cart";

				$scope.oneDataRecord = JSON.stringify(oneDataRecord.raw, null, 2);
				$scope.pretty = prettyRecord(oneDataRecord.raw);

				setTimeout(function () {
					highlightMyCode()
				}, 500);
				$scope.ok = function () {
					$modalInstance.dismiss('ok');
				};
			}
		});
	};


	$scope.listTenants = function (callback) {
		overlayLoading.show();
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/dashboard/tenant/list",
			"params": {"type": "client"}
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayAlert('danger', error.code, true, 'dashboard', error.message);
			}
			else {
				$scope.rawTenant = [];
				$scope.tenant = [];
				$scope.users = [];
				response.forEach(function (resp) {
					var myTenant = {
						"v": resp._id,
						"l": resp.name
					};
					$scope.tenant.push(myTenant);
					$scope.rawTenant.push(resp);
				});
				overlayLoading.hide();
				callback();
			}
		});
	};

	//function that adds a new entry by using form & modal
	$scope.addCart = function (data) {
		if ($scope.access.addCart) {

			$scope.data = data ? data : {};
			var flag = $scope.editMode = data ? true : false;
			$scope.countItems = (flag && data.itemsCount )? data.itemsCount : 0;



			var submit = function (formData) {
				//operation function, returns the data entered in the form
				console.log( formData );

				console.log("Count items is: " + $scope.countItems);
				var itemattr = shoppingCartSrv.getItemAttributes();
				var newItems = [];// always reseted since in the form all data old and new be with you
				for (var index = 0; index < $scope.countItems; index++) {
					if (formData['productId-' + index]>0) {
						console.log(formData['productId-' + index]);
						newItems[index] = {};
						itemattr.forEach(function (attr) {
							newItems[index][attr] = formData[attr + '-' + index];
						});
					}
				}
				console.log( newItems );

				formData.items = newItems;

				if ($scope.editMode) {
					formData.tenantId = data.tenantid;
					formData.userId = data.user.id;
				}
				var username=  $scope.users.filter(function(value){ return value.v==formData.userId;});

				var opts = {
					routeName: "/shoppingCart/cart/addcart",
					method: "send",
					data: formData,
					"params": {
						"userId": formData.userId,
						"userName":username[0] ? username[0].l:"",
						"tenantId": formData.tenantId
					}
				};
				shoppingCartSrv.sendEntryToAPI($scope, ngDataApi, opts, function (error) {
					if (error) {
						$scope.displayAlert('danger', error.message);
						console.log(error.message);
					}
					else {
						$scope.displayAlert('success', "Your entry has been added.");
						$scope.form.formData = {};
						$scope.modalInstance.close();
						$scope.listEntries();
					}
				});
			};
			$scope.listTenants(function () {
				shoppingCartSrv.buildForm($scope, $modal, submit);

			});
		}
	};

	/**
	 * ( not functional yet )
	 * if we wanna remove an existing cart from the database
	 * @param currentScope
	 * @param env
	 * @param name
	 */
	function removeCart(currentScope, env, name) {
		getSendDataFromServer(currentScope, ngDataApi, {
			"method": "get",
			"routeName": "http://dashboard-api.soajs.org/shoppingCart/cart/deleteCart",
			"params": {"env": env, 'name': name}
		}, function (error, response) {
			if (error) {
				currentScope.$parent.displayAlert('danger', error.message);
			}
			else {
				if (response) {
					currentScope.$parent.displayAlert('success', "Deleted Successfully");
					currentScope.listEntries();
				}
				else {
					currentScope.$parent.displayAlert('danger', "Could not delete");
				}
			}
		});
	}


	/**
	 * after a tenant is selected we call this function to get the users
	 * for thre specifired tenants.
	 * @param tenantId
	 * @param callback
	 */
	$scope.getusers = function (tenantId, callback) {
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/urac/admin/listUsers",
			"params": {'tId': tenantId}
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayAlert('danger', error.message);
			}
			else {
				$scope.users = [];

				response.forEach(function (resp) {
					var myUser = {
						"v": resp._id,
						"l": resp.username
					};
					$scope.users.push(myUser);
					callback();
				});
			}
		});
	}


	//if scope.access.list is allowed, call listEntries
	if ($scope.access.listAll) {
		$scope.listEntries();
	}


	function prettyRecord(record) {
		var output = "<h2>" + record.user.username + "</h2>";
		output += put("ID", record._id);
		output += put("Date Created", new Date(record.created).toString()); // "<div class='title'>Date Created<span class='data'>"+ new Date(record.created).toString() +"</span></div>";
		output += put("Date Modified", new Date(record.modified).toString());
		record.items.forEach(function (item) {
			output += "<div class='fieldset'>";
			output += "<div class='legend'>" + item.title + "</div>";
			output += put("Image", item.imagePath);
			output += put("Price", item.price);
			output += put("Groupt ID", item.groupId);
			output += put("Merchant Id", item.merchantId);
			output += put("GTIN", item.GTIN);
			output += put("Currency", item.currency);
			output += put("Quantity", item.quantity);

			Object.keys(item.filters).forEach(function (key) {
				output += put(key, item.filters[key]);
			});
			output += put("Shipping Price", item.shippingPrice);
			item.shippingMethods.forEach(function (shippingMethod) {
				output += "<div class='shippingMethods'><h5>" + shippingMethod.methodeName + "</h5>";
				output += put("id", shippingMethod.id);
				output += put("Price", shippingMethod.price);
				output += put("Selected", shippingMethod.selected);
				output += "</div>";

			});
			output += "</div>";
		});
		//output += put();

		return output;
	}

	function put($title, $data) {
		return $data ? ("<div class='title'>" + $title + "<span class='data'>" + $data + "</span></div>") : "";

	}
}]);