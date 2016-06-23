var core_services = [
	{
		"_id": ObjectId('57694c064932c523f467cf01'),
		"name": "urac",
		"group": "SOAJS Core Services",
		"port": 4001,
		"requestTimeout": 30,
		"requestTimeoutRenewal": 5,
		"src": {
			"provider": "github",
			"owner": "soajs",
			"repo": "soajs.urac",
			"cmd": [
				"/etc/init.d/postfix start"
			]
		},
		"versions": {
			"1": {
				"extKeyRequired": true,
				"apis": [
					{
						"l": "Login",
						"v": "/login",
						"group": "Guest"
					},
					{
						"l": "Register",
						"v": "/join",
						"group": "Guest"
					},
					{
						"l": "Validate Register",
						"v": "/join/validate",
						"group": "Guest"
					},
					{
						"l": "Logout",
						"v": "/logout",
						"group": "Guest"
					},
					{
						"l": "Forgot Password",
						"v": "/forgotPassword",
						"group": "Guest"
					},
					{
						"l": "Reset Password",
						"v": "/resetPassword",
						"group": "Guest"
					},
					{
						"l": "Check If Username Exists",
						"v": "/checkUsername",
						"group": "Guest"
					},
					{
						"l": "Validate Change Email",
						"v": "/changeEmail/validate",
						"group": "Guest"
					},
					{
						"l": "Get User Info",
						"v": "/account/getUser",
						"group": "My Account"
					},
					{
						"l": "Change Password",
						"v": "/account/changePassword",
						"group": "My Account"
					},
					{
						"l": "Change Email",
						"v": "/account/changeEmail",
						"group": "My Account"
					},
					{
						"l": "Edit Profile",
						"v": "/account/editProfile",
						"group": "My Account"
					},
					{
						"l": "Add new User",
						"v": "/admin/addUser",
						"group": "Administration"
					},
					{
						"l": "Change User Status",
						"v": "/admin/changeUserStatus",
						"group": "Administration"
					},
					{
						"l": "List Users",
						"v": "/admin/listUsers",
						"group": "Administration"
					},
					{
						"l": "Get User Record",
						"v": "/admin/getUser",
						"group": "Administration"
					},
					{
						"l": "Edit User Record",
						"v": "/admin/editUser",
						"group": "Administration"
					},
					{
						"l": "Edit User Config",
						"v": "/admin/editUserConfig",
						"group": "Administration"
					},
					{
						"l": "List Groups",
						"v": "/admin/group/list",
						"group": "Administration"
					},
					{
						"l": "Add new Group",
						"v": "/admin/group/add",
						"group": "Administration"
					},
					{
						"l": "Edit Group",
						"v": "/admin/group/edit",
						"group": "Administration"
					},
					{
						"l": "Delete Group",
						"v": "/admin/group/delete",
						"group": "Administration"
					},
					{
						"l": "Add Users to Group",
						"v": "/admin/group/addUsers",
						"group": "Administration"
					},
					{
						"l": "Get all Users & Groups",
						"v": "/admin/all",
						"group": "Administration"
					}
				],
				"awareness": true
			}
		}
	}


	,
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