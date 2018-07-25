import * as http from 'http';
import * as io from 'socket.io';
import * as fs from 'fs';

import * as events from '../events';
import Player from "../tournament/model/Player";
import { Lobby } from '../tournament/model/Lobby';
import PubSubber from '../tournament/model/Subscriber';

/**
 * SocketServer performs all the necessary work around sockets
 * and notifies the main Server of any changes (players, lobbies... )
 * 
 * The idea behind separating it is to provide a clean interface to the socket,
 * and preserve all the server functionality independent of it. Testing should
 * become easier because of that for example.
 */
export default class SocketServer extends PubSubber {
    private io: SocketIO.Server;
    private playerSockets: {
        [ key: string ]: SocketIO.Socket,
    };

    constructor(port: number) {
        super();
        const app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);

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
            const token = socket.handshake.query.token;
            const player = new Player(token);
            
            // Store the socket
            this.playerSockets[token] = socket;

            // Forward the socket events to the PubSub system
            socket.on('lobby create', this.publishPlayerEvent(events.LOBBY_CREATE, token));
            socket.on('lobby tournament start', this.publishPlayerEvent(events.TOURNAMENT_START, token));
            socket.on('lobby join', this.publishPlayerEvent(events.LOBBY_JOIN, token));
            socket.on('disconnect', (data) => {
                // Remove the player socket
                delete this.playerSockets[token];
                this.publishPlayerEvent(events.PLAYER_DISCONNECT, token)(data);
            });

            this.publish(events.PLAYER_CONNECT, player);
        });

        // Subscribe to events
        this.subscribe(events.success(events.LOBBY_JOIN), this.onLobbyJoined);
        this.subscribe(events.success(events.PLAYER_DISCONNECT), this.onPlayerDisconnected);
    }

    private onLobbyJoined(data: { lobby: Lobby, player: Player }) {
        this.io.in(data.lobby.token).emit('connected', {
            lobby: data.lobby.toObject()
        });
        const socket = this.playerSockets[data.player.token];
        if (!socket) {
            console.error('Unknown player', data.player.token);
            return;
        }
        socket.join(data.lobby.token);
        socket.emit('lobby joined', {
            lobby: data.lobby.toObject(),
            isAdmin: data.lobby.admin.token === data.player.token,
        })
    }

    private publishPlayerEvent(event: string, token: string) {
        return (data: any) => {
            this.publish(`${event}.${token}`, data);
        };
    }

    /**
     * Send a message to a lobby
     * @param lobby Lobby token
     * @param type Message type (determines who receives the data)
     * @param data Data to be sent
     */
    private emitInLobby(lobby: string, type: string, data: any): void {
        this.io.to(lobby).emit(type, data);
    }

    /**
     * Send a message to everyone
     * @param emitType
     * @param data 
     */
    private emitPayload(emitType: string, data: any): void {
        this.io.emit(emitType, data);
    }

    /**
     * Send a message to a specific player
     * @param playerToken
     * @param type 
     * @param data 
     */
    private emitToPlayer(playerToken: string, type: string, data: any): void {
        // TODO find player and emit something to them
        const socket = this.playerSockets[data.player.token];
        if (!socket) {
            console.error('Unknown player', data.player.token);
            return;
        }
        socket.emit(type, data);
    }

    /**
     * After a player has successfully disconnected, we need to notify
     * all the lobbies the player belonged to
     * @param data
     */
    private onPlayerDisconnected(data: { player: Player, lobbyList: Array<Lobby> }) {
        data.lobbyList.forEach(lobby => {
            this.emitInLobby(lobby.token, 'lobby disconnected', {
                lobby: lobby.toObject(),
            });
        });
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