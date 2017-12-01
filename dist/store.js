'use strict';

exports.__esModule = true;
exports.Store = undefined;

var _aureliaFramework = require('aurelia-framework');

var _redux = require('redux');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by istrauss on 1/7/2017.
                                                                                                                                                           */

var Store = exports.Store = function () {
    function Store() {
        _classCallCheck(this, Store);
    }

    Store.createAndRegister = function createAndRegister() {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        var store = _redux.createStore.apply(null, rest);
        _aureliaFramework.Container.instance.registerInstance(Store, store);
    };

    return Store;
}();