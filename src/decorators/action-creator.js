import {Container} from 'aurelia-dependency-injection';
import {Store} from '../store';

export function actionCreator() {
    return function(target, name, descriptor) {

        target.prototype.create = target.prototype.create || function() {
            throw new Error(target.constructor.name + ' does not have a valid implementation of create().');
        };

        target.prototype.dispatch = target.prototype.dispatch || function(...rest) {
              return Container.instance.get(Store).dispatch(
                  this.create.apply(this, rest)
              );
        }
    }
}
