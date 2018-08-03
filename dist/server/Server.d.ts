import { IOptions } from "../lib/cli-options";
export default class Server {
    private options;
    private players;
    private lobbies;
    private socketServer;
    constructor(options: IOptions);
    private onPlayerConnect;
    private onPlayerDisconnect;
    private onLobbyKick;
    private onLobbyBan;
    private onLobbyCreate;
    private onLobbyJoin;
    private onLobbyTournamentStart;
    private onLobbyTournamentContinue;
    private addPlayer;
    private removePlayer;
    private log;
}
