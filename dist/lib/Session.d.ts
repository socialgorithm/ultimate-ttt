import { Player } from './Player';
import State, { Stats } from "./State";
export default class Session {
    players: [Player, Player];
    private handlers;
    state: State;
    stats: Stats;
    constructor(players: [Player, Player]);
    playerTokens(): [string, string];
    registerHandler(index: 0 | 1, type: string, handler: Function): void;
    terminate(): void;
}
