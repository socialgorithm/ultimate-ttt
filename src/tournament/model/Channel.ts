import Player from './Player';
import State, {Stats} from "./State";

type Handler = (...args: any[]) => void;

/**
 * Used to communicate with the player and receive messages from the player
 * Abstracts the players socket
 */
export default class Channel {

  private handlers: [string, Handler][] = [];

  constructor(private socket: SocketIO.Socket) { }

  registerHandler(type: string, handler: Handler) {
    this.handlers.push([type, handler]);
    this.socket.on(type, handler);
  }

  removeAllHandlers() {
    for (let [type, handler] of this.handlers) {
      this.socket.removeListener(type, handler);
    }
  }

  send(type: string, ...args: any[]) {
    this.socket.emit(type, args)
  }

  isConnected(): boolean {
    return this.socket.connected
  } 

}