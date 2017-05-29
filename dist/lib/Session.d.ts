import { Player } from './Player';
export default class Session {
    players: [Player, Player];
    private handlers;
    constructor(players: [Player, Player]);
    playerTokens(): [string, string];
    registerHandler(index: 0 | 1, type: string, handler: Function): void;
    terminate(): void;
}
