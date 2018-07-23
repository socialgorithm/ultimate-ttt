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
    private sendStats;
}
