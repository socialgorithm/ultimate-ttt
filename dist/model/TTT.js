"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TTT = (function () {
    function TTT() {
    }
    TTT.prototype.getMoves = function () {
        return this.moves;
    };
    TTT.prototype.isFull = function () {
        return this.moves === this.maxMoves;
    };
    return TTT;
}());
exports.default = TTT;
//# sourceMappingURL=TTT.js.map