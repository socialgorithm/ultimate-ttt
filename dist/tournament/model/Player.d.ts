/// <reference types="socket.io" />
import Session from './Session';
import { PlayerNumber } from "@socialgorithm/ultimate-ttt/dist/model/constants";
export default class Player {
    token: string;
    socket: SocketIO.Socket;
    session: Session;
    constructor(token: string, socket: SocketIO.Socket);
    getIndexInSession(): PlayerNumber;
    deliverAction(action: string): void;
    otherPlayerInSession(): Player;
    alive(): boolean;
}
