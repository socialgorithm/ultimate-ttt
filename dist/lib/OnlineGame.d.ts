/// <reference types="socket.io" />
import { Game } from "./OnlineServer";
import { Options } from "./input";
import GUI from "./GUI";
export default class OnlineGame {
    private timeout;
    private maxGames;
    private state;
    private session;
    private players;
    private currentPlayer;
    private firstPlayer;
    private game;
    private gameStart;
    private gameUIId;
    private ui;
    private io;
    constructor(session: Game, io: SocketIO.Server, players: Array<string>, ui: GUI, options: Options);
    playGame(): void;
    handleGameEnd(winner: number, playerDisconnected?: boolean): void;
    private parseMove(data);
    private writeMove(coords);
    handlePlayerMove(player: number): (data: string) => void;
    private sendAction(action, player);
    private sessionEnd();
    private log(message, skipRender?);
}
