import { Options } from "./input";
export default class OnlineServer {
    private options;
    private players;
    private ui?;
    private socketServer;
    private tournament;
    constructor(options: Options);
    private onTournamentStart();
    private onPlayerConnect(player);
    private onPlayerDisconnect(player);
    private updateStats();
    private addPlayer(player);
    private removePlayer(player);
    private log(message, skipRender?);
}
