'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./utils');

function numberConverter(value) {

    return Number.parseInt(value);
}

function booleanCoverter(value) {

    if (value === undefined) {

        return true;
    }

    return utils.parseBoolean(value);
}

var Converter = function () {
    function Converter() {
        _classCallCheck(this, Converter);

        this.converterMap = {

            min: numberConverter,
            max: numberConverter,
            length: numberConverter,
            greater: numberConverter,
            less: numberConverter,
            precision: numberConverter,
            multiple: numberConverter,

            sparse: booleanCoverter,
            single: booleanCoverter,
            truncate: booleanCoverter,
            isRaw: booleanCoverter
        };
    }

    _createClass(Converter, [{
        key: 'convert',
        value: function convert(key, value) {

            var converterFunc = this.converterMap[key];

            if (!converterFunc) {

                return value;
            }

            return converterFunc(value);
        }
    }]);

    return Converter;
}();

var converters = {

    _default: new Converter()
};

function convert(type, key, value) {

    var converter = converters[type];

    if (!converter) {

        converter = converters._default;
    }

    return converter.convert(key, value);
}

module.exports = convert;