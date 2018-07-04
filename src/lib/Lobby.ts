import randomWord from 'random-word'

import { Player } from './Player';
import { Tournament } from './Tournament';

export class Lobby {
    public token: string = `${randomWord()}-${randomWord()}`;
    public players: Array<Player>;
    public tournament: Tournament;

    constructor(public admin: Player) {}
}