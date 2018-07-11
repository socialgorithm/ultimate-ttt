import Session from './Session';
import OnlineGame from './OnlineGame';
import OnlineServer from './OnlineServer';
import { Tournament } from './Tournament';
import {PlayerNumber} from "@socialgorithm/ultimate-ttt/dist/model/constants";

export interface Player {
    session: Session;
    token: string; // user unique name
    socket: SocketIO.Socket;
    getIndexInSession(): PlayerNumber;
    deliverAction(action: string): void;
    otherPlayerInSession(): Player;
    alive(): boolean;
}

export class PlayerImpl implements Player {

    public session: Session;

    constructor(public token: string, public socket: SocketIO.Socket) { }

    getIndexInSession(): PlayerNumber {
        return this.session.players.indexOf(this) as PlayerNumber;
    }

    deliverAction(action: string): void {
        this.socket.emit('game', { action });
    }

    otherPlayerInSession(): Player {
        return this.session.players[1 - this.getIndexInSession()];
    }

    alive(): boolean {
        return this.socket.connected;
    }

}