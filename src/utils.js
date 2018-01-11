'use strict';

const isObject = require( './utils/is_object' );

function isFunction( value ) {

    return (!!value && value.constructor === Function);
}

function isPromise( value ) {

    return ((!!value && isFunction( value.then ) && isFunction( value.catch ) ));
}

function clone( value ) {

    if( !isObject( value ) ) {

        return value;
    }

    return Object.assign( {}, value );
}

module.exports = {

    clone,

    isObject,

    isString: require( './utils/is_string' ),

    isArray: Array.isArray,

    isFunction,

    isPromise,

    parseBoolean: require( './utils/parse_boolean' ),

    templateString: require( './utils/template_string' )
};
