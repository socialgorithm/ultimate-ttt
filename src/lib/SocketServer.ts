import * as http from 'http';
import * as io from 'socket.io';
import * as fs from 'fs';
import { Player } from "./Player";

export interface SocketEvents {
    onPlayerConnect(player: Player): void;
    onPlayerDisconnect(player: Player): void;
    updateStats(): void;
    onTournamentStart(): void;
}

export default class SocketServer {
    private io: SocketIO.Server;
    private socketEvents: SocketEvents;

    constructor(port: number, socketEvents: SocketEvents) {
        const app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);

        this.socketEvents = socketEvents;

        this.io.use((socket: SocketIO.Socket, next: Function) => {
            const isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            const { token } = socket.request._query;
            if (!token) {
                return next(new Error('Missing token'));
            }
            socket.request.testToken = token;
            next();
        });

        this.io.on('connection', (socket) => {
            if (socket.handshake.query.client) {
                // a client (observer) has connected, don't add to player list
                // send a summary of the server
                this.socketEvents.updateStats();
                socket.on('tournament', () => {
                    this.socketEvents.onTournamentStart();
                });
                return true;
            }

            const player = new Player(socket.handshake.query.token, socket);

            socket.on('disconnect', () => {
                this.socketEvents.onPlayerDisconnect(player);
            });

            this.socketEvents.onPlayerConnect(player);
        });
    }

    /**
     * Send a message to any client listening on the socket
     * @param type Message type (determines who receives the data)
     * @param data Data to be sent
     */
    public emit(type: string, data: { type: string, payload: any }): void {
        this.io.emit(type, data);
    }

    public emitPayload(emitType: string, type: string, payload: any): void {
        this.emit(emitType, { type, payload });
    }

    /**
     * Handler for the WebSocket server. It returns a static HTML file for any request
     * that links to the server documentation and Github page.
     * @param req
     * @param res
     */
    private handler(req: http.IncomingMessage, res: http.ServerResponse) {
        fs.readFile(__dirname + '/../../public/index.html',
            (err: any, data: any) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            });
    }
}