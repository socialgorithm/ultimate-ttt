import UTTT from 'ultimate-ttt';

import State from "./State";
import {Game} from "./OnlineServer";
import {Options} from "./input";
import GUI from "./GUI";
import * as funcs from './funcs';
import {Coords, PlayerNumber, PlayerOrTie} from "ultimate-ttt/dist/model/constants";

/**
 * Online game manager between two players
 */
export default class OnlineGame {
    private timeout: number;
    private maxGames: number;
    private state: State;
    private session: Game;
    private players: Array<string>;
    private currentPlayer: PlayerNumber;
    private firstPlayer: PlayerNumber;
    private game: UTTT;
    private gameStart: [number, number];
    private gameUIId: number;
    private ui: GUI;
    private io: SocketIO.Server;

    /**
     * Build a new game manager
     * @param session game information
     * @param io Server socket reference
     * @param players Array of player tokens that will play this game
     * @param ui Optional GUI reference
     * @param options Server startup options
     */
    constructor(session: Game, io: SocketIO.Server, players: Array<string>, ui: GUI, options: Options) {
        this.ui = ui;
        this.io = io;
        this.session = session;
        this.state = new State();
        this.timeout = parseInt(options.timeout, 10) || 100;
        this.maxGames = parseInt(options.games, 10) || 1000;
        this.players = players;
        this.currentPlayer = 0;
        this.firstPlayer = 0;
        this.game = new UTTT();

        if (this.ui) {
            this.gameUIId = this.ui.addGameBox(
                this.players[session.players[0].playerIndex],
                this.players[session.players[0].playerIndex]
            );
        }
    }

    /**
     * Play an individual game between two players
     */
    public playGame() {
        this.gameStart = process.hrtime();
        this.state.games++;
        this.game = new UTTT();
        this.currentPlayer = this.firstPlayer;

        this.io.emit('stats', {
            type: 'game-start',
            payload: {
                players: [
                    this.players[this.session.players[0].playerIndex],
                    this.players[this.session.players[1].playerIndex]
                ],
            },
        });

        this.sendAction('init', 0);
        this.sendAction('init', 1);

        this.sendAction('move', this.firstPlayer);
    }

    /**
     * Handle each individual game
     * @param winner Game's winner, used to update the state
     * @param playerDisconnected Whether the game was stopped due to a player disconnecting. If true, the session will be finished
     */
    public handleGameEnd(winner: PlayerNumber, playerDisconnected: boolean = false) {
        const hrend = process.hrtime(this.gameStart);
        this.state.times.push(funcs.convertExecTime(hrend[1]));

        if (winner > -1) {
            this.state.wins[winner]++;
        } else {
            this.state.ties++;
        }

        // Swap the first player after each game to reduce
        // advantages from going first/second
        this.firstPlayer = (this.firstPlayer === 1) ? 0 : 1;

        if (this.ui) {
            const progress = Math.floor(this.state.games * 100 / this.maxGames);
            this.ui.setGameProgress(this.gameUIId, progress);
        }

        if (!playerDisconnected && this.state.games < this.maxGames) {
            // play the next game
            this.playGame();
        } else {
            // finish the game session
            this.sessionEnd();
        }
    }

    /**
     * Receive a move from a player and convert it to an object
     * of board and move
     * @param data String received from the client
     * @returns {{board: Array, move: Array}}
     */
    private parseMove(data: string): Coords {
        const parts = data.trim().split(';');
        const board = parts[0].split(',').map((coord) => parseInt(coord, 10));
        const move = parts[1].split(',').map((coord) => parseInt(coord, 10));
        return {
            board: [
                board[0],
                board[1],
            ],
            move: [
                move[0],
                move[1],
            ]
        };
    }

    /**
     * Encode a move received from a player to be sent to the opponent
     * @param coords {{board: Array, move: Array}}
     * @returns {string}
     */
    private writeMove(coords: Coords) {
        return coords.board[0] + ',' + coords.board[1] + ';' +
            coords.move[0] + ',' + coords.move[1];
    }

    /**
     * Handles a specific player move - this returns a function
     * configured for the specified player, it's intended to be used
     * as the callback for the player socket.
     * @param player Player number (0-1)
     * @returns {Function} Move handler with the player number embedded for logging
     */
    public handlePlayerMove(player: PlayerNumber) {
        return (data: string) => {
            if (this.currentPlayer !== player) {
                this.log(
                    'Game ' + this.state.games +
                    ': Player ' + player + ' played out of time (it was ' + this.currentPlayer + ' turn)'
                );
                this.handleGameEnd(this.currentPlayer);
                return;
            }
            if (data === 'fail') {
                this.handleGameEnd(this.switchPlayer(this.currentPlayer));
                return;
            }
            try {
                const coords = this.parseMove(data);
                this.game.move(coords.board, this.currentPlayer + 1, coords.move);
                if (this.game.isFinished()) {
                    this.handleGameEnd(this.switchPlayer(this.game.winner));
                    return;
                }
                this.currentPlayer = this.switchPlayer(this.currentPlayer);
                this.sendAction('opponent ' + this.writeMove(coords), this.currentPlayer);
            } catch (e) {
                this.log('Game ' + this.state.games + ': Player ' + this.currentPlayer + ' errored: ' + e.message);
                this.handleGameEnd(this.switchPlayer(this.currentPlayer));
            }
        };
    }

    /**
     * Type safe way of switching from one player to another
     * @param player
     */
    private switchPlayer(player: PlayerOrTie): PlayerNumber {
        return (player === 0) ? 1 : 0;
    }

    /**
     * Send an action to a player
     * @param session Session object
     * @param action Action to send
     * @param player Player number (0-1)
     */
    private sendAction(action: string, player: number): void {
        if (this.session.players[player]) {
            this.session.players[player].socket.emit('game', {
                action,
            });
        }
    }

    /**
     * Handle the end of a session between two players
     */
    private sessionEnd() {
        const players = [
            this.players[this.session.players[0].playerIndex],
            this.players[this.session.players[1].playerIndex],
        ];
        this.log('Finished games between "' +
            players[0] +
            '" and "' +
            players[1] +
            '"'
        );

        const stats = this.state.getStats();

        if (stats.winner === -1) {
            this.sendAction('end tie', 0);
            this.sendAction('end tie', 1);
        } else if (stats.winner === 0) {
            this.sendAction('end win', 0);
            this.sendAction('end lose', 1);
        } else {
            this.sendAction('end lose', 0);
            this.sendAction('end win', 1);
        }


        this.io.emit('stats', {
            type: 'session-end',
            payload: {
                players: [
                    this.players[this.session.players[0].playerIndex],
                    this.players[this.session.players[1].playerIndex]
                ],
                stats: stats,
            },
        });

        let winner = '-';
        if (stats.winner > -1) {
            winner = players[stats.winner];
        }

        if (this.ui) {
            this.ui.setGameEnd(this.gameUIId, winner, this.state);
        } else {
            this.log('Session ended between ' + players[0] + ' and ' + players[1] + '. Winner ' + winner);
        }
    }

    /**
     * Log a message to the console or the GUI if it's enabled
     * @param message
     * @param skipRender only for GUI mode, set to true to avoid re-rendering
     */
    private log(message: string, skipRender: boolean = false): void {
        const time = (new Date()).toTimeString().substr(0, 5);
        if (this.ui) {
            this.ui.log(message, skipRender);
        } else {
            console.log(time, message);
        }
    }
}