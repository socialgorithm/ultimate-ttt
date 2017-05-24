import Player from "./Player";
export interface SocketEvents {
    onPlayerConnect(player: Player): void;
    onPlayerDisconnect(player: Player): void;
    updateStats(): void;
}
export default class Socket {
    private io;
    private socketEvents;
    constructor(port: number, socketEvents: SocketEvents);
    emit(type: string, data: {
        type: string;
        payload: any;
    }): void;
    private handler(req, res);
}
