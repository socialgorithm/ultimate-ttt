"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Cell = (function () {
    function Cell(coordinates, player, subBoardIndex, mainIndex) {
        if (coordinates === void 0) { coordinates = [0, 0]; }
        if (player === void 0) { player = constants_1.UNPLAYED; }
        if (subBoardIndex === void 0) { subBoardIndex = -1; }
        if (mainIndex === void 0) { mainIndex = -1; }
        this.coordinates = coordinates;
        this.player = player;
        this.subBoardIndex = subBoardIndex;
        this.mainIndex = mainIndex;
    }
    Cell.prototype.copy = function () {
        return new Cell(this.coordinates, this.player, this.subBoardIndex, this.mainIndex);
    };
    Cell.prototype.isPlayed = function () {
        return this.player > constants_1.RESULT_TIE;
    };
    return Cell;
}());
exports.default = Cell;
//# sourceMappingURL=Cell.js.map