import * as uuid from 'uuid/v4';

import MatchOptions from './MatchOptions';
import Game from './game/Game';
import Player from '../model/Player';
import State from '../model/State';
import { GAME_END, MATCH_END } from '../../events';
import PubSubber from '../model/Subscriber';

/**
 * A set of games between two players
 */
export default class Match extends PubSubber {
    private matchID: string;
    public games: Game[];
    public stats: State;

    constructor(private tournmentId: string, public players: Player[], private options: MatchOptions) {
        super();
        this.games = [];
        this.stats = new State();
        this.matchID = uuid();

        for(let i = 0; i < options.maxGames; i++) {
            this.games[i] = new Game(
                this.matchID,
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

        this.subscribeNamespaced(this.matchID, GAME_END, this.onGameEnd);
    }

    public start() {
        this.stats.state = 'playing';
        this.playNextGame();
    }

    private playNextGame() {
        const game = this.games[this.stats.games];
        if (!game) {
            console.error('Invalid game!', this);
            this.onMatchEnd();
            return;
        }
        game.start();
    }

    private onGameEnd(game: Game) {
        this.stats.times.push(game.gameTime);
        this.stats.games++;
        if (game.winnerIndex === -1) {
            this.stats.ties++;
        } else {
            this.stats.wins[game.winnerIndex]++;
        }
        if (this.stats.games >= this.games.length) {
            return this.onMatchEnd();
        }
        this.playNextGame();
    }

    private onMatchEnd() {
        this.stats.state = 'finished';
        this.publishNamespaced(this.tournmentId, MATCH_END, this);
        this.unsubscribeAll();
    }
}