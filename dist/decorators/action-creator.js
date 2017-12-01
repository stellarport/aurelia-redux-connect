'use strict';

exports.__esModule = true;
exports.actionCreator = actionCreator;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _store = require('../store');

function actionCreator() {
    return function (target, name, descriptor) {

        target.prototype.create = target.prototype.create || function () {
            throw new Error(target.constructor.name + ' does not have a valid implementation of create().');
        };

        target.prototype.dispatch = target.prototype.dispatch || function () {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            return _aureliaDependencyInjection.Container.instance.get(_store.Store).dispatch(this.create.apply(this, rest));
        };
    };
}