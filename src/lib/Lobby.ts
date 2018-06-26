import Session from './Session';
import { Player } from './Player';

export class Lobby {
    public token: string = "${randomWord()}-${randomWord()}"
    public players: Array<Player>

    constructor(public admin: Player) {}
}