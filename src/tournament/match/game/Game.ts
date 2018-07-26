import UTTT from '@socialgorithm/ultimate-ttt/dist/UTTT';
import {Coords, PlayerNumber, PlayerOrTie} from "@socialgorithm/ultimate-ttt/dist/model/constants";

import * as funcs from '../../../lib/funcs';
import Player from '../../model/Player';
import GameOptions from './GameOptions';
import GameEvents from './GameEvents';
import PubSubber from '../../model/Subscriber';
import { GAME_END, PLAYER_DATA, SEND_PLAYER_DATA } from '../../../events';

/**
 * A game between two players
 */
export default class Game extends PubSubber {
    private game: UTTT;
    private currentPlayerIndex: PlayerNumber;
    private gameStart: [number, number];
    public winnerIndex: PlayerOrTie;
    public gameTime: number;

    /**
     * Create a game between two players
     * * @param options Options for gameplay
     */
    constructor(private matchID: string, private players: Player[], private options: GameOptions, private events: GameEvents, private log: any) {
        super();
        this.game = new UTTT();

        // Subscribe to player events for this game
        this.players.forEach((player, index) => {
            this.subscribeNamespaced(player.token, PLAYER_DATA, this.handlePlayerMove(player, index));
        });
    }

    /**
     * Play an individual game between two players
     */
    public start() {
        this.gameStart = process.hrtime();
        this.currentPlayerIndex = 0;

        this.sendToPlayer(this.players[0], 'game', 'init');
        this.sendToPlayer(this.players[1], 'game', 'init');
        this.sendToPlayer(this.players[this.currentPlayerIndex], 'game', 'move');
    }

    private onFinish() {
        this.unsubscribeAll();
        this.publishNamespaced(this.matchID, GAME_END, this);
    }

    /**
     * Handles a specific player move - this returns a function configured for the specified player, it's intended to be used
     * as the callback for the player socket.
     * @param player Player number (0-1)
     * @returns {Function} Move handler with the player number embedded for logging
     */
    private handlePlayerMove(player: Player, playerIndex: number) {
        return (data: string) => {
            if (this.currentPlayerIndex !== playerIndex) {
                this.log(`Game ${this.options.gameId}: Player ${player.token} played out of turn (it was ${this.players[this.currentPlayerIndex].token}'s turn)`);
                this.handleGameWon(this.currentPlayerIndex);
                return;
            }
            if (data === 'fail') {
                // this is weird and probably won't ever happen
                this.handleGameWon(this.switchPlayer(this.currentPlayerIndex));
                return;
            }
            try {
                const coords = this.parseMove(data);
                this.game = this.game.move(this.currentPlayerIndex, coords.board, coords.move);

                this.currentPlayerIndex = this.switchPlayer(this.currentPlayerIndex);
                this.sendToPlayer(this.players[this.currentPlayerIndex], 'game', `opponent ${this.writeMove(coords)}`);

                if (this.game.isFinished()) {
                    if(this.game.winner === -1) {
                        this.handleGameTied()
                    } else {
                        this.handleGameWon(this.game.winner);
                    }
                    return;
                }
            } catch (e) {
                //this.log(`Game ${this.state.games}: Player ${this.currentPlayer.token} errored: ${e.message}`);
                this.handleGameWon(this.switchPlayer(this.currentPlayerIndex));
            }
        };
    }

    /**
     * Handle a game win
     * @param winnerIndex Game's winner, used to update the state
     * @param playerDisconnected Whether the game was stopped due to a player disconnecting. If true, the session will be finished
     */
    private handleGameWon(winnerIndex: PlayerNumber) {
        this.winnerIndex = this.switchPlayer(winnerIndex); // necessary because the winner is recorded inversely
        this.handleGameEnd();
    }

    private handleGameTied() {
        this.winnerIndex = -1;
        this.handleGameEnd()
    }

    private handleGameEnd() {
        const hrend = process.hrtime(this.gameStart);
        this.gameTime = funcs.convertExecTime(hrend[1]);
        this.players.forEach((player, index) => {
            let gameState = 'tied';
            if (this.winnerIndex > -1) {
                if (this.winnerIndex === index) {
                    gameState = 'won';
                } else {
                    gameState = 'lost';
                }
            }
            this.sendToPlayer(player, 'game', `end ${gameState}`);
        });
        this.onFinish();
    }

    private sendToPlayer(player: Player, type: string, data: string) {
        this.publishNamespaced(player.token, SEND_PLAYER_DATA, {
            type,
            data,
        });
    }

    /**
     * Receive a move from a player and convert it to an object
     * of board and move
     * @param data String received from the client
     * @returns {{board: Array, move: Array}}
     */
    private parseMove(data: string): Coords {
        const [board, move] = data.trim().split(';')
            .map(part => part.split(',').map(n => parseInt(n)) as [number, number]);
        return { board, move };
    }

    /**
     * Encode a move received from a player to be sent to the opponent
     * @param coords {{board: Array, move: Array}}
     * @returns {string}
     */
    private writeMove(coords: Coords) {
        const {board, move} = coords;
        return [board, move].map(p => p.join(',')).join(';');
    }

    /**
     * Type safe way of switching from one player to another
     */
    private switchPlayer(playerNumber: PlayerNumber): PlayerNumber {
        return playerNumber === 0 ? 1 : 0;
    }
}