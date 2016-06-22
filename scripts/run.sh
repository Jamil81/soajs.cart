#!/bin/bash

echo Preparing run enviroment
export SOAJS_ENV=DEV
export SOAJS_SRVIP=127.0.0.1
export SOAJS_PROFILE=/opt/soajs/node_modules/soajs.cart/profile/single.js

echo Done
echo ______________________________
env | grep SOAJS
echo ______________________________
