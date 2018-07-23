import UTTT from '@socialgorithm/ultimate-ttt/dist/UTTT';

import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';

/**
 * A set of games between two players
 */
export default class Match {
    public games: Game[];
    public state: State;

    constructor(private players: Player[], private options: MatchOptions, private sendStats: Function) {
        this.games = [];
        this.state = new State();

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
        for (let game of this.games) {
            await game.playGame();
            this.state.times.push(game.gameTime);
            this.state.games++;
            if (game.winnerIndex === -1) {
                this.state.ties++;
            } else {
                this.state.wins[game.winnerIndex]++;
            }
            this.sendStats();
        }
    }
}