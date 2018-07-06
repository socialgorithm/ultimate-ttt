import { Player } from './Player';
import { Tournament } from './Tournament';
export declare class Lobby {
    admin: Player;
    token: string;
    players: Array<Player>;
    tournament: Tournament;
    constructor(admin: Player);
}
