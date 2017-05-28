"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./model/errors");
var Cell_1 = require("./model/Cell");
var error_1 = require("./error");
var constants_1 = require("./model/constants");
var TTT_1 = require("./model/TTT");
var utility_1 = require("./utility");
var SubBoard = (function (_super) {
    __extends(SubBoard, _super);
    function SubBoard(size) {
        if (size === void 0) { size = 3; }
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.board = [];
        _this.moves = 0;
        for (var x = 0; x < _this.size; x++) {
            _this.board[x] = [];
            for (var y = 0; y < _this.size; y++) {
                _this.board[x][y] = new Cell_1.default([x, y]);
            }
        }
        _this.maxMoves = Math.pow(_this.size, 2);
        return _this;
    }
    SubBoard.prototype.isFinished = function () {
        return this.winner !== undefined;
    };
    SubBoard.prototype.getResult = function () {
        if (!this.isFinished()) {
            throw error_1.default(errors_1.default.gameNotFinished);
        }
        return this.winner;
    };
    SubBoard.prototype.isValidMove = function (move) {
        return Array.isArray(move) &&
            move.length === 2 &&
            utility_1.isInteger(move[0]) &&
            utility_1.isInteger(move[1]) &&
            move[0] > -1 &&
            move[1] > -1 &&
            move[0] < this.size &&
            move[1] < this.size &&
            !this.board[move[0]][move[1]].isPlayed();
    };
    SubBoard.prototype.addMyMove = function (move, index) {
        if (index === void 0) { index = -1; }
        return this.move(constants_1.ME, move, false, index);
    };
    SubBoard.prototype.addOpponentMove = function (move, index) {
        if (index === void 0) { index = -1; }
        return this.move(constants_1.OPPONENT, move, false, index);
    };
    SubBoard.prototype.move = function (player, move, allowTies, index) {
        if (allowTies === void 0) { allowTies = false; }
        if (index === void 0) { index = -1; }
        if (this.isFull() || this.isFinished()) {
            throw error_1.default(errors_1.default.boardFinished);
        }
        if (!this.isValidPlayer(player, allowTies)) {
            throw error_1.default(errors_1.default.player, player);
        }
        if (!this.isValidMove(move)) {
            if (move) {
                throw error_1.default(errors_1.default.move, move);
            }
            throw error_1.default(errors_1.default.move);
        }
        var game = this.copy();
        game.board[move[0]][move[1]].player = player;
        game.board[move[0]][move[1]].subBoardIndex = game.moves;
        game.board[move[0]][move[1]].mainIndex = index;
        game.moves++;
        game.checkRow(move[0]);
        if (!game.isFinished()) {
            game.checkColumn(move[1]);
        }
        if (!game.isFinished()) {
            game.checkLtRDiagonal();
        }
        if (!game.isFinished()) {
            game.checkRtLDiagonal();
        }
        if (game.isFull() && game.winner === constants_1.UNPLAYED) {
            game.winner = constants_1.RESULT_TIE;
        }
        return game;
    };
    SubBoard.prototype.getValidMoves = function () {
        var moves = [];
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (!this.board[x][y].isPlayed()) {
                    moves.push([x, y]);
                }
            }
        }
        return moves;
    };
    SubBoard.prototype.prettyPrint = function (printTies) {
        if (printTies === void 0) { printTies = false; }
        var ret = [];
        for (var x = 0; x < this.size; x++) {
            var line = '';
            for (var y = 0; y < this.size; y++) {
                var player = '-';
                if (printTies && this.board[x][y].player === constants_1.RESULT_TIE) {
                    player = '+';
                }
                else if (this.board[x][y].player !== constants_1.UNPLAYED && this.board[x][y].player >= constants_1.ME) {
                    player = "" + this.board[x][y].player;
                }
                line += player + ' ';
            }
            ret.push(line);
        }
        return ret.join("\n");
    };
    SubBoard.prototype.copy = function () {
        var copy = new SubBoard(this.size);
        copy.board = this.board.map(function (copyRow) { return copyRow.map(function (c) { return c.copy(); }); });
        copy.moves = this.moves;
        if (this.winner !== undefined) {
            copy.winner = this.winner;
        }
        return copy;
    };
    SubBoard.prototype.isValidPlayer = function (player, allowTies) {
        if (allowTies === void 0) { allowTies = false; }
        var validPlayers = [constants_1.ME, constants_1.OPPONENT];
        if (allowTies) {
            validPlayers.push(constants_1.RESULT_TIE);
        }
        return validPlayers.indexOf(player) > -1;
    };
    SubBoard.prototype.isFull = function () {
        return this.moves >= this.maxMoves;
    };
    SubBoard.prototype.checkRow = function (row) {
        var player = this.board[row][0].player;
        if (player < constants_1.ME) {
            return;
        }
        for (var i = 1; i < this.size; i++) {
            if (player !== this.board[row][i].player) {
                return;
            }
        }
        if (player >= constants_1.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype.checkColumn = function (col) {
        var player = this.board[0][col].player;
        if (player < constants_1.ME) {
            return;
        }
        for (var i = 1; i < this.size; i++) {
            if (player !== this.board[i][col].player) {
                return;
            }
        }
        if (player >= constants_1.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype.checkLtRDiagonal = function () {
        var player = this.board[0][0].player;
        if (player < constants_1.ME) {
            return;
        }
        for (var i = 1; i < this.size; i++) {
            if (player !== this.board[i][i].player) {
                return;
            }
        }
        if (player >= constants_1.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype.checkRtLDiagonal = function () {
        var player = this.board[0][this.size - 1].player;
        if (player < constants_1.ME) {
            return;
        }
        for (var i = this.size - 1; i >= 0; i--) {
            if (player !== this.board[this.size - 1 - i][i].player) {
                return;
            }
        }
        if (player >= constants_1.ME) {
            this.winner = player;
        }
    };
    return SubBoard;
}(TTT_1.default));
exports.default = SubBoard;
//# sourceMappingURL=SubBoard.js.map