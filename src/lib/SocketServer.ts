import * as http from 'http';
import * as io from 'socket.io';
import * as fs from 'fs';
import { Player, PlayerImpl } from "./Player";
import { Lobby } from './Lobby';
import { Tournament } from './Tournament'

export interface SocketEvents {
    onPlayerConnect(player: Player): void;
    onPlayerDisconnect(player: Player): void;
    onLobbyCreate(player: Player): Lobby;
    onLobbyJoin(player: Player, lobbyToken: string, spectating: boolean): Lobby;
    onLobbyTournamentStart(lobbyToken: string): Tournament;
    updateStats(): void;
}

export interface SocketServer {
    emit(type: string, data: { type: string, payload: any }): void;
    emitPayload(emitType: string, type: string, payload: any): void;
    emitInLobby(lobby: string, type: string, data: { type: string, payload: any }): void;
}

export class SocketServerImpl implements SocketServer {
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

        this.io.on('connection', (socket: SocketIO.Socket) => {
            const player = new PlayerImpl(socket.handshake.query.token, socket);

            socket.on('lobby create', () => {
                const lobby = this.socketEvents.onLobbyCreate(player);
                socket.on('lobby tournament start', () => {
                    const tournament = this.socketEvents.onLobbyTournamentStart(lobby.token);
                    if(tournament == null) {
                        socket.emit('exception', {error: 'Unable to start tournament'});
                    } else {
                        socket.emit('started tournament', tournament);
                    }
                });
                if(lobby == null) {
                    socket.emit('exception', {error: 'Unable to create lobby'})
                } else {
                    socket.join(lobby.token);
                    socket.emit('lobby created', {
                        lobby: lobby.toObject()
                    });
                }
            });

            socket.on('lobby join', (data: any) => { 
                const lobby = this.socketEvents.onLobbyJoin(player, data.token, data.spectating); 
                if(lobby == null) {
                    socket.emit('lobby exception', {error: 'Unable to join lobby, ensure token is correct'})
                    return;
                }
                this.io.in(data.token).emit('connected', {
                    lobby: lobby.toObject()
                });
                socket.join(lobby.token);
                socket.emit('lobby joined', {
                    lobby: lobby.toObject(),
                    isAdmin: lobby.admin.token === player.token,
                })
            });

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

    /**
     * Send a message to a lobby
     * @param lobby Lobby token
     * @param type Message type (determines who receives the data)
     * @param data Data to be sent
     */
    public emitInLobby(lobby: string, type: string, data: { type: string, payload: any }): void {
        this.io.to(lobby).emit(type, data);
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