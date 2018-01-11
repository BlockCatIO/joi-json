'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./utils');

var BaseSchema = function () {
    function BaseSchema(engineFuncName) {
        _classCallCheck(this, BaseSchema);

        this.engineFuncName = engineFuncName;
    }

    _createClass(BaseSchema, [{
        key: 'parse',
        value: function parse(config, engine) {

            // Note: Joi will clone objects on changes and thus we need to update the schema reference
            var state = { schema: this._createSchema(engine), engine: engine };

            for (var key in config) {

                this.updateSchema(state, key, config[key]);
            }

            return state.schema;
        }
    }, {
        key: 'updateSchema',
        value: function updateSchema(state, key, value) {

            if (utils.isFunction(state.schema[key])) {

                if (value === null) {

                    state.schema = state.schema[key]();
                } else {

                    state.schema = state.schema[key](value);
                }

                return true;
            }
        }
    }, {
        key: '_createSchema',
        value: function _createSchema(engine) {

            return engine[this.engineFuncName]();
        }
    }]);

    return BaseSchema;
}();

module.exports = BaseSchema;