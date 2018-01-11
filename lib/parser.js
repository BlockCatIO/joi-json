'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./utils');

var convert = require('./convert');

var BaseSchema = require('./base');

var StringSchema = require('./string');

var EmailSchema = require('./email');

var UUIDSchema = require('./uuid');

var ObjectSchema = require('./object');

var ArraySchema = require('./array');

var AlternativesSchema = require('./alternatives');

var types = {

    any: new BaseSchema('any'),

    string: new StringSchema('string'),

    number: new BaseSchema('number'),

    boolean: new BaseSchema('boolean'),

    date: new BaseSchema('date'),

    binary: new BaseSchema('binary'),

    email: new EmailSchema(),

    uuid: new UUIDSchema(),

    object: new ObjectSchema(parseSchema),

    array: new ArraySchema(parseSchema),

    alternatives: new AlternativesSchema(parseSchema)
};

function parseSchemaString(str) {

    var typeParts = str.split(':', 2);

    var type = typeParts[0];

    var schema = {

        '@type': type
    };

    if (typeParts.length > 1) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {

            for (var _iterator = typeParts[1].split(',')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var valuePart = _step.value;


                var parts = valuePart.split('=', 2);

                var key = parts[0].trim();

                var value = parts[1];

                if (value) {

                    value = value.trim();
                } else {

                    value = null;
                }

                value = convert(type, key, value);

                schema[key] = value;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    return schema;
}

function parseSchema(value, engine) {

    if (utils.isString(value)) {

        value = parseSchemaString(value);
    }

    var type = value['@type'];

    if (!type) {

        if (Array.isArray(value)) {

            // allow short form
            type = 'alternatives';
            value = { try: value };
        } else {

            if (value['@items'] || value['@ordered']) {

                type = 'array';
            } else {

                type = 'object';
            }
        }
    } else {

        // don't need this any more
        delete value.type;
    }

    var schemaParser = null;

    // Predefined type.
    if (types[type]) {
        schemaParser = types[type];
    }
    // Custom type - use Base schema parser.
    // If our engine has the custom type as a function,
    // allow usage of the type, treating it like any other simple type.
    else if (utils.isFunction(engine[type])) {
            schemaParser = new BaseSchema(type);
        }

    if (!schemaParser) {

        throw new Error('unknown type: ' + type);
    }

    return schemaParser.parse(value, engine);
}

var Parser = function () {
    function Parser(engine) {
        _classCallCheck(this, Parser);

        if (!engine) {

            throw new Error('missing engine');
        }

        this.engine = engine;
    }

    _createClass(Parser, [{
        key: 'parse',
        value: function parse(value) {

            return parseSchema(value, this.engine);
        }
    }], [{
        key: 'buildSchema',
        value: function buildSchema(schemaConfig, engine) {

            var schema = {};

            var parser = new Parser(engine);

            for (var key in schemaConfig) {

                var value = schemaConfig[key];

                schema[key] = parser.parse(value);
            }

            return schema;
        }
    }]);

    return Parser;
}();

module.exports = Parser;