'use strict';

const utils = require( './utils' );

const BaseSchema = require( './base' );

class StringSchema extends BaseSchema {

    constructor() {

        super( 'string' );
    }

    parse( config, engine ) {

        if( config.trim === null || config.trim === undefined ) {

            config.trim = true;
        }

        return super.parse( config, engine );
    }

    updateSchema( state, key, value, engine ) {

        // don't trim if schema is set to false - Joi does have a way to turn off trim()
        if( key === 'trim' && (utils.parseBoolean( value ) === false) ) {

            return;
        }

        if( key === 'regex' && !( value instanceof RegExp ) ) {
            value = new RegExp(value);
        }

        return super.updateSchema( state, key, value, engine );
    }
}

module.exports = StringSchema;
