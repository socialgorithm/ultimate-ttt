import UTTT from '@socialgorithm/ultimate-ttt';
import {Coords, PlayerNumber, PlayerOrTie} from "@socialgorithm/ultimate-ttt/dist/model/constants";

import State from "./State";
import {Options} from "./input";
import GUI from "./GUI";
import * as funcs from './funcs';
import SocketServer from './SocketServer';
import Player from './player';
import Session from './Session';

/**
 * Online game manager between two players
 */
export default class OnlineGame {
    private timeout: number;
    private maxGames: number;
    private state: State;
    private currentPlayer: Player;
    private firstPlayer: Player;
    private game: UTTT;
    private gameStart: [number, number];
    private gameIDForUI: number;

    /**
     * Build a new game manager
     * @param session game information
     * @param socket Server socket reference
     * @param players Array of player tokens that will play this game
     * @param ui Optional GUI reference
     * @param options Server startup options
     */
    constructor(private session: Session, private socket: SocketServer, private ui: GUI, options: Options) {
        this.state = new State();
        this.timeout = parseInt(options.timeout, 10) || 100;
        this.maxGames = parseInt(options.games, 10) || 1000;
        this.currentPlayer = session.players[0];
        this.firstPlayer = session.players[0];
        this.game = new UTTT();

        if (this.ui) {
            this.gameIDForUI = this.ui.addGameBox.apply(this.ui, this.getPlayerTokens());
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

        this.socket.emitPayload('stats', 'game-start', { players: this.getPlayerTokens() });

        this.session.players[0].deliverAction('init');
        this.session.players[1].deliverAction('init');
        this.firstPlayer.deliverAction('move');
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
        this.firstPlayer = this.session.players[this.firstPlayer.getIndexInSession() === 1 ? 0 : 1];

        if (this.ui) {
            const progress = Math.floor(this.state.games * 100 / this.maxGames);
            this.ui.setGameProgress(this.gameIDForUI, progress);
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
        const [board, move] = data.trim().split(';')
            .map(part => part.split(',').slice(2).map(parseInt) as [number, number]);
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
     * Handles a specific player move - this returns a function
     * configured for the specified player, it's intended to be used
     * as the callback for the player socket.
     * @param player Player number (0-1)
     * @returns {Function} Move handler with the player number embedded for logging
     */
    public handlePlayerMove(player: Player) {
        return (data: string) => {
            if (this.currentPlayer !== player) {
                this.log(`Game ${this.state.games}: Player ' + player + ' played out of time (it was ' + this.currentPlayer + ' turn)`);
                this.handleGameEnd(this.currentPlayer.getIndexInSession());
                return;
            }
            if (data === 'fail') {
                this.handleGameEnd(this.switchPlayer(this.currentPlayer).getIndexInSession());
                return;
            }
            try {
                const coords = this.parseMove(data);
                this.game.move(coords.board, this.currentPlayer.getIndexInSession() + 1, coords.move);
                if (this.game.isFinished()) {
                    this.handleGameEnd(this.switchPlayer(this.session.players[this.game.winner]).getIndexInSession());
                    return;
                }
                this.currentPlayer = this.switchPlayer(this.currentPlayer);
                this.currentPlayer
                this.currentPlayer.deliverAction(`opponent ${this.writeMove(coords)}`);
            } catch (e) {
                this.log(`Game ${this.state.games}: Player ${this.currentPlayer} errored: ${e.message}`);
                this.handleGameEnd(this.switchPlayer(this.currentPlayer).getIndexInSession());
            }
        };
    }

    /**
     * Type safe way of switching from one player to another
     * @param player
     */
    private switchPlayer(player: Player): Player {
        return this.session.players[this.session.players.indexOf(player) === 0 ? 1 : 0];
    }

    /**
     * Handle the end of a session between two players
     */
    private sessionEnd() {
        const players = this.getPlayerTokens();
        this.log(`Finished games between "${players[0]}" and "${players[1]}"`);

        const stats = this.state.getStats();

        if (stats.winner === -1) {
            this.session.players.forEach(p => p.deliverAction('end tie'));
        } else {
            this.session.players[stats.winner].deliverAction('end win');
            this.session.players[1 - stats.winner].deliverAction('end lose');
        }


        this.socket.emitPayload('stats', 'session-end', { players: this.getPlayerTokens(), stats: stats });

        let winner = '-';
        if (stats.winner > -1) {
            winner = players[stats.winner];
        }

        if (this.ui) {
            this.ui.setGameEnd(this.gameIDForUI, winner, this.state);
        } else {
            this.log('Session ended between ' + players[0] + ' and ' + players[1] + '. Winner ' + winner);
        }
    }

    public getPlayerTokens(): [string, string] {
        return this.session.players.map(p => p.token);
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