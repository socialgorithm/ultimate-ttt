"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Cell = (function () {
    function Cell(player, subBoardIndex, mainIndex) {
        if (player === void 0) { player = constants_1.UNPLAYED; }
        if (subBoardIndex === void 0) { subBoardIndex = -1; }
        if (mainIndex === void 0) { mainIndex = -1; }
        this._player = player;
        this._subBoardIndex = subBoardIndex;
        this._mainIndex = mainIndex;
        return this;
    }
    Cell.prototype.isPlayed = function () {
        return this.player !== constants_1.UNPLAYED;
    };
    Cell.prototype.setPlayer = function (value) {
        this._player = value;
    };
    Object.defineProperty(Cell.prototype, "player", {
        get: function () {
            return this._player;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "subBoardIndex", {
        get: function () {
            return this._subBoardIndex;
        },
        set: function (value) {
            this._subBoardIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "mainIndex", {
        get: function () {
            return this._mainIndex;
        },
        set: function (value) {
            this._mainIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    return Cell;
}());
exports.default = Cell;
//# sourceMappingURL=Cell.js.map