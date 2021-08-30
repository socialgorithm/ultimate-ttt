"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("sg:uttt:match");
const UTTTGame_1 = require("./UTTTGame");
class UTTTMatch {
    constructor(options, players, outputChannel) {
        this.options = options;
        this.players = players;
        this.outputChannel = outputChannel;
        this.gamesCompleted = [];
        this.missingPlayers = [];
        this.playNextGame = () => {
            this.currentGame = new UTTTGame_1.default(this.players, this.onGameMessageToPlayer, this.onGameEnded, this.options);
            this.currentGame.start();
        };
        this.onGameMessageToPlayer = (player, message) => {
            this.outputChannel.sendMessageToPlayer(player, message);
        };
        this.onGameEnded = (stats) => {
            this.outputChannel.sendGameEnded(stats);
            this.gamesCompleted.push(stats);
            if (this.gamesCompleted.length < this.options.maxGames) {
                this.messageGameEnd(stats);
                this.playNextGame();
            }
            else {
                this.endMatch();
            }
        };
        this.messageGameEnd = (stats) => {
            if (stats.winner) {
                const winningIndex = this.players.indexOf(stats.winner);
                if (winningIndex !== -1) {
                    this.onGameMessageToPlayer(this.players[winningIndex], "game win");
                    this.onGameMessageToPlayer(this.players[1 - winningIndex], stats.stats.previousMove ? `game lose ${stats.stats.previousMove}` : "game lose");
                }
            }
            else {
                this.onGameMessageToPlayer(this.players[0], stats.stats.playedPlayerIndex !== 0 ? `game tie ${stats.stats.previousMove}` : "game tie");
                this.onGameMessageToPlayer(this.players[1], stats.stats.playedPlayerIndex !== 1 ? `game tie ${stats.stats.previousMove}` : "game tie");
            }
        };
        this.endMatch = () => {
            const stats = this.getGameStats();
            const winner = stats.wins[0] === stats.wins[1] ? -1 : stats.wins[0] > stats.wins[1] ? 0 : 1;
            this.sendEndMatchMessages(winner, stats);
        };
        this.getGameStats = () => {
            const gamesTied = this.gamesCompleted.filter((game) => game.tie).length;
            const gameWonPlayer1 = this.gamesCompleted.filter((game) => !game.tie && this.players[0] === game.winner).length;
            const gameWonPlayer2 = this.gamesCompleted.filter((game) => !game.tie && this.players[1] === game.winner).length;
            return {
                gamesCompleted: this.gamesCompleted.length,
                gamesTied,
                wins: [gameWonPlayer1, gameWonPlayer2],
            };
        };
        this.sendEndMatchMessages = (winner, stats) => {
            const winningMessage = winner === -1 ? `Match Tie` : `Match Won${this.players[winner]}`;
            if (winner !== -1) {
                this.onGameMessageToPlayer(this.players[winner], "match win");
                this.onGameMessageToPlayer(this.players[1 - winner], "match lose");
            }
            else {
                this.onGameMessageToPlayer(this.players[winner], "match tie");
                this.onGameMessageToPlayer(this.players[1 - winner], "match tie");
            }
            const matchEndedMessage = {
                games: this.gamesCompleted,
                matchID: "--",
                messages: [winningMessage],
                options: this.options,
                players: this.players,
                state: "finished",
                stats,
                winner,
            };
            this.outputChannel.sendMatchEnded(matchEndedMessage);
        };
        this.sendMatchEndDueToTimeout = (missingPlayer) => {
            let winnerIndex = -1;
            let timeoutMessage = "Players did not connect in time";
            if (missingPlayer) {
                const winner = this.players.find(player => player !== missingPlayer);
                winnerIndex = this.players.findIndex(player => player === winner);
                timeoutMessage = `${missingPlayer} did not connect in time, or disconnected`;
            }
            const matchEndedMessage = {
                games: [],
                matchID: "--",
                messages: [timeoutMessage],
                options: this.options,
                players: this.players,
                state: "finished",
                stats: {
                    gamesCompleted: 0,
                    gamesTied: 0,
                    wins: [0, 0],
                },
                winner: winnerIndex,
            };
            debug("Sending match ended due to timeout %O", matchEndedMessage);
            this.outputChannel.sendMatchEnded(matchEndedMessage);
        };
        this.missingPlayers.push(...players);
        setTimeout(() => {
            if (this.missingPlayers.length === 1) {
                debug(`${this.missingPlayers[0]} did not connect to match, sending match end`);
                this.sendMatchEndDueToTimeout(this.missingPlayers[0]);
            }
            else if (this.missingPlayers.length > 1) {
                debug(`Players did not connect to match, sending match end`);
                this.sendMatchEndDueToTimeout();
            }
        }, 5000);
    }
    onPlayerConnected(player) {
        debug(`Player ${player} connected to match`);
        this.missingPlayers = this.missingPlayers.filter(missingPlayer => player !== missingPlayer);
    }
    onPlayerDisconnected(player) {
        debug(`Player ${player} disconnected from match`);
        if (!this.missingPlayers.find(missingPlayer => missingPlayer === player)) {
            this.missingPlayers.push(player);
        }
        this.sendMatchEndDueToTimeout(player);
    }
    start() {
        debug("Starting new UTTT Match");
        this.playNextGame();
    }
    onMessageFromPlayer(player, message) {
        this.currentGame.onMessageFromPlayer(player, message);
    }
}
exports.default = UTTTMatch;
//# sourceMappingURL=UTTTMatch.js.map