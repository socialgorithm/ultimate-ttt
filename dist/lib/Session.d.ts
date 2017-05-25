import Player from './Player';
export default class Session {
    players: [Player, Player];
    constructor(players: [Player, Player]);
    playerTokens(): [string, string];
}
