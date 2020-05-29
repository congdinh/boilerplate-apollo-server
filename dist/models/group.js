"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generateModel = _interopRequireDefault(require("./generateModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var schema = {
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  privacy: {
    type: String,
    required: true,
    "default": "OPEN"
  },
  priority: {
    type: Number,
    "default": 0
  },
  status: {
    type: Number,
    "default": 1
  },
  crawler: {
    begin_crawling_posts_at: Date,
    latest_crawled_posts_at: Date,
    latest_post_time: Date
  }
};

var _default = (0, _generateModel["default"])({
  schema: schema,
  modelName: "FacebookGroup",
  collectionName: "groups"
});

exports["default"] = _default;