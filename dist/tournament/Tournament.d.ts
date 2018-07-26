import SocketServer from '../server/SocketServer';
import Player from './model/Player';
import PubSubber from './model/Subscriber';
export declare type TournamentOptions = {
    numberOfGames: number;
    type: string;
    timeout: number;
};
export declare class Tournament extends PubSubber {
    private options;
    private socket;
    players: Player[];
    private lobbyToken;
    private player;
    private stats;
    private matchmaker;
    private tournamentID;
    constructor(options: TournamentOptions, socket: SocketServer, players: Player[], lobbyToken: string);
    start(): void;
    private playNextMatch;
    private playNextMatches;
    private onAllMatchesEnd;
    private onTournamentEnd;
    isFinished(): boolean;
    getStats(): {
        options: TournamentOptions;
        started: boolean;
        finished: boolean;
        matches: {
            stats: import("../../../../../../../Users/alex/proyects/socialgorithm/ultimate-ttt-server/src/tournament/model/State").default;
            players: {
                token: string;
            }[];
        }[];
        ranking: string[];
    };
}
