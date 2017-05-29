import { SocketServer } from './SocketServer';
import Session from './Session';
import { Player } from './Player';
import GUI from './GUI';
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
    private ui;
    private profiles;
    private complete;
    private started;
    constructor(name: string, socketServer: SocketServer, participants: Player[], ui?: GUI);
    start(): void;
    endSession(session: Session): void;
    isFinished(): boolean;
    private profileByPlayer(player);
    private startSession(session, settings?);
    private leftToPlay(profile);
    private flush();
    private playerIsDone(profile);
}
