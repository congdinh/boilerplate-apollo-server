"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ioredis = _interopRequireDefault(require("ioredis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("dotenv").config();

var redis = new _ioredis["default"]({
  host: process.env.REDIS_DEFAULT_HOST,
  port: process.env.REDIS_DEFAULT_PORT,
  db: process.env.REDIS_DEFAULT_DB_NAME,
  retry_strategy: function retry_strategy(options) {
    return Math.max(options.attempt * 100, 3000);
  }
});
var _default = redis;
exports["default"] = _default;