'use strict';

exports.__esModule = true;
exports.connected = connected;

var _connectedObserver = require('./connected-observer');

/**
 * The connected decorator, connects the property to the store by subscribing it to the store for changes.
 * @param path - The path by which to get the desired value from the store.
 * @param [options] see description of options on the ConnectedObserver
 * @returns {Function}
 */
function connected(path, options) {

    return function (target, name, descriptor) {
        if (!path) {
            throw new Error('in order for ' + name + ' to be connected, a path must be specified.');
        }

        delete descriptor.initializer;
        delete descriptor.writable;
        delete descriptor.value;

        descriptor.configurable = true;
        descriptor.enumerable = true;

        descriptor.get = function () {
            return this._au_redux_observers && this._au_redux_observers[name] ? this._au_redux_observers[name].getValue() : undefined;
        };

        descriptor.get.getObserver = function getObserver(obj) {
            if (!obj._au_redux_observers) {
                obj._au_redux_observers = {};
            }

            if (!obj._au_redux_observers[name]) {
                obj._au_redux_observers[name] = new _connectedObserver.ConnectedObserver(name, obj, path, options);
            }

            return obj._au_redux_observers[name];
        };

        descriptor.set = descriptor.set || function () {
            throw new Error('You are not allowed to set connected properties directly. Try dispatching an action against the store instead (perhaps from a virtual setter).');
        };

        var subscription = void 0;

        var originalBind = target.bind;
        var originalUnbind = target.unbind;

        target.bind = function bind() {
            subscription = subscriptionFactory(name);

            var result = descriptor.get.getObserver(this).subscribe(this, subscription);

            if (originalBind) {
                for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                    rest[_key] = arguments[_key];
                }

                originalBind.apply(this, rest);
            }
        };

        target.unbind = function unbind() {
            var result = descriptor.get.getObserver(this).unsubscribe(this, subscription);

            if (originalUnbind) {
                for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    rest[_key2] = arguments[_key2];
                }

                originalUnbind.apply(this, rest);
            }
        };

        return descriptor;
    };
} /**
   * Created by istrauss on 8/25/2017.
   */

function subscriptionFactory(name) {
    return function (newValue, oldValue) {
        if (this[name + 'Changed']) {
            this[name + 'Changed'](newValue, oldValue);
        }
    };
}