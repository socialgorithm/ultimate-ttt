import { Player } from './Player';

export default class Session {

  private handlers: [number, string, Function][] = [];

  constructor(public players: [Player, Player]) { }

  playerTokens(): [string, string] {
    return this.players.map(p => p.token) as [string, string];
  }

  registerHandler(index: 0|1, type: string, handler: Function) {
    this.handlers.push([index, type, handler]);
    this.players[index].socket.on(type, handler);
  }

  terminate() {
    for (let [index, type, handler] of this.handlers) {
      this.players[index].socket.removeListener(type, handler);
    }
  }

}