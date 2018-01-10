'use strict';

const whenParser = require( './whenParser' );
const utils = require( './utils' );

class BaseSchema {

    constructor( engineFuncName ) {

        this.engineFuncName = engineFuncName;
    }

    parse( config, engine ) {

        // Note: Joi will clone objects on changes and thus we need to update the schema reference
        let state = { schema: this._createSchema( engine ), engine };

        // Check for when, and put it last as it changes type.
        let keys = Object.keys( config );
        if ( keys.includes('when') ) {

          const index = keys.indexOf( 'when' );
          keys.splice( index, 1 );
          keys.push( 'when' );
        }

        for (let i = 0; i < keys.length; i += 1) {

            const key = keys[ i ];
            this.updateSchema( state, key, config[ key ], engine );
        }

        return state.schema;
    }

    updateSchema( state, key, value, engine ) {

        // All config keys should be functions on the engine/schema.
        if( utils.isFunction( state.schema[ key ] ) ) {

            // When needs 2 arguments, not 1, parse value to get those.
            if( key === 'when' ) {

                const [ condition, options ] = whenParser.parse( value, engine );
                state.schema = state.schema[ key ]( condition, options );
            }
            // Null indicates call with no argument.
            else if( value === null ) {

                state.schema = state.schema[ key ]();
            }
            // Call key function with value argument.
            else {

                state.schema = state.schema[ key ]( value );
            }

            return true;
        }
    }

    _createSchema( engine ) {

        return engine[ this.engineFuncName ]();
    }
}

module.exports = BaseSchema;
