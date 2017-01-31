'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (error, data) {
  return new Error(error.message.replace('%s', data), error.code);
};

module.exports = exports['default'];
//# sourceMappingURL=error.js.map