'use strict';

exports.__esModule = true;
exports.ConnectedObserver = undefined;

var _dec, _class; /**
                   * Created by istrauss on 9/11/2017.
                   */

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _aureliaFramework = require('aurelia-framework');

var _store = require('../store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConnectedObserver = exports.ConnectedObserver = (_dec = (0, _aureliaFramework.subscriberCollection)(), _dec(_class = function () {

    /**
     * The connected decorator, connects the property to the store by subscribing it to the store for changes.
     * @param property - The property (on obj) to connect store changes to.
     * @param obj - The object to connect store changes to.
     * @param storePath - The path (in the store) to get connection changes from.
       * @returns {Function}
     */
    function ConnectedObserver(property, obj, storePath) {
        _classCallCheck(this, ConnectedObserver);

        this.taskQueue = _aureliaFramework.Container.instance.get(_aureliaFramework.TaskQueue);
        this.store = _aureliaFramework.Container.instance.get(_store.Store);
        this.property = property;
        this.obj = obj;
        this.storePath = storePath;
    }

    ConnectedObserver.prototype.getValue = function getValue() {
        return this.storeValue;
    };

    ConnectedObserver.prototype.setValue = function setValue(newValue) {
        var descriptor = Object.getOwnPropertyDescriptor(this.obj.prototype, this.property);
        return descriptor.set.call(this.obj, newValue);
    };

    ConnectedObserver.prototype.connect = function connect() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    };

    ConnectedObserver.prototype.disconnect = function disconnect() {
        this.unsubscribeFromStore();
    };

    ConnectedObserver.prototype.updateFromStore = function updateFromStore() {
        var _this = this;

        var storeValue = (0, _get3.default)(this.store.getState(), this.storePath);

        if (this.storeValue !== storeValue) {
            this.previousStoreValue = this.storeValue;
            this.storeValue = storeValue;

            this.taskQueue.queueMicroTask(function () {
                _this.callSubscribers(_this.storeValue, _this.previousStoreValue);
            });
        }
    };

    ConnectedObserver.prototype.subscribe = function subscribe(context, callable) {
        if (!this.hasSubscribers()) {
            this.connect();
        }
        this.addSubscriber(context, callable);
    };

    ConnectedObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
        var result = this.removeSubscriber(context, callable);

        if (result && !this.hasSubscribers()) {
            this.disconnect();
            this.previousStoreValue = undefined;
        }

        return result;
    };

    return ConnectedObserver;
}()) || _class);