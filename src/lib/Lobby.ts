import * as randomWord from 'random-word'

import { Player } from './Player';
import { Tournament } from './Tournament';

export class Lobby {
    public admin: Player;
    public token: string;
    public players: Array<Player>;
    public tournament: Tournament;

    constructor(admin: Player) {
        this.admin = admin;
        this.players = [];
        this.token = `${randomWord()}-${randomWord()}`;
    }

    toObject() {
        return JSON.parse(JSON.stringify(this, (key, value) => {
            if (key === 'socket' || key === 'admin') {
                return null;
            }
            return value;
        }))
    }
}