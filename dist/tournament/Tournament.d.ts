import SocketServer from '../server/SocketServer';
import Player from './model/Player';
import Match from './match/Match';
export declare type TournamentOptions = {
    numberOfGames: number;
    type: string;
    timeout: number;
};
export declare class Tournament {
    private options;
    private socket;
    players: Player[];
    private lobbyToken;
    private player;
    private stats;
    private matchmaker;
    constructor(options: TournamentOptions, socket: SocketServer, players: Player[], lobbyToken: string);
    start(): Promise<void>;
    playMatches(matches: Match[]): Promise<void>;
    isFinished(): boolean;
    getStats(): {
        options: TournamentOptions;
        started: boolean;
        finished: boolean;
        matches: {
            uuid: string;
            stats: import("../../../../../../../../Users/bharat/code/sg/uttt/ultimate-ttt-server/src/tournament/model/State").default;
            players: {
                token: string;
            }[];
        }[];
        ranking: string[];
    };
    private sendStats;
}
