import { Options } from "./input";
export default class OnlineServer {
    private options;
    private players;
    private ui?;
    private socketServer;
    private tournament;
    constructor(options: Options);
    private onTournamentStart;
    private onPlayerConnect;
    private onPlayerDisconnect;
    private updateStats;
    private addPlayer;
    private removePlayer;
    private log;
}
