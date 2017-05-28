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
    markAsComplete(): void;
}
export declare class Tournament {
    readonly name: string;
    private socketServer;
    participants: Player[];
    private ui;
    private profiles;
    private complete;
    constructor(name: string, socketServer: SocketServer, participants: Player[], ui?: GUI);
    endSession(session: Session): void;
    isFinished(): boolean;
    profileByPlayer(player: Player): TournamentProfile;
    private startSession(session, settings?);
    private flush();
    private playerIsDone(profile);
}
