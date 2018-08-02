import * as uuid from "uuid/v4";

import Player from "../../tournament/model/Player";
import State from "../../tournament/model/State";

import Game from "./game/Game";
import IMatchOptions from "./MatchOptions";

/**
 * A set of games between two players
 */
export default class Match {
    public uuid: string;
    public games: Game[];
    public stats: State;

    constructor(public players: Player[], public options: IMatchOptions, private sendStats: () => void) {
        this.uuid = uuid();
        this.games = [];
        this.stats = new State();

        for (let i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game(
                this.players,
                {
                    gameId: i,
                    timeout: options.timeout,
                },
                // tslint:disable-next-line:no-console
                console.log,
            );
        }
    }

    /**
     * Play all the games in this match
     */
    public async playGames() {
        this.stats.state = "playing";
        for (const game of this.games) {
            await game.playGame();
            this.stats.games.push(game.getStats());
            this.stats.times.push(game.gameTime);
            this.stats.gamesCompleted++;
            if (game.winnerIndex === -1) {
                this.stats.gamesTied++;
            } else {
                this.stats.wins[game.winnerIndex]++;
            }
            if (game.timedoutPlayer) {
                this.stats.timeouts[game.timedoutPlayer]++;
            }
            this.sendStats();
        }
        this.stats.state = "finished";
        if (this.stats.wins[0] > this.stats.wins[1]) {
            this.stats.winner = 0;
        } else if (this.stats.wins[1] > this.stats.wins[0]) {
            this.stats.winner = 1;
        }
    }

    public getStats() {
        return {
            players: this.players.map(player => ({
                token: player.token,
            })),
            stats: this.stats,
            uuid: this.uuid,
        };
    }

    public toString() {
        let winner = "";
        if (this.stats.winner > -1) {
            winner = " [W " + this.players[this.stats.winner].token + "]";
        }
        return "Match " + this.uuid + " (" + this.players.map(player => player.token) + ") [" + this.stats.state + "] " + winner;
    }
}
