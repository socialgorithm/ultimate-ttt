import { Options } from "./input";
import GUI from "./GUI";
import SocketServer from './SocketServer';
import Player from './player';
import Session from './Session';
export default class OnlineGame {
    private session;
    private socket;
    private ui;
    private timeout;
    private maxGames;
    private state;
    private currentPlayer;
    private firstPlayer;
    private game;
    private gameStart;
    private gameIDForUI;
    constructor(session: Session, socket: SocketServer, ui: GUI, options: Options);
    playGame(): void;
    handleGameEnd(winner: Player, playerDisconnected?: boolean): void;
    private parseMove(data);
    private writeMove(coords);
    handlePlayerMove(player: Player): (data: string) => void;
    private switchPlayer(player);
    private sessionEnd();
    private playerZero();
    private playerOne();
    private log(message, skipRender?);
}
