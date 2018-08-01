import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';
import * as uuid from 'uuid/v4';

/**
 * A set of games between two players
 */
export default class Match {
    public uuid: string;
    public games: Game[];
    public stats: State;

    constructor(public players: Player[], private options: MatchOptions, private sendStats: Function) {
        this.uuid = uuid()
        this.games = [];
        this.stats = new State();

        for(let i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game(
                this.players,
                {
                    timeout: options.timeout,
                    gameId: i,
                },
                {
                    onGameStart: () => {}
                },
                console.log
            )
        }
    }

    /**
     * Play all the games in this match
     */
    public async playGames() {
        this.stats.state = 'playing';
        for (let game of this.games) {
            await game.playGame();
            this.stats.times.push(game.gameTime);
            this.stats.games++;
            if (game.winnerIndex === -1) {
                this.stats.ties++;
            } else {
                this.stats.wins[game.winnerIndex]++;
            }
            this.sendStats();
        }
        this.stats.state = 'finished';
        if(this.stats.wins[0] > this.stats.wins[1]) {
            this.stats.winner = 0
        } else if(this.stats.wins[1] > this.stats.wins[0]) {
            this.stats.winner = 1
        }
    }

    public getStats() {
        return {
            stats: this.stats,
            players: this.players.map(player => ({
                token: player.token,
            })),
        };
    }

    public toString() {
        let winner = '';
        if (this.stats.winner > -1) {
            winner = ' [W ' + this.players[this.stats.winner].token + ']';
        }
        return 'Match ' + this.uuid + ' (' + this.players.map(player => player.token) + ') [' + this.stats.state + '] ' + winner;
    }
}