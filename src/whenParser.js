"use strict";

const convert = require("./convert");
const utils = require("./utils");

// Mostly a copy of ./parser.js/parseSchemaString, slightly modified.
function parseSchemaString( value ) {

    let schemaString = value;
    // No need to parse if if it isn't config, but just a string.
    if( schemaString.indexOf( ':' ) == -1 && schemaString.indexOf( ',' ) == -1 ) {
        return schemaString;
    }

    let type = null;
    let schema = {};
    // If we have a type, parse it.
    if( schemaString.indexOf( ':' ) > -1 ) {

        let typeParts = schemaString.split( ':', 2 );

        type = typeParts[ 0 ];
        schema = {
            "@type": type,
        };
        // Reset the string to parse the rest.
        schemaString = typeParts[ 1 ];
    }

    // Parse any further config.
    if( schemaString.length > 0 ) {

        for ( let valuePart of schemaString.split( "," ) ) {

            const parts = valuePart.split( '=', 2 );
            let key = parts[ 0 ].trim();
            let value = parts[ 1 ];

            if( value ) {
                value = value.trim();
            }
            else {
                value = null;
            }

            value = convert( type, key, value );

            schema[ key ] = value;
        }
    }

    return schema;
}

const whenParser = {

    parse( value, engine ) {

        let condition = value.condition ? value.condition : null;
        let options = {};

        if( value.options ) {
            options = whenParser.parseOptions( value.options, engine );
        }

        return [ condition, options ];
    },

    parseOptions( options, engine ) {

        let returnOptions = {};
        let whenOptions = {};

        if( utils.isString( options ) ) {

            whenOptions = parseSchemaString( options );
        }
        // Copy, don't mutate.
        else {

            whenOptions = { ...options };
        }

        // Only continue if we do have a valid object.
        if( utils.isObject( whenOptions ) ) {

            const keys = Object.keys( whenOptions );
            for ( let i = 0; i < keys.length; i += 1 ) {

                const key = keys[ i ];
                const validOptions = [ "is", "then", "otherwise" ];
                if( validOptions.includes( key ) ) {

                    returnOptions[ key ] = whenParser.parseValidOption( whenOptions[key], engine );
                }
            }
        }

        return returnOptions;
    },

    parseValidOption( options, engine ) {

        let returnValues = null;
        // Convert array (alternatives).
        if( utils.isArray( options ) ) {

            returnValues = [];
            for ( let i = 0; i < options.length; i += 1 ) {

                returnValues[i] = whenParser.parseValidOption( options[ i ], engine );
            }
        }
        // Convert normal config object.
        else if( utils.isObject( options ) ) {

            let schema = engine;
            const keys = Object.keys( options );
            for ( let i = 0; i < keys.length; i += 1 ) {

                const key = keys[ i ];
                // Chain them all together.
                schema = whenParser.translateValue( key, options[ key ], schema );
            }

            if( keys.length > 0 ) {

              returnValues = schema;
            }
        }
        // Check to convert string to object.
        else if( utils.isString(options) ) {

            const expandedOptions = parseSchemaString( options );
            // Did we get a config object?
            if( utils.isObject( expandedOptions ) ) {

                returnValues = whenParser.parseValidOption( expandedOptions, engine );
            }
            // Still a string.
            else {
                returnValues = expandedOptions;
            }
        }
        else {
            // Use option as is.
            returnValues = options;
        }

        return returnValues;
    },

    translateValue( key, value, schema ) {

        let optionValue = value;
        // Handle special case of @type, where type is the function name.
        if( key === '@type' ) {

          return schema[ optionValue ]();
        }

        // All other config will have the key be the function name.
        if( utils.isFunction( schema[ key ] ) ) {

            // Convert to regexp object if needed.
            if( key === 'regex' && !( optionValue instanceof RegExp ) ) {

                optionValue = new RegExp( optionValue );
            }

            if( optionValue === null ) {

                return schema[ key ]();
            }
            else {
                return schema[ key ]( optionValue );
            }
        }
    },
};

module.exports = whenParser;
