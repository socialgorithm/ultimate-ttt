"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Cell {
    constructor(coordinates = [0, 0], player = Constants_1.UNPLAYED, subBoardIndex = -1, mainIndex = -1) {
        this.coordinates = coordinates;
        this.player = player;
        this.subBoardIndex = subBoardIndex;
        this.mainIndex = mainIndex;
    }
    copy() {
        return new Cell(this.coordinates, this.player, this.subBoardIndex, this.mainIndex);
    }
    isPlayed() {
        return this.player > Constants_1.RESULT_TIE;
    }
}
exports.default = Cell;
//# sourceMappingURL=Cell.js.map