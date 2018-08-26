import * as fs from "fs";
import * as http from "http";
import * as io from "socket.io";

import Channel from "./tournament/model/Channel";

import * as PubSub from 'pubsub-js';

import { DEFAULT_TOURNAMENT_OPTIONS } from "./server/constants";


export default class Server {
    private io: SocketIO.Server;
    private connections: Map<String, SocketIO.Socket> = new Map<String, SocketIO.Socket>();

    constructor(port: number) {
        const app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);

        this.io.use((socket: SocketIO.Socket, next: any) => {
            const isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            const { token } = socket.request._query;
            if (!token) {
                return next(new Error("Missing token"));
            }
            socket.request.testToken = token;
            next();
        });

        this.io.on("connection", (socket: SocketIO.Socket) => {
            this.connections.set(socket.handshake.query.token, socket);
            const userId: String = socket.handshake.query.token;

            socket.on('lobby create', () => PubSub.publish('lobby create', userId));
            socket.on('lobby tournament start', (data) => this.publishLobbyEvent('lobby tournament start', userId, data));
            socket.on('lobby join', (data) => this.publishLobbyEvent('lobby tournament start', userId, data));
            socket.on('lobby player kick', (data) => this.publishLobbyEvent('lobby tournament start', userId, data));
            socket.on('lobby player ban', (data) => this.publishLobbyEvent('lobby tournament start', userId, data));
            //player connect
            //TODO: player disconnection - from all lobbies
        });

        this.io.on("disconnection", (socket: SocketIO.Socket) => {
            const userId: String = socket.handshake.query.token;
            this.connections.delete(userId);
        });
    }

    private publishLobbyEvent(eventType: String, userId: String, data: any) {
        const lobbyId: String = data.lobbyId;
        PubSub.publish(eventType, {'userId': userId, 'lobbyId': lobbyId});
    }

    //handle http requests by providing index.html
    private handler(req: http.IncomingMessage, res: http.ServerResponse) {
        fs.readFile(__dirname + "/../../public/index.html",
            (err: any, data: any) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200);
                res.end(data);
            });
    }

    //TODO: subscription logic to send messages to client

}
