import PubSubber from '../tournament/model/Subscriber';
export default class SocketServer extends PubSubber {
    private io;
    private playerSockets;
    constructor(port: number);
    private onLobbyJoined;
    private publishPlayerEvent;
    private emitInLobby;
    private emitPayload;
    private emitToPlayer;
    private onPlayerDisconnected;
    private handler;
}
