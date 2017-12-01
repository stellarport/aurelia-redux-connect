/**
 * Created by istrauss on 8/25/2017.
 */

import {ConnectedObserver} from './connected-observer';

/**
 * The connected decorator, connects the property to the store by subscribing it to the store for changes.
 * @param path - The path by which to get the desired value from the store.
 * @param [options] see description of options on the ConnectedObserver
 * @returns {Function}
 */
export function connected(path, options) {

    return function(target, name, descriptor) {
        if (!path) {
            throw new Error('in order for ' + name + ' to be connected, a path must be specified.');
        }

        delete descriptor.initializer;
        delete descriptor.writable;
        delete descriptor.value;

        descriptor.configurable = true;
        descriptor.enumerable = true;

        descriptor.get = function() {
            return this._au_redux_observers && this._au_redux_observers[name] ?
                this._au_redux_observers[name].getValue() :
                undefined;
        };

        descriptor.get.getObserver = function getObserver(obj) {
            if (!obj._au_redux_observers) {
                obj._au_redux_observers = {};
            }

            if (!obj._au_redux_observers[name]) {
                obj._au_redux_observers[name] = new ConnectedObserver(name, obj, path, options);
            }

            return obj._au_redux_observers[name];
        };

        descriptor.set = descriptor.set || function() {
            throw new Error('You are not allowed to set connected properties directly. Try dispatching an action against the store instead (perhaps from a virtual setter).');
        };

        let subscription;

        const originalBind = target.bind;
        const originalUnbind = target.unbind;

        target.bind = function bind(...rest) {
            subscription = subscriptionFactory(name);

            const result = descriptor.get.getObserver(this)
                .subscribe(this, subscription);

            if (originalBind) {
                originalBind.apply(this, rest);
            }
        };

        target.unbind = function unbind(...rest) {
            const result = descriptor.get.getObserver(this)
                .unsubscribe(this, subscription);

            if (originalUnbind) {
                originalUnbind.apply(this, rest);
            }
        };

        return descriptor;
    }
}


function subscriptionFactory(name) {
    return function (newValue, oldValue) {
        if (this[name + 'Changed']) {
            this[name + 'Changed'](newValue, oldValue);
        }
    }
}
