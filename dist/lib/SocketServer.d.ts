import { Player } from "./Player";
export interface SocketEvents {
    onPlayerConnect(player: Player): void;
    onPlayerDisconnect(player: Player): void;
    updateStats(): void;
    onTournamentStart(): void;
}
export interface SocketServer {
    emit(type: string, data: {
        type: string;
        payload: any;
    }): void;
    emitPayload(emitType: string, type: string, payload: any): void;
}
export declare class SocketServerImpl implements SocketServer {
    private io;
    private socketEvents;
    constructor(port: number, socketEvents: SocketEvents);
    emit(type: string, data: {
        type: string;
        payload: any;
    }): void;
    emitPayload(emitType: string, type: string, payload: any): void;
    private handler;
}
