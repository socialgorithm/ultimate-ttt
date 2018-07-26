import { PlayerOrTie } from "@socialgorithm/ultimate-ttt/dist/model/constants";
import Player from '../../model/Player';
import GameOptions from './GameOptions';
import GameEvents from './GameEvents';
import PubSubber from '../../model/Subscriber';
export default class Game extends PubSubber {
    private matchID;
    private players;
    private options;
    private events;
    private log;
    private game;
    private currentPlayerIndex;
    private gameStart;
    winnerIndex: PlayerOrTie;
    gameTime: number;
    constructor(matchID: string, players: Player[], options: GameOptions, events: GameEvents, log: any);
    start(): void;
    private onFinish;
    private handlePlayerMove;
    private handleGameWon;
    private handleGameTied;
    private handleGameEnd;
    private sendToPlayer;
    private parseMove;
    private writeMove;
    private switchPlayer;
}
