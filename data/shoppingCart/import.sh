#!/bin/bash


export SOAJS_ENV=Dev
export SOAJS_SRVIP=127.0.0.1
export SOAJS_PROFILE=/opt/soajs/node_modules/soajs.cart/profile/test.js
pushd ./provision
mongo ./oauth_urac.js
mongo ./provision.js
mongo ./product.js
mongo ./environment.js
mongo ./services.js
popd
pushd ./urac
mongo ./urac.js
popd
pushd ./shoppingcart
mongo ./shoppingcart.js
popd