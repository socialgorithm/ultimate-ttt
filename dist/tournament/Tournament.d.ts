import { Options } from '../lib/cli-options';
import SocketServer from '../server/SocketServer';
import Session from './model/Session';
import Player from './model/Player';
import GUI from '../server/GUI';
export declare class TournamentProfile {
    private tournament;
    player: Player;
    private opponent;
    private played;
    private complete;
    constructor(tournament: Tournament, player: Player);
    startPlaying(other: TournamentProfile): void;
    stopPlaying(): void;
    isPlaying(): boolean;
    currentOpponent(): TournamentProfile;
    isPlayable(): boolean;
    canPlayGivenProfile(other: TournamentProfile): boolean;
    isComplete(): boolean;
    markAsComplete(): void;
    hasPlayed(other: Player): boolean;
}
export declare class Tournament {
    readonly name: string;
    private socketServer;
    participants: Player[];
    private options;
    private ui?;
    private profiles;
    private complete;
    private started;
    private stats;
    constructor(name: string, socketServer: SocketServer, participants: Player[], options: Options, ui?: GUI);
    start(): void;
    private startSession;
    endSession(session: Session): void;
    isFinished(): boolean;
    private profileByPlayer;
    private leftToPlay;
    private flush;
    private sendUpdate;
    private playerIsDone;
    private log;
}
