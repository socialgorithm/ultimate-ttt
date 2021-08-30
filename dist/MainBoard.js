"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SubBoard_1 = require("./SubBoard");
const ErrorMessages_1 = require("./ErrorMessages");
const Error_1 = require("./Error");
const Constants_1 = require("./Constants");
const Board_1 = require("./Board");
const Utility_1 = require("./Utility");
class MainBoard extends Board_1.default {
    constructor(size = 3) {
        super();
        this.size = size;
        this.moves = 0;
        this.maxMoves = Math.pow(this.size, 4);
        this.board = [];
        this.nextBoard = undefined;
        this.stateBoard = new SubBoard_1.default(this.size);
        for (let x = 0; x < this.size; x++) {
            this.board[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.board[x][y] = new SubBoard_1.default(this.size);
            }
        }
        return this;
    }
    isFinished() {
        return (this.stateBoard.isFinished() || this.moves === this.maxMoves);
    }
    getResult() {
        return this.stateBoard.getResult();
    }
    isValidBoardRowCol(board) {
        if (this.nextBoard === undefined) {
            return Array.isArray(board) &&
                board.length === 2 &&
                Utility_1.isInteger(board[0]) &&
                Utility_1.isInteger(board[1]) &&
                board[0] > -1 &&
                board[1] > -1 &&
                board[1] < this.size &&
                board[1] < this.size;
        }
        else {
            return Array.isArray(board) && this.nextBoard[0] === board[0] && this.nextBoard[1] === board[1];
        }
    }
    isValidMove(boardRowCol, move) {
        if (!this.isValidBoardRowCol(boardRowCol)) {
            return false;
        }
        return this.board[boardRowCol[0]][boardRowCol[1]].isValidMove(move);
    }
    addMyMove(boardRowCol, move) {
        return this.move(Constants_1.ME, boardRowCol, move);
    }
    addOpponentMove(boardRowCol, move) {
        return this.move(Constants_1.OPPONENT, boardRowCol, move);
    }
    move(player, board, move) {
        if (this.isFinished()) {
            throw Error_1.default(ErrorMessages_1.default.gameFinished);
        }
        if (!this.isValidBoardRowCol(board)) {
            throw Error_1.default(ErrorMessages_1.default.board, board.toString());
        }
        const game = this.copy();
        let updatedBoard = game.board[board[0]][board[1]];
        if (player === Constants_1.ME) {
            updatedBoard = updatedBoard.addMyMove(move, game.moves);
        }
        else if (player === Constants_1.OPPONENT) {
            updatedBoard = updatedBoard.addOpponentMove(move, game.moves);
        }
        else {
            throw Error_1.default(ErrorMessages_1.default.player, player);
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
    }
    getValidBoards() {
        if ((this.nextBoard) && (!this.board[this.nextBoard[0]][this.nextBoard[1]].isFinished())) {
            return [this.nextBoard];
        }
        const boards = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (!this.board[x][y].isFinished()) {
                    boards.push([x, y]);
                }
            }
        }
        return boards;
    }
    prettyPrint() {
        const rows = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const small = this.board[x][y].prettyPrint().split("\n");
                for (let row = 0; row < this.size; row++) {
                    const xCoord = x * this.size + row;
                    if (!rows[xCoord]) {
                        rows[xCoord] = [];
                    }
                    rows[xCoord][y] = small[row];
                }
            }
        }
        const ret = [];
        for (let x = 0; x < rows.length; x++) {
            ret.push(rows[x].join("| "));
            if ((x + 1) % this.size === 0) {
                let sepChars = "";
                for (let i = 0; i < this.size * 2; i++) {
                    sepChars += "-";
                }
                sepChars += "+";
                let sep = sepChars;
                for (let i = 1; i < this.size; i++) {
                    sep += "-" + sepChars;
                }
                ret.push(sep.substr(0, sep.length - 1));
            }
        }
        return ret.join("\n");
    }
    copy() {
        const copy = new MainBoard(this.size);
        copy.board = this.board.map(row => row.map(subBoard => subBoard.copy()));
        copy.moves = this.moves;
        copy.winner = this.winner;
        copy.nextBoard = this.nextBoard === undefined ? undefined : this.nextBoard.slice();
        copy.stateBoard = this.stateBoard.copy();
        return copy;
    }
}
exports.default = MainBoard;
//# sourceMappingURL=MainBoard.js.map