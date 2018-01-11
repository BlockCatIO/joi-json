'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var utils = require('./utils');

var BaseSchema = require('./base');

var StringSchema = function (_BaseSchema) {
    _inherits(StringSchema, _BaseSchema);

    function StringSchema() {
        _classCallCheck(this, StringSchema);

        return _possibleConstructorReturn(this, (StringSchema.__proto__ || Object.getPrototypeOf(StringSchema)).call(this, 'string'));
    }

    _createClass(StringSchema, [{
        key: 'parse',
        value: function parse(config, engine) {

            if (config.trim === null) {

                config.trim = true;
            }

            var schema = _get(StringSchema.prototype.__proto__ || Object.getPrototypeOf(StringSchema.prototype), 'parse', this).call(this, config, engine);

            if (config.trim === undefined) {

                // auto-trim string
                schema = schema.trim();
            }

            return schema;
        }
    }, {
        key: 'updateSchema',
        value: function updateSchema(state, key, value) {

            // don't trim if schema is set to false - Joi does have a way to turn off trim()
            if (key === 'trim' && utils.parseBoolean(value) === false) {

                return;
            }

            if (key === 'regex' && !(value instanceof RegExp)) {
                value = new RegExp(value);
            }

            return _get(StringSchema.prototype.__proto__ || Object.getPrototypeOf(StringSchema.prototype), 'updateSchema', this).call(this, state, key, value);
        }
    }]);

    return StringSchema;
}(BaseSchema);

module.exports = StringSchema;