"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("sg:uttt:game");
const MainBoard_1 = require("./MainBoard");
class UTTTGame {
    constructor(players, sendMessageToPlayer, sendGameEnded, options) {
        this.players = players;
        this.sendMessageToPlayer = sendMessageToPlayer;
        this.sendGameEnded = sendGameEnded;
        this.options = options;
        this.board = new MainBoard_1.default(3);
        this.nextPlayerIndex = Math.round(Math.random());
        this.hasTimedOut = false;
    }
    start() {
        this.startTime = Math.round(Date.now() / 1000);
        this.sendMessageToPlayer(this.players[0], "init");
        this.sendMessageToPlayer(this.players[1], "init");
        this.askForMoveFromNextPlayer();
    }
    onMessageFromPlayer(player, payload) {
        this.onPlayerMove(player, payload);
    }
    getNextPlayer() {
        return this.players[this.nextPlayerIndex];
    }
    onPlayerMove(player, moveStr) {
        if (this.hasTimedOut) {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        const coords = this.parseMove(moveStr);
        const expectedPlayerIndex = this.nextPlayerIndex;
        const playedPlayerIndex = this.players.indexOf(player);
        if (expectedPlayerIndex !== playedPlayerIndex) {
            const expectedPlayer = this.players[expectedPlayerIndex];
            debug(`Expected ${expectedPlayer} to play, but ${player} played`);
            this.handleGameWon(this.players[expectedPlayerIndex], undefined, playedPlayerIndex);
            return;
        }
        this.board = this.board.move(playedPlayerIndex, coords.board, coords.move);
        const previousMove = coords;
        if (this.board.isFinished()) {
            this.handleGameEnd(previousMove, playedPlayerIndex);
            return;
        }
        else {
            this.switchNextPlayer();
            this.askForMoveFromNextPlayer(previousMove);
        }
    }
    parseMove(data) {
        const [board, move] = data.trim().split(";")
            .map(part => part.split(",").map(n => parseInt(n, 10)));
        return { board, move };
    }
    askForMoveFromNextPlayer(previousMove) {
        const nextPlayer = this.players[this.nextPlayerIndex];
        if (previousMove) {
            const coords = this.printCoords(previousMove);
            this.sendMessageToPlayer(nextPlayer, `opponent ${coords}`);
        }
        else {
            this.sendMessageToPlayer(nextPlayer, "move");
        }
        this.timeout = setTimeout(() => {
            this.hasTimedOut = true;
            this.sendMessageToPlayer(this.players[this.nextPlayerIndex], "timeout");
            this.handleGameWon(this.players[1 - this.nextPlayerIndex], undefined, this.nextPlayerIndex);
        }, this.options.timeout * 1.2);
    }
    switchNextPlayer() {
        this.nextPlayerIndex = this.nextPlayerIndex === 0 ? 1 : 0;
    }
    handleGameEnd(previousMove, playedPlayerIndex) {
        if (this.board.winner === -1) {
            this.handleGameTied(previousMove, playedPlayerIndex);
        }
        else {
            const winnerName = this.players[this.board.winner];
            this.handleGameWon(winnerName, previousMove, playedPlayerIndex);
        }
    }
    handleGameTied(previousMove, playedPlayerIndex) {
        this.sendGameEnded({
            duration: this.getTimeFromStart(),
            players: this.players,
            stats: {
                playedPlayerIndex,
                previousMove: previousMove ? this.printCoords(previousMove) : "",
            },
            tie: true,
            winner: null,
        });
    }
    handleGameWon(winner, previousMove, playedPlayerIndex) {
        this.sendGameEnded({
            duration: this.getTimeFromStart(),
            players: this.players,
            stats: {
                playedPlayerIndex,
                previousMove: previousMove ? this.printCoords(previousMove) : "",
            },
            tie: false,
            winner,
        });
    }
    getTimeFromStart() {
        const timeNow = Math.round(Date.now() / 1000);
        return timeNow - this.startTime;
    }
    printCoords(coords) {
        return coords.board.join(",") + ";" + coords.move.join(",");
    }
}
exports.default = UTTTGame;
//# sourceMappingURL=UTTTGame.js.map