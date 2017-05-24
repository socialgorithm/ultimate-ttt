import Session from './Session';
import {PlayerNumber} from "@socialgorithm/ultimate-ttt/dist/model/constants";

export default class Player {

    public session: Session;

    constructor(public token: string, public socket: SocketIO.Socket) { }

    getIndexInSession(): PlayerNumber {
        return this.session.players.indexOf(this) as PlayerNumber;
    }

    deliverAction(action: string) {
        this.socket.emit('game', { action });
    }

}