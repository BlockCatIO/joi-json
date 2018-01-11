'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var utils = require('./utils');

var BaseSchema = require('./base');

var AlternativesSchema = function (_BaseSchema) {
    _inherits(AlternativesSchema, _BaseSchema);

    function AlternativesSchema(parseSchema) {
        _classCallCheck(this, AlternativesSchema);

        var _this = _possibleConstructorReturn(this, (AlternativesSchema.__proto__ || Object.getPrototypeOf(AlternativesSchema)).call(this, 'alternatives'));

        _this.parseSchema = parseSchema;
        return _this;
    }

    _createClass(AlternativesSchema, [{
        key: 'updateSchema',
        value: function updateSchema(state, key, value) {

            if (key === 'try') {

                if (!utils.isArray(value)) {

                    // convert to array
                    value = [value];
                }

                var schemas = [];

                var parseSchemaFunc = this.parseSchema;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;


                        var itemSchema = parseSchemaFunc.call(null, item, state.engine);

                        schemas.push(itemSchema);
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

                state.schema = state.schema.try.apply(state.schema, schemas);
                return true;
            }

            return _get(AlternativesSchema.prototype.__proto__ || Object.getPrototypeOf(AlternativesSchema.prototype), 'updateSchema', this).call(this, state, key, value);
        }
    }]);

    return AlternativesSchema;
}(BaseSchema);

module.exports = AlternativesSchema;