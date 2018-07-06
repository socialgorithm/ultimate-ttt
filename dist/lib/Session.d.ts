import { Player } from './Player';
import State, { Stats } from "./State";
declare type Handler = (...args: any[]) => void;
export default class Session {
    players: [Player, Player];
    private handlers;
    state: State;
    stats: Stats;
    constructor(players: [Player, Player]);
    playerTokens(): [string, string];
    registerHandler(index: 0 | 1, type: string, handler: Handler): void;
    terminate(): void;
}
export {};
