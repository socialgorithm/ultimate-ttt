import { PlayerNumber, PlayerOrTie } from "@socialgorithm/ultimate-ttt/dist/model/constants";
import Player from 'tournament/model/Player';
import GameOptions from './GameOptions';
export default class Game {
    private players;
    private options;
    private log;
    private game;
    private currentPlayerIndex;
    private gameStart;
    private gamePromise;
    private resolve;
    private playerMoveTimeout;
    winnerIndex: PlayerOrTie;
    gameTime: number;
    timedoutPlayer: PlayerNumber;
    constructor(players: Player[], options: GameOptions, log: any);
    playGame(): Promise<boolean>;
    private resetPlayers;
    private askForMove;
    private handlePlayerMove;
    private handlePlayerTimeout;
    private handleGameWon;
    private handleGameTied;
    private handleGameEnd;
    private parseMove;
    private writeMove;
    private switchPlayer;
}
