"use strict";
exports.__esModule = true;
var errors_1 = require("./errors");
var error_1 = require("../error");
var Cell_1 = require("./Cell");
exports.ME = 0;
exports.OPPONENT = 1;
exports.RESULT_TIE = -1;
exports.RESULT_WIN = 0;
exports.RESULT_LOSE = 1;
var SubBoard = (function () {
    function SubBoard(size) {
        if (size === void 0) { size = 3; }
        this.size = size;
        this._init();
        this.maxMoves = Math.pow(this.size, 2);
        return this;
    }
    SubBoard.prototype.isFinished = function () {
        return this.winner >= exports.RESULT_TIE;
    };
    SubBoard.prototype.getResult = function () {
        if (!this.isFinished()) {
            throw error_1["default"](errors_1["default"].gameNotFinished);
        }
        return this.winner;
    };
    SubBoard.prototype.isValidMove = function (move) {
        return !(!Array.isArray(move) ||
            move.length !== 2 ||
            move[0] < 0 ||
            move[0] > this.size ||
            move[1] < 0 ||
            move[1] > this.size ||
            typeof (this.board[move[0]][move[1]]) === 'undefined' ||
            this.board[move[0]][move[1]].player >= exports.ME);
    };
    SubBoard.prototype.addMyMove = function (move, index) {
        if (index === void 0) { index = -1; }
        return this._move(exports.ME, move, index);
    };
    SubBoard.prototype.addOpponentMove = function (move, index) {
        if (index === void 0) { index = -1; }
        return this._move(exports.OPPONENT, move, index);
    };
    SubBoard.prototype.prettyPrint = function () {
        var ret = [];
        for (var x = 0; x < this.size; x++) {
            var line = '';
            for (var y = 0; y < this.size; y++) {
                var player = (this.board[x][y].player < 0) ? '-' : this.board[x][y].player;
                line += player + ' ';
            }
            ret.push(line);
        }
        return ret.join("\n");
    };
    SubBoard.prototype._init = function () {
        this.board = [];
        this.moves = 0;
        this.winner = exports.RESULT_TIE - 1;
        for (var x = 0; x < this.size; x++) {
            this.board[x] = [];
            for (var y = 0; y < this.size; y++) {
                this.board[x][y] = new Cell_1["default"]();
            }
        }
    };
    SubBoard.prototype._copy = function () {
        var copy = new SubBoard(this.size);
        copy._init();
        copy.board = this.board;
        copy.moves = this.moves;
        copy.winner = this.winner;
        return copy;
    };
    SubBoard.prototype._move = function (player, move, index) {
        if (index === void 0) { index = -1; }
        if (this._isFull() || this.isFinished()) {
            throw error_1["default"](errors_1["default"].boardFinished);
        }
        if (!this._isValidPlayer(player)) {
            throw error_1["default"](errors_1["default"].player, player);
        }
        if (!this.isValidMove(move)) {
            throw error_1["default"](errors_1["default"].move, move);
        }
        var game = this._copy();
        game.board[move[0]][move[1]].player = player;
        game.board[move[0]][move[1]].subBoardIndex = game.moves;
        game.board[move[0]][move[1]].mainIndex = index;
        game.moves++;
        game._checkRow(move[0]);
        if (!game.isFinished()) {
            game._checkColumn(move[1]);
        }
        if (!game.isFinished()) {
            game._checkLtRDiagonal();
        }
        if (!game.isFinished()) {
            game._checkRtLDiagonal();
        }
        if (game._isFull() && game.winner < exports.RESULT_TIE) {
            game.winner = exports.RESULT_TIE;
        }
        return game;
    };
    SubBoard.prototype._isValidPlayer = function (player) {
        return [exports.ME, exports.OPPONENT].indexOf(player) > -1;
    };
    SubBoard.prototype._checkRow = function (row) {
        var player = this.board[row][0].player;
        if (player < exports.ME) {
            return;
        }
        for (var i = 1; i < this.size; i++) {
            if (player !== this.board[row][i].player) {
                return;
            }
        }
        if (player >= exports.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype._checkColumn = function (col) {
        var player = this.board[0][col].player;
        if (player < exports.ME) {
            return;
        }
        for (var i = 1; i < this.size; i++) {
            if (player !== this.board[i][col].player) {
                return;
            }
        }
        if (player >= exports.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype._checkLtRDiagonal = function () {
        var player = this.board[0][0].player;
        if (player < exports.ME) {
            return;
        }
        for (var i = 1; i < this.size; i++) {
            if (player !== this.board[i][i].player) {
                return;
            }
        }
        if (player >= exports.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype._checkRtLDiagonal = function () {
        var player = this.board[0][this.size - 1].player;
        if (player < exports.ME) {
            return;
        }
        for (var i = this.size - 1; i >= 0; i--) {
            if (player !== this.board[this.size - 1 - i][i].player) {
                return;
            }
        }
        if (player >= exports.ME) {
            this.winner = player;
        }
    };
    SubBoard.prototype._isFull = function () {
        return this.moves === this.maxMoves;
    };
    return SubBoard;
}());
exports["default"] = SubBoard;
//# sourceMappingURL=SubBoard.js.map