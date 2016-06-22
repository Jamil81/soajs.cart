var provDb = db.getSiblingDB('cart_core_provision');
//provDb.dropDatabase();

var files = listFiles('./products');
for (var i = 0; i < files.length; i++) {
    load(files[i].name);
}

provDb.products.drop();

var records = [];
records.push(product1);
provDb.products.insert(records);


/* Indexes for products */
provDb.products.ensureIndex({ code: 1 }, { unique: true });
provDb.products.ensureIndex({ 'packages.code': 1 } );