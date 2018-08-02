import {Coords, PlayerNumber, PlayerOrTie, RESULT_TIE} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import UTTT from "@socialgorithm/ultimate-ttt/dist/UTTT";

import * as funcs from "../../../lib/funcs";
import Player from "../../../tournament/model/Player";
import ITournamentEvents from "../../../tournament/TournamentEvents";

import IGameOptions from "./GameOptions";
import { IGameStats, IMove } from "./GameStats";

/**
 * Delay in ms to be used before starting a new game after a player times out.
 * The idea is to ensure that the player doesn't respond out of time for the next game.
 */
const AFTER_TIMEOUT_DELAY = 100;

/**
 * A game between two players
 */
export default class Game {
    public winnerIndex: PlayerOrTie;
    public gameTime: number;
    public timedoutPlayer: PlayerNumber;
    private game: UTTT;
    private currentPlayerIndex: PlayerNumber;
    private gameStart: [number, number];
    private gamePromise: Promise<boolean>;
    private resolve: (state: boolean) => void;
    private playerMoveTimeout: NodeJS.Timer;

    /**
     * Create a game between two players
     * * @param options Options for gameplay
     */
    constructor(private players: Player[], private options: IGameOptions, private events: ITournamentEvents, private log: any) {
        this.game = new UTTT();
        this.gamePromise = new Promise(resolve => {
            this.resolve = resolve;
        });
        this.winnerIndex = null;
        this.timedoutPlayer = null;
    }

    /**
     * Play an individual game between two players
     */
    public playGame(): Promise<boolean> {
        this.gameStart = process.hrtime();
        this.currentPlayerIndex = 0;

        this.players[0].channel.registerHandler("game", this.handlePlayerMove(0));
        this.players[1].channel.registerHandler("game", this.handlePlayerMove(1));

        this.resetPlayers();
        this.askForMove();

        return this.gamePromise;
    }

    private resetPlayers() {
        this.players[0].channel.send("game", "init");
        this.players[1].channel.send("game", "init");
        this.events.onGameInit();
    }

    /**
     * Send a request for a move to the current player index
     * It will also start the timeout that will make the player lose if they haven't answered in time
     * @param playerIndex
     * @param move
     */
    private askForMove(move?: string) {
        if (move) {
            this.players[this.currentPlayerIndex].channel.send("game", `opponent ${move}`);
        } else {
            this.players[this.currentPlayerIndex].channel.send("game", "move");
        }
        // Start the timer for this player's move
        this.playerMoveTimeout = setTimeout(() => {
            this.handlePlayerTimeout(this.currentPlayerIndex);
        }, this.options.timeout);
    }

    /**
     * Handles a specific player move - this returns a function configured for the specified player,
     * it's intended to be used as the callback for the player socket.
     * @param player Player number (0-1)
     * @returns {Function} Move handler with the player number embedded for logging
     */
    private handlePlayerMove(playerIndex: number) {
        return (data: string) => {
            if (this.timedoutPlayer !== null || this.winnerIndex !== null) {
                // This game is already over
                return;
            }

            try {
                if (this.currentPlayerIndex !== playerIndex) {
                    const player = this.players[playerIndex];
                    this.log(`Game ${this.options.gameId}: Player ${player.token} played out of turn (it was ${this.players[this.currentPlayerIndex].token}'s turn)`);
                    this.handleGameWon(this.currentPlayerIndex);
                    return;
                }

                // Reset the timer
                clearTimeout(this.playerMoveTimeout);

                // Parse the response
                if (data === "fail") {
                    // this is weird and probably won't ever happen
                    this.handleGameWon(this.switchPlayer(this.currentPlayerIndex));
                    return;
                }

                const coords = this.parseMove(data);
                this.game = this.game.move(this.currentPlayerIndex, coords.board, coords.move);
                this.events.onGameMove({ board: coords.board, move: coords.move, player: this.currentPlayerIndex });
                this.currentPlayerIndex = this.switchPlayer(this.currentPlayerIndex);
                this.askForMove(this.writeMove(coords));

                if (this.game.isFinished()) {
                    if (this.game.winner === -1) {
                        this.handleGameTied();
                    } else {
                        this.handleGameWon(this.game.winner);
                    }
                    return;
                }
            } catch (e) {
                this.log(`Game ${this.options.gameId}: Player ${this.players[this.currentPlayerIndex].token} errored: ${e.message}`);
                // tslint:disable-next-line:no-console
                console.error(e);
                this.handleGameWon(this.switchPlayer(this.currentPlayerIndex));
            }
        };
    }

    private handlePlayerTimeout(playerIndex: PlayerNumber) {
        // Make the other player win
        this.timedoutPlayer = playerIndex;
        this.log(`Game ${this.options.gameId}: Player ${this.players[playerIndex].token} timed out`);
        this.handleGameWon(this.switchPlayer(playerIndex), AFTER_TIMEOUT_DELAY);
    }

    /**
     * Handle a game win
     * @param winnerIndex Game's winner, used to update the state
     */
    private handleGameWon(winnerIndex: PlayerNumber, delay?: number) {
        if (this.winnerIndex !== null) {
            // Game already over
            return;
        }
        this.winnerIndex = winnerIndex;
        this.handleGameEnd(delay);
    }

    private handleGameTied() {
        if (this.winnerIndex !== null) {
            // Game already over
            return;
        }
        this.winnerIndex = RESULT_TIE;
        this.handleGameEnd();
    }

    /**
     * Process all the required stuff about a game end
     * @param delay Wait before continuing - this should give players the chance to reset themselves
     */
    private handleGameEnd(delay?: number) {
        clearTimeout(this.playerMoveTimeout);
        const hrend = process.hrtime(this.gameStart);
        this.gameTime = funcs.convertExecTime(hrend[1]);
        this.players.forEach((player, index) => {
            let gameState = "tied";
            if (this.winnerIndex > RESULT_TIE) {
                if (this.winnerIndex === index) {
                    gameState = "won";
                } else {
                    gameState = "lost";
                }
            }
            if (this.timedoutPlayer === index) {
                gameState += "-timedOut";
            }
            player.channel.send("game", `end ${gameState}`);
            player.channel.removeAllHandlers();
        });
        this.resetPlayers();

        // Continue to next game
        if (delay && delay > 0) {
            setTimeout(() => {
                this.resolve(true);
            }, delay);
        } else {
            this.resolve(true);
        }
    }

    /**
     * Receive a move from a player and convert it to an object
     * of board and move
     * @param data String received from the client
     * @returns {{board: Array, move: Array}}
     */
    private parseMove(data: string): Coords {
        const [board, move] = data.trim().split(";")
            .map(part => part.split(",").map(n => parseInt(n, 10)) as [number, number]);
        return { board, move };
    }

    /**
     * Encode a move received from a player to be sent to the opponent
     * @param coords {{board: Array, move: Array}}
     * @returns {string}
     */
    private writeMove(coords: Coords) {
        const {board, move} = coords;
        return [board, move].map(p => p.join(",")).join(";");
    }

    /**
     * Type safe way of switching from one player to another
     */
    private switchPlayer(playerNumber: PlayerNumber): PlayerNumber {
        return playerNumber === 0 ? 1 : 0;
    }
}
