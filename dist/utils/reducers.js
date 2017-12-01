"use strict";

exports.__esModule = true;
exports.restrictReducerToNamespace = restrictReducerToNamespace;
/**
 * Created by Ishai on 12/21/2016.
 */

function restrictReducerToNamespace(reducer, namespace) {
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
    };
}