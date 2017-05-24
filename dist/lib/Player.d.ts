/// <reference types="socket.io" />
export default class Player {
    token: string;
    socket: SocketIO.Socket;
    constructor(token: string, socket: SocketIO.Socket);
}
