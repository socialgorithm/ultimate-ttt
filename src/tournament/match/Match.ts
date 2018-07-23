import UTTT from '@socialgorithm/ultimate-ttt/dist/UTTT';

import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';

/**
 * A set of games between two players
 */
export default class Match {
    private games: Game[];
    private state: State;
    private game: UTTT;
    private gameStart: [number, number];
    private gameIDForUI: number;
    private active: boolean;

    constructor(private players: Player[], private options: MatchOptions, private sendStats: Function) {
        this.games = [];

        for(let i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game(
                this.players,
                {timeout: options.timeout},
                {onGameStart: () => {}},
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
            this.sendStats();
        }
    }
}