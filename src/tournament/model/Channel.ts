type Handler = (...args: any[]) => void;

/**
 * Used to communicate with the player and receive messages from the player
 * Abstracts the players socket
 */
export default class Channel {

  private handlers: Array<[string, Handler]> = [];

  constructor(private socket: SocketIO.Socket) { }

  public registerHandler(type: string, handler: Handler) {
    this.handlers.push([type, handler]);
    this.socket.on(type, handler);
  }

  public removeAllHandlers() {
    for (const [type, handler] of this.handlers) {
      this.socket.removeListener(type, handler);
    }
  }

  public send(type: string, ...args: any[]) {
    this.socket.emit(type, ...args);
  }

  public isConnected(): boolean {
    return this.socket.connected;
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

}
