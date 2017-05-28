import { Player } from './Player';

export default class Session {

  constructor(public players: [Player, Player]) { }

  playerTokens(): [string, string] {
    return this.players.map(p => p.token) as [string, string];
  }

}