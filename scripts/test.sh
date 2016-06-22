#!/bin/bash

echo Preparing test enviroment
export SOAJS_ENV=Dev
export SOAJS_SRVIP=127.0.0.1
export SOAJS_PROFILE=/opt/soajs/node_modules/soajs.cart/profile/test.js

echo Done
echo ______________________________
env | grep SOAJS
echo ______________________________
