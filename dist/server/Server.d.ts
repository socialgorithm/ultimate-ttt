import { Options } from "../lib/cli-options";
export default class Server {
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
    private updateStats;
    private addPlayer;
    private removePlayer;
    private log;
}
