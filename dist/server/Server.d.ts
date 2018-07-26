import { Options } from "../lib/cli-options";
import PubSubber from "../tournament/model/Subscriber";
export default class Server extends PubSubber {
    private options;
    private players;
    private lobbies;
    private ui?;
    private socketServer;
    constructor(options: Options);
    private onPlayerConnect;
    private onPlayerDisconnect;
    private onLobbyCreate;
    private onLobbyJoin;
    private onLobbyTournamentStart;
    private removePlayer;
    private log;
}
