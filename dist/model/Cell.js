"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Definition of each Cell on a SubBoard
 */
var Cell = function Cell() {
  var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  _classCallCheck(this, Cell);

  this.player = player;
  this.index = index;

  return this;
};

exports.default = Cell;
module.exports = exports["default"];
//# sourceMappingURL=Cell.js.map