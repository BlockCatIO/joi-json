'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./utils');

var Parser = require('./parser');

var SchemaBuilder = function () {
    function SchemaBuilder(parser) {
        _classCallCheck(this, SchemaBuilder);

        this.parser = parser;
    }

    _createClass(SchemaBuilder, [{
        key: 'build',
        value: function build(config) {

            if (utils.isString(config) || config['@schema']) {

                return this.parser.parse(config);
            } else {

                var schema = {};

                for (var key in config) {

                    var value = config[key];

                    schema[key] = this.parser.parse(value);
                }

                return schema;
            }
        }
    }]);

    return SchemaBuilder;
}();

function resolveEngines() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

        for (var _iterator = arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;


            try {

                return require(name);
            } catch (err) {

                // engine not found
            }
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

function parser(engine) {

    return new Parser(engine);
}

function builder(engine) {

    if (!engine) {

        engine = resolveEngines('joi', 'lov');

        if (!engine) {

            throw new Error('cannot find validation engine');
        }
    }

    return new SchemaBuilder(parser(engine));
}

module.exports = {

    builder: builder,

    parser: parser
};