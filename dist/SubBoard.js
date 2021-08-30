"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMessages_1 = require("./ErrorMessages");
const Cell_1 = require("./Cell");
const Error_1 = require("./Error");
const Constants_1 = require("./Constants");
const Board_1 = require("./Board");
const Utility_1 = require("./Utility");
class SubBoard extends Board_1.default {
    constructor(size = 3) {
        super();
        this.size = size;
        this.board = [];
        this.moves = 0;
        for (let x = 0; x < this.size; x++) {
            this.board[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.board[x][y] = new Cell_1.default([x, y]);
            }
        }
        this.maxMoves = Math.pow(this.size, 2);
        return this;
    }
    isFinished() {
        return this.winner !== undefined;
    }
    getResult() {
        if (!this.isFinished()) {
            throw Error_1.default(ErrorMessages_1.default.gameNotFinished);
        }
        return this.winner;
    }
    isValidMove(move) {
        return Array.isArray(move) &&
            move.length === 2 &&
            Utility_1.isInteger(move[0]) &&
            Utility_1.isInteger(move[1]) &&
            move[0] > -1 &&
            move[1] > -1 &&
            move[0] < this.size &&
            move[1] < this.size &&
            !this.board[move[0]][move[1]].isPlayed();
    }
    addMyMove(move, index = -1) {
        return this.move(Constants_1.ME, move, false, index);
    }
    addOpponentMove(move, index = -1) {
        return this.move(Constants_1.OPPONENT, move, false, index);
    }
    move(player, move, allowTies = false, index = -1) {
        if (this.isFull() || this.isFinished()) {
            throw Error_1.default(ErrorMessages_1.default.boardFinished);
        }
        if (!this.isValidPlayer(player, allowTies)) {
            throw Error_1.default(ErrorMessages_1.default.player, player);
        }
        if (!this.isValidMove(move)) {
            if (move) {
                throw Error_1.default(ErrorMessages_1.default.move, move);
            }
            throw Error_1.default(ErrorMessages_1.default.move);
        }
        const game = this.copy();
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
        if (game.isFull() && game.winner === Constants_1.UNPLAYED) {
            game.winner = Constants_1.RESULT_TIE;
        }
        return game;
    }
    getValidMoves() {
        const moves = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (!this.board[x][y].isPlayed()) {
                    moves.push([x, y]);
                }
            }
        }
        return moves;
    }
    prettyPrint(printTies = false) {
        const ret = [];
        for (let x = 0; x < this.size; x++) {
            let line = "";
            for (let y = 0; y < this.size; y++) {
                let player = "-";
                if (printTies && this.board[x][y].player === Constants_1.RESULT_TIE) {
                    player = "+";
                }
                else if (this.board[x][y].player !== Constants_1.UNPLAYED && this.board[x][y].player >= Constants_1.ME) {
                    player = `${this.board[x][y].player}`;
                }
                line += player + " ";
            }
            ret.push(line);
        }
        return ret.join("\n");
    }
    copy() {
        const copy = new SubBoard(this.size);
        copy.board = this.board.map(copyRow => copyRow.map(c => c.copy()));
        copy.moves = this.moves;
        if (this.winner !== undefined) {
            copy.winner = this.winner;
        }
        return copy;
    }
    isFull() {
        return this.moves >= this.maxMoves;
    }
    isValidPlayer(player, allowTies = false) {
        const validPlayers = [Constants_1.ME, Constants_1.OPPONENT];
        if (allowTies) {
            validPlayers.push(Constants_1.RESULT_TIE);
        }
        return validPlayers.indexOf(player) > -1;
    }
    checkRow(row) {
        const player = this.board[row][0].player;
        if (player < Constants_1.ME) {
            return;
        }
        for (let i = 1; i < this.size; i++) {
            if (player !== this.board[row][i].player) {
                return;
            }
        }
        if (player >= Constants_1.ME) {
            this.winner = player;
        }
    }
    checkColumn(col) {
        const player = this.board[0][col].player;
        if (player < Constants_1.ME) {
            return;
        }
        for (let i = 1; i < this.size; i++) {
            if (player !== this.board[i][col].player) {
                return;
            }
        }
        if (player >= Constants_1.ME) {
            this.winner = player;
        }
    }
    checkLtRDiagonal() {
        const player = this.board[0][0].player;
        if (player < Constants_1.ME) {
            return;
        }
        for (let i = 1; i < this.size; i++) {
            if (player !== this.board[i][i].player) {
                return;
            }
        }
        if (player >= Constants_1.ME) {
            this.winner = player;
        }
    }
    checkRtLDiagonal() {
        const player = this.board[0][this.size - 1].player;
        if (player < Constants_1.ME) {
            return;
        }
        for (let i = this.size - 1; i >= 0; i--) {
            if (player !== this.board[this.size - 1 - i][i].player) {
                return;
            }
        }
        if (player >= Constants_1.ME) {
            this.winner = player;
        }
    }
}
exports.default = SubBoard;
//# sourceMappingURL=SubBoard.js.map