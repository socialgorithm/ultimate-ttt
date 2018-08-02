import SocketServer from "../server/SocketServer";
import Match from "./match/Match";
import Player from "./model/Player";
export interface ITournamentOptions {
    numberOfGames: number;
    type: string;
    timeout: number;
    autoPlay: boolean;
}
export declare class Tournament {
    private options;
    private socket;
    players: Player[];
    private lobbyToken;
    private player;
    private stats;
    private matchmaker;
    constructor(options: ITournamentOptions, socket: SocketServer, players: Player[], lobbyToken: string);
    start(): Promise<void>;
    continue(): Promise<void>;
    playMatches(matches: Match[]): Promise<void>;
    isFinished(): boolean;
    getStats(): {
        finished: boolean;
        matches: {
            players: {
                token: string;
            }[];
            stats: import("../tournament/model/State").default;
            uuid: string;
        }[];
        options: ITournamentOptions;
        ranking: string[];
        started: boolean;
        waiting: boolean;
    };
    private playMatch;
    private playTournament;
    private updateStats;
    private sendStats;
    private onGameInit;
    private onGameMove;
}
