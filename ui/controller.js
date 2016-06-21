"use strict";
console.log("in controller");
var shoppingCart = soajsApp.components;
shoppingCart.controller('shoppingCartCtrl', ['$scope', '$modal', 'ngDataApi', 'shoppingCartSrv', function ($scope, $modal, ngDataApi, shoppingCartSrv) {
	$scope.$parent.isUserLoggedIn();

	//define the permissions
	var permissions = {
		'listAll': ['shoppingCart', '/cart/getcarts']
	};

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
					response[inc].items.forEach(function (item) {
						myItems += myItems != "" ? "," : "";
						console.log(item);
						$scope.data[inc].itemsCount = $scope.data[inc].itemsCount ? $scope.data[inc].itemsCount + 1 : 1;// ja this should sbe reducable
						myItems += item.quantity + " " + item.title + (item.quantity > 0 ? "(s)" : "");
					});
					$scope.data[inc].items = myItems;
				}
				shoppingCartSrv.printGrid($scope, $scope.data);
			}

		});
	};


	//function that prints one data record to the console
	$scope.viewEntry = function (oneDataRecord) {
		console.log(oneDataRecord);
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
			output += put("Merchant Id" , item.merchantId);
			output += put("GTIN" , item.GTIN);
			output += put("Currency" , item.currency);
			output += put("Quantity" , item.quantity);

			Object.keys(item.filters).forEach(function(key) {
				output+= put(key , item.filters[key]);
			});
			output += put("Shipping Price" , item.shippingPrice);
			item.shippingMethods.forEach(function (shippingMethod) {
				output+= "<div class='shippingMethods'><h5>"+shippingMethod.methodeName+"</h5>";
				output+= put("id" , shippingMethod.id);
				output+= put("Price" , shippingMethod.price);
				output+= put("Selected" , shippingMethod.selected);
				output+= "</div>";

			});





			output += "</div>";
		});
		//output += put();

		return output;
	}

	function put($title, $data) {
		return  $data ? ("<div class='title'>" + $title + "<span class='data'>" + $data + "</span></div>") : "";

	}
}]);