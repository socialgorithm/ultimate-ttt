/// <reference types="socket.io" />
import { Options } from "./input";
export interface Player {
    playerIndex: number;
    socket: SocketIO.Socket;
}
export interface Game {
    players: Array<Player>;
}
export default class OnlineServer {
    private players;
    private games;
    private nextGame;
    private ui?;
    private io;
    private host;
    private port;
    constructor(options: Options);
    private startSession(session, settings?);
    private handler(req, res);
    private addPlayer(player);
    private removePlayer(player);
    private log(message, skipRender?);
}
