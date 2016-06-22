var db = db.getSiblingDB('test_shoppingcart');
//provDb.dropDatabase();
/* carts */
var files = listFiles('./carts');
for(var i = 0; i < files.length; i++) {
	load(files[i].name);
}
db.carts.drop();
var records = [];
records.push(cart2);
records.push(cart1);
db.carts.insert(records);
