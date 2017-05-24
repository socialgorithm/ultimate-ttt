export default class Player {
    public token: string;
    public socket: SocketIO.Socket;

    constructor(token: string, socket: SocketIO.Socket) {
        this.token = token;
        this.socket = socket;
    }
}