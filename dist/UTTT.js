"use strict";
exports.__esModule = true;
var SubBoard_1 = require("./model/SubBoard");
var errors_1 = require("./model/errors");
var error_1 = require("./error");
var SubBoard_2 = require("./model/SubBoard");
var UTTT = (function () {
    function UTTT(size) {
        if (size === void 0) { size = 3; }
        this.size = size;
        this.maxMoves = Math.pow(this.size, 4);
        this.board = [];
        this.moves = 0;
        this.winner = SubBoard_2.RESULT_TIE - 1;
        this.nextBoard = null;
        this.stateBoard = new SubBoard_1["default"](this.size);
        for (var x = 0; x < this.size; x++) {
            this.board[x] = [];
            for (var y = 0; y < this.size; y++) {
                this.board[x][y] = new SubBoard_1["default"](this.size);
            }
        }
        return this;
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
        return this.move(boardRowCol, SubBoard_2.ME, move);
    };
    UTTT.prototype.addOpponentMove = function (boardRowCol, move) {
        return this.move(boardRowCol, SubBoard_2.OPPONENT, move);
    };
    UTTT.prototype.move = function (board, player, move) {
        if (this.isFinished()) {
            throw error_1["default"](errors_1["default"].gameFinished);
        }
        if (!this.isValidBoardRowCol(board)) {
            throw error_1["default"](errors_1["default"].board, board.toString());
        }
        if (!this.isValidMove(board, move)) {
            throw error_1["default"](errors_1["default"].move, move.toString());
        }
        var game = this.copy();
        var updatedBoard;
        if (player === SubBoard_2.ME) {
            updatedBoard = this.board[board[0]][board[1]].addMyMove(move, game.moves);
        }
        else if (player === SubBoard_2.OPPONENT) {
            updatedBoard = this.board[board[0]][board[1]].addOpponentMove(move, game.moves);
        }
        else {
            throw error_1["default"](errors_1["default"].player, player);
        }
        game.board[board[0]][board[1]] = updatedBoard;
        game.moves++;
        game.nextBoard = move;
        if (game.board[game.nextBoard[0]][game.nextBoard[1]].isFinished()) {
            game.nextBoard = null;
        }
        if (game.board[board[0]][board[1]].isFinished() &&
            game.board[board[0]][board[1]].winner >= SubBoard_2.RESULT_TIE) {
            game.stateBoard = game.stateBoard.move(game.board[board[0]][board[1]].winner, board);
        }
        game.winner = game.stateBoard.winner;
        return game;
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
}());
exports["default"] = UTTT;
//# sourceMappingURL=UTTT.js.map