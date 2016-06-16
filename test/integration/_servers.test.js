"use strict";
var shell = require('shelljs');
var assert = require('assert');
var helper = require("../helper.js");
 var sampleData =  helper.requireModule("../../../data/shoppingCart/index.js");
var mainService, urac, controller;

describe("importing sample data", function () {

    it("do import", function (done) {
       // here we should insert all relevant provision dataW
        shell.pushd(sampleData.dir);
        shell.exec("chmod +x " + sampleData.shell, function (code) {
            assert.equal(code, 0);
            shell.exec(sampleData.shell, function (code) {
                assert.equal(code, 0);
                shell.popd();
                done();
            });
        });

    });

    after(function (done) {
        // start controller
        controller = require("soajs.controller");

        setTimeout(function () {
            // start the urac or other services, if needed
            urac = require("soajs.urac");
            // start current service
            mainService = helper.requireModule('./index');

            // wait for all services to start & register before starting tests
            setTimeout(function () {
                require("./service.test.js");
                done();
            }, 1000);
        }, 1000);
    });
});