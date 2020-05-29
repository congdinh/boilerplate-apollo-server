"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("../external-libs/mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("dotenv").config();

var collectionPrefix = process.env.MONGO_COLLECTION_PREFIX;

var _default = function _default(_ref) {
  var schema = _ref.schema,
      modelName = _ref.modelName,
      collectionName = _ref.collectionName;
  return _mongoose["default"].model(modelName, new _mongoose["default"].Schema(schema, {
    collection: "".concat(collectionPrefix, "_").concat(collectionName),
    versionKey: false,
    strict: false
  }));
};

exports["default"] = _default;