import { Player } from './Player';
import { Stats } from "./State";
export default class Session {
    players: [Player, Player];
    private handlers;
    stats: Stats;
    constructor(players: [Player, Player]);
    playerTokens(): [string, string];
    registerHandler(index: 0 | 1, type: string, handler: Function): void;
    terminate(): void;
}
