var shoppingCartNav = [
	{
		//main information
		'id': 'shoppingCart',
		'label': 'Shopping Cart',
		'url': '#/shoppingCart',
		'scripts': ['modules/DEV/shoppingCart/config.js','modules/DEV/shoppingCart/controller.js', 'modules/DEV/shoppingCart/service.js'],
		'tplPath': 'modules/DEV/shoppingCart/directives/list.tmpl',
		//permissions information
		'checkPermission': {
			'service': 'shoppingCart',
			'route': '/cart/getCarts'
		},
		'pillar': {
			'name': 'operate',
			'label': translation.operate[LANG],
			'position': 4
		},
		//menu & tracker information
		'icon': '',
		'mainMenu': true,
		'tracker': true,
		'ancestor': ['Home']
	}
];
navigation = navigation.concat(shoppingCartNav);
