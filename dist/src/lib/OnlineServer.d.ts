import { Options } from "./input";
export default class OnlineServer {
    private options;
    private players;
    private games;
    private nextGame;
    private ui?;
    private socketServer;
    constructor(options: Options);
    private onTournamentStart();
    private onPlayerConnect(player);
    private onPlayerDisconnect(player);
    private updateStats();
    private startSession(session, settings?);
    private addPlayer(player);
    private removePlayer(player);
    private log(message, skipRender?);
}
