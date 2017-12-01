/**
 * Created by istrauss on 1/7/2017.
 */

import {Container} from 'aurelia-framework';
import {createStore} from 'redux';

export class Store {
    static createAndRegister(...rest){
        const store = createStore.apply(null, rest);
        Container.instance.registerInstance(Store, store);
    }
}
