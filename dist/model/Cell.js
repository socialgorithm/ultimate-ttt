"use strict";
exports.__esModule = true;
var Cell = (function () {
    function Cell(player, subBoardIndex, mainIndex) {
        if (player === void 0) { player = -1; }
        if (subBoardIndex === void 0) { subBoardIndex = -1; }
        if (mainIndex === void 0) { mainIndex = -1; }
        this.player = player;
        this.subBoardIndex = subBoardIndex;
        this.mainIndex = mainIndex;
        return this;
    }
    return Cell;
}());
exports["default"] = Cell;
//# sourceMappingURL=Cell.js.map