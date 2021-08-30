"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Board {
    constructor() {
        this._winner = undefined;
    }
    set winner(value) {
        if (value !== undefined && value !== null) {
            this._winner = value;
        }
    }
    get winner() {
        return this._winner;
    }
    getMoves() {
        return this.moves;
    }
}
exports.default = Board;
//# sourceMappingURL=Board.js.map