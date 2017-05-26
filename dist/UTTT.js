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
var UTTT = (function (_super) {
    __extends(UTTT, _super);
    function UTTT(size) {
        if (size === void 0) { size = 3; }
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.maxMoves = Math.pow(_this.size, 4);
        _this.board = [];
        _this.moves = 0;
        _this.winner = null;
        _this.nextBoard = null;
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
    UTTT.prototype.isValidBoardRowCol = function (boardRowCol) {
        if (!this.nextBoard) {
            return !(!Array.isArray(boardRowCol) ||
                boardRowCol.length !== 2 ||
                boardRowCol[0] < 0 ||
                boardRowCol[0] > this.size ||
                boardRowCol[1] < 0 ||
                boardRowCol[1] > this.size ||
                typeof (this.board[boardRowCol[0]][boardRowCol[1]]) === 'undefined');
        }
        else {
            return Array.isArray(boardRowCol) &&
                this.nextBoard[0] === boardRowCol[0] &&
                this.nextBoard[1] === boardRowCol[1];
        }
    };
    UTTT.prototype.isValidMove = function (boardRowCol, move) {
        if (!this.isValidBoardRowCol(boardRowCol)) {
            return false;
        }
        return this.board[boardRowCol[0]][boardRowCol[1]].isValidMove(move);
    };
    UTTT.prototype.addMyMove = function (boardRowCol, move) {
        return this.move(boardRowCol, constants_1.ME, move);
    };
    UTTT.prototype.addOpponentMove = function (boardRowCol, move) {
        return this.move(boardRowCol, constants_1.OPPONENT, move);
    };
    UTTT.prototype.move = function (board, player, move) {
        if (this.isFinished()) {
            throw error_1.default(errors_1.default.gameFinished);
        }
        if (!this.isValidBoardRowCol(board)) {
            throw error_1.default(errors_1.default.board, board);
        }
        if (!this.isValidMove(board, move)) {
            throw error_1.default(errors_1.default.move, move);
        }
        var game = this.copy();
        var updatedBoard;
        if (player === constants_1.ME) {
            updatedBoard = this.board[board[0]][board[1]].addMyMove(move, game.moves);
        }
        else if (player === constants_1.OPPONENT) {
            updatedBoard = this.board[board[0]][board[1]].addOpponentMove(move, game.moves);
        }
        else {
            throw error_1.default(errors_1.default.player, player);
        }
        game.board[board[0]][board[1]] = updatedBoard;
        game.moves++;
        game.nextBoard = move;
        if (game.board[game.nextBoard[0]][game.nextBoard[1]].isFinished()) {
            game.nextBoard = null;
        }
        if (game.board[board[0]][board[1]].isFinished() &&
            game.board[board[0]][board[1]].winner !== null &&
            game.board[board[0]][board[1]].winner > constants_1.RESULT_TIE) {
            var boardWinner = (game.board[board[0]][board[1]].winner === 1) ? 1 : 0;
            game.stateBoard = game.stateBoard.move(boardWinner, board);
        }
        game.winner = game.stateBoard.winner;
        return game;
    };
    UTTT.prototype.getValidBoards = function () {
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
        copy.board = this.board;
        copy.moves = this.moves;
        copy.winner = this.winner;
        copy.nextBoard = this.nextBoard;
        copy.stateBoard = this.stateBoard;
        return copy;
    };
    return UTTT;
}(TTT_1.default));
exports.default = UTTT;
//# sourceMappingURL=UTTT.js.map