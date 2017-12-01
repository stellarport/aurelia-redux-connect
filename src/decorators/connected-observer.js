/**
 * Created by istrauss on 9/11/2017.
 */

import _get from 'lodash/get';
import {TaskQueue, Container, subscriberCollection} from 'aurelia-framework';
import {Store} from '../store';

@subscriberCollection()
export class ConnectedObserver {

    /**
     * The connected decorator, connects the property to the store by subscribing it to the store for changes.
     * @param property - The property (on obj) to connect store changes to.
     * @param obj - The object to connect store changes to.
     * @param storePath - The path (in the store) to get connection changes from.

     * @returns {Function}
     */
    constructor(property, obj, storePath) {
        this.taskQueue = Container.instance.get(TaskQueue);
        this.store = Container.instance.get(Store);
        this.property = property;
        this.obj = obj;
        this.storePath = storePath;
    }

    getValue() {
        return this.storeValue;
    }

    setValue(newValue) {
        const descriptor = Object.getOwnPropertyDescriptor(this.obj.prototype, this.property);
        return descriptor.set.call(this.obj, newValue);
    }

    connect() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    disconnect() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const storeValue = _get(this.store.getState(), this.storePath);

        if (this.storeValue !== storeValue) {
            this.previousStoreValue = this.storeValue;
            this.storeValue = storeValue;

            this.taskQueue.queueMicroTask(() => {
                this.callSubscribers(this.storeValue, this.previousStoreValue);
            });
        }
    }

    subscribe(context, callable) {
        if (!this.hasSubscribers()) {
            this.connect();
        }
        this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
        const result = this.removeSubscriber(context, callable);

        if (result && !this.hasSubscribers()) {
            this.disconnect();
            this.previousStoreValue = undefined;
        }

        return result;
    }
}
