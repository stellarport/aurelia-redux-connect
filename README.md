# aurelia-redux-connect

## Using this package

### Create the store and register it in aurelia's DI
First, you need to setup your store. You should do this in your main.js **before aurelia starts up**:
```js
import {Store} from 'aurelia-redux-connect';

export async function configure(aurelia) {
   // ... 
   
   Store.createAndRegister(...); //Just pass arguments as you would to redux.createStore()
   
   // afterwards...
   
   await aurelia.start();
}
```

### Using the store in a view model
```js
import {inject} from 'aurelia-framework';
import {Store} from 'aurelia-redux-connect';

@inject(Store)
export class SomeViewModel {
    constructor(store) {
        this.store = store;
    }
    
    useStoreValue() {
        const storeValue = this.store.getState().parent.value;
        
        // do something with storeValue...
    }
}
```

### Using the connected decorator
aurelia-redux-connect provides a very useful `@connected` decorator that can be used in a view model:
```js
import {connected} from 'aurelia-redux-connect';

export class SomeViewModel {
    @connected('parent.value')
    storeValue;
    
    useStoreValue() {       
        // do something with storeValue...
    }
}
```

Note: You can also use `@connected` in a regular class (that is not a view model). However, keep in mind, you must call `.bind()` manually for
the properties to connect to store and `.unbind()` manually for the the properties to disconnect from the store. On viewmodels, the aurelia framework will
execute the `.bind()` and `unbind()` methods automatically (which `@connected` uses to connect and disconnect itself).

### Using the actionCreator decorator
aurelia-redux-connect also exposes an `@actionCreator` decorator:
```
import {actionCreator} from 'aurelia-redux-connect';

@actionCreator()
@inject(Dep1, Dep2)
export class UpdateStoreDataActionCreator {
   constructor(dep1, dep2) {
       this.dep1 = dep1;
       this.dep2 = dep2;
   }
   
   //All action creators must define a create method
   //Calling actionCreator.dispatch() will delegate the action creation to actionCreator.create()
   create(arg1, arg2) {
       return (dispatch, getState) => {
           this.dep1.doSomething(arg1);
       }
   }
}
```

Then, later in some other class (perhaps a viewmodel):
```js
import {inject} from 'aurelia-framework';
import {UpdateStoreDataActionCreator} from './path/to/update-store-data-action-creator';

@inject(UpdateStoreDataActionCreator)
export class SomeViewModel {
    constructor(udpateStoreData) {
        this.udpateStoreData = udpateStoreData;
    }
    
    updateStoreData(newData) {
        this.udpateStoreData.dispatch(newData);
    }
}
```

### Putting it all together
A very common way of using aurelia-redux-connect is via getters/setters like so:
```js
import {inject} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {UpdateStoreValueActionCreator} from './path/to/update-store-data-action-creator';

@inject(UpdateStoreValueActionCreator)
export class SomeViewModel {
    @connected('parent.value')
    get storeValue() {
        // No need to define this. @connected will set the getter to obtain storeValue from the store.
    }
    set storeValue(newValue) {
        this.udpateStoreValue.dispatch(newValue);
    }
    
    constructor(udpateStoreValue) {
        this.udpateStoreValue = udpateStoreValue;
    }
}
```

And in the view:
```html
<input type="text" value.bind="storeValue & debounce" />
```

This will ensure that newValues are dispatched to the store and the store values are bound into the input.

### Using restrictReducerToNamespace
`restrictReducerToNamespace` is a utility not really related to Aurelia. It will allow you to restrict a reducer to only execute if the `action.type`
begins with that namespace value (to prevent sections of the reducer tree from executing when they don't have to). 

Here is the definition of `restrictReducerToNamespace`:
```js
export function restrictReducerToNamespace(reducer, namespace) {
    return function (state, action) {
        // If state is already defined and action.type does not begin with the namespace value, just return the state value.
        if (state !== undefined && action.type.indexOf(namespace) !== 0) {
            return state;
        }

        // Otherwise, if the state is not yet defined (i.e. initial call to the store)
        // or
        // if the action.type does begin with namespace
        // then
        // execute the reducer
        return reducer(state, action);
    }
}
```
pretty self explanantory.

## Transpiling

To transpile to dist:

```shell
npm start -- transpile
```

