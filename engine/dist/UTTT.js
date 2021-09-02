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
var SubBoard_1 = require("./SubBoard");
var errors_1 = require("./model/errors");
var error_1 = require("./error");
var constants_1 = require("./model/constants");
var TTT_1 = require("./model/TTT");
var utility_1 = require("./utility");
var UTTT = (function (_super) {
    __extends(UTTT, _super);
    function UTTT(size) {
        if (size === void 0) { size = 3; }
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.moves = 0;
        _this.maxMoves = Math.pow(_this.size, 4);
        _this.board = [];
        _this.nextBoard = undefined;
        _this.stateBoard = new SubBoard_1.default(_this.size);
        for (var x = 0; x < _this.size; x++) {
            _this.board[x] = [];
            for (var y = 0; y < _this.size; y++) {
                _this.board[x][y] = new SubBoard_1.default(_this.size);
            }
        }
        return _this;
    }
    UTTT.prototype.isFinished = function () {
        return (this.stateBoard.isFinished() || this.moves === this.maxMoves);
    };
    UTTT.prototype.getResult = function () {
        return this.stateBoard.getResult();
    };
    UTTT.prototype.isValidBoardRowCol = function (board) {
        if (this.nextBoard === undefined) {
            return Array.isArray(board) &&
                board.length === 2 &&
                utility_1.isInteger(board[0]) &&
                utility_1.isInteger(board[1]) &&
                board[0] > -1 &&
                board[1] > -1 &&
                board[1] < this.size &&
                board[1] < this.size;
        }
        else {
            return Array.isArray(board) && this.nextBoard[0] === board[0] && this.nextBoard[1] === board[1];
        }
    };
    UTTT.prototype.isValidMove = function (boardRowCol, move) {
        if (!this.isValidBoardRowCol(boardRowCol)) {
            return false;
        }
        return this.board[boardRowCol[0]][boardRowCol[1]].isValidMove(move);
    };
    UTTT.prototype.addMyMove = function (boardRowCol, move) {
        return this.move(constants_1.ME, boardRowCol, move);
    };
    UTTT.prototype.addOpponentMove = function (boardRowCol, move) {
        return this.move(constants_1.OPPONENT, boardRowCol, move);
    };
    UTTT.prototype.move = function (player, board, move) {
        if (this.isFinished()) {
            throw error_1.default(errors_1.default.gameFinished);
        }
        if (!this.isValidBoardRowCol(board)) {
            throw error_1.default(errors_1.default.board, board.toString());
        }
        var game = this.copy();
        var updatedBoard = game.board[board[0]][board[1]];
        if (player === constants_1.ME) {
            updatedBoard = updatedBoard.addMyMove(move, game.moves);
        }
        else if (player === constants_1.OPPONENT) {
            updatedBoard = updatedBoard.addOpponentMove(move, game.moves);
        }
        else {
            throw error_1.default(errors_1.default.player, player);
        }
        game.board[board[0]][board[1]] = updatedBoard;
        game.moves++;
        game.nextBoard = move;
        if (game.board[game.nextBoard[0]][game.nextBoard[1]].isFinished()) {
            game.nextBoard = undefined;
        }
        if (game.board[board[0]][board[1]].isFinished() &&
            game.board[board[0]][board[1]].winner !== undefined) {
            game.stateBoard = game.stateBoard.move(game.board[board[0]][board[1]].winner, board, true);
        }
        game.winner = game.stateBoard.winner;
        return game;
    };
    UTTT.prototype.getValidBoards = function () {
        if ((this.nextBoard) && (!this.board[this.nextBoard[0]][this.nextBoard[1]].isFinished())) {
            return [this.nextBoard];
        }
        var boards = [];
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (!this.board[x][y].isFinished()) {
                    boards.push([x, y]);
                }
            }
        }
        return boards;
    };
    UTTT.prototype.prettyPrint = function () {
        var rows = [];
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                var small = this.board[x][y].prettyPrint().split("\n");
                for (var row = 0; row < this.size; row++) {
                    var xCoord = x * this.size + row;
                    if (!rows[xCoord]) {
                        rows[xCoord] = [];
                    }
                    rows[xCoord][y] = small[row];
                }
            }
        }
        var ret = [];
        for (var x = 0; x < rows.length; x++) {
            ret.push(rows[x].join('| '));
            if ((x + 1) % this.size === 0) {
                var sepChars = '';
                for (var i = 0; i < this.size * 2; i++) {
                    sepChars += '-';
                }
                sepChars += '+';
                var sep = sepChars;
                for (var i = 1; i < this.size; i++) {
                    sep += '-' + sepChars;
                }
                ret.push(sep.substr(0, sep.length - 1));
            }
        }
        return ret.join("\n");
    };
    UTTT.prototype.copy = function () {
        var copy = new UTTT(this.size);
        copy.board = this.board.map(function (row) { return row.map(function (subBoard) { return subBoard.copy(); }); });
        copy.moves = this.moves;
        copy.winner = this.winner;
        copy.nextBoard = this.nextBoard === undefined ? undefined : this.nextBoard.slice();
        copy.stateBoard = this.stateBoard.copy();
        return copy;
    };
    return UTTT;
}(TTT_1.default));
exports.default = UTTT;
//# sourceMappingURL=UTTT.js.map