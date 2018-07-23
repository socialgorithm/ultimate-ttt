/// <reference types="socket.io" />
declare type Handler = (...args: any[]) => void;
export default class Channel {
    private socket;
    private handlers;
    constructor(socket: SocketIO.Socket);
    registerHandler(type: string, handler: Handler): void;
    removeAllHandlers(): void;
    send(type: string, ...args: any[]): void;
    isConnected(): boolean;
    disconnect(): void;
}
export {};
