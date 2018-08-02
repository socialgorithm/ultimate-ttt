import { Options } from "lib/cli-options";
export default class Server {
    private options;
    private players;
    private lobbies;
    private socketServer;
    constructor(options: Options);
    private onPlayerConnect;
    private onPlayerDisconnect;
    private onLobbyKick;
    private onLobbyBan;
    private onLobbyCreate;
    private onLobbyJoin;
    private onLobbyTournamentStart;
    private onLobbyTournamentContinue;
    private updateStats;
    private addPlayer;
    private removePlayer;
    private log;
}
