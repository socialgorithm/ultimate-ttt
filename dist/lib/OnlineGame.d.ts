/// <reference types="socket.io" />
import { PlayerNumber } from "@socialgorithm/ultimate-ttt/dist/model/constants";
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
    handleGameEnd(winner: PlayerNumber, playerDisconnected?: boolean): void;
    private parseMove(data);
    private writeMove(coords);
    handlePlayerMove(player: PlayerNumber): (data: string) => void;
    private switchPlayer(player);
    private sendAction(action, player);
    private sessionEnd();
    private log(message, skipRender?);
}
