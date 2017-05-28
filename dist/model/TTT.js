"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TTT = (function () {
    function TTT() {
        this._winner = undefined;
    }
    Object.defineProperty(TTT.prototype, "winner", {
        get: function () {
            return this._winner;
        },
        set: function (value) {
            if (value !== undefined && value !== null) {
                this._winner = value;
            }
        },
        enumerable: true,
        configurable: true
    });
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