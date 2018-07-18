import Session from './Session';
import Game from './Game';
import Server from '../../server/Server';
import { Tournament } from '../Tournament';
import {PlayerNumber} from "@socialgorithm/ultimate-ttt/dist/model/constants";

export default class Player {

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