import { PlayerNumber, PlayerOrTie } from "@socialgorithm/ultimate-ttt/dist/model/constants";
import Player from "tournament/model/Player";
import IGameOptions from "./GameOptions";
export default class Game {
    private players;
    private options;
    private log;
    winnerIndex: PlayerOrTie;
    gameTime: number;
    timedoutPlayer: PlayerNumber;
    private game;
    private currentPlayerIndex;
    private gameStart;
    private gamePromise;
    private resolve;
    private playerMoveTimeout;
    constructor(players: Player[], options: IGameOptions, log: any);
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
