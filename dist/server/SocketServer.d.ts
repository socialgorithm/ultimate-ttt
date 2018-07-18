import Player from "../tournament/model/Player";
import { Lobby } from '../tournament/model/Lobby';
import { Tournament } from '../tournament/Tournament';
export interface SocketEvents {
    onPlayerConnect(player: Player): void;
    onPlayerDisconnect(player: Player): void;
    onLobbyCreate(player: Player): Lobby;
    onLobbyJoin(player: Player, lobbyToken: string, spectating: boolean): Lobby;
    onLobbyTournamentStart(lobbyToken: string): Tournament;
    updateStats(): void;
}
export interface SocketServer {
    emit(type: string, data: {
        type: string;
        payload: any;
    }): void;
    emitPayload(emitType: string, type: string, payload: any): void;
    emitInLobby(lobby: string, type: string, data: {
        type: string;
        payload: any;
    }): void;
}
export declare class SocketServerImpl implements SocketServer {
    private io;
    private socketEvents;
    constructor(port: number, socketEvents: SocketEvents);
    emit(type: string, data: {
        type: string;
        payload: any;
    }): void;
    emitInLobby(lobby: string, type: string, data: {
        type: string;
        payload: any;
    }): void;
    emitPayload(emitType: string, type: string, payload: any): void;
    private handler;
}
