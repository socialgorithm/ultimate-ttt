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
  var subBoardIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
  var mainIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

  _classCallCheck(this, Cell);

  this.player = player;
  this.subBoardIndex = subBoardIndex;
  this.mainIndex = mainIndex;

  return this;
};

exports.default = Cell;
module.exports = exports["default"];
//# sourceMappingURL=Cell.js.map