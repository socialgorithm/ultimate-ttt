import { Options } from './input';
import OnlineServer from './OnlineServer';
import OnlineGame from './OnlineGame';
import SocketServer from './SocketServer';
import Session from './Session';
import { Player } from './Player';
import GUI from './GUI';

export class TournamentProfile {

    private opponent: TournamentProfile;
    private played: string[];
    private complete: boolean = false;

    constructor(private tournament: Tournament, public player: Player) { }

    startPlaying(other: TournamentProfile): void {
        this.played.push(other.player.token);
        this.opponent = other;
    }

    stopPlaying(): void {
        this.opponent = undefined;
    }

    isPlaying(): boolean {
        return this.opponent === undefined;
    }

    currentOpponent(): TournamentProfile {
        return this.opponent;
    }

    isPlayable(): boolean {
        return !this.complete && this.opponent === undefined && this.player.alive();
    }

    canPlayGivenProfile(other: TournamentProfile) {
        return this.isPlayable() && other.isPlayable() && this.played.indexOf(other.player.token) < 0;
    }

    markAsComplete(): void {
        this.complete = true;
    }

}

export class Tournament {

    private profiles: TournamentProfile[];
    private complete: number;

    constructor(public readonly name: string, private socketServer: SocketServer, public participants: Player[], private ui?: GUI) {
        this.profiles = this.participants.map(p => new TournamentProfile(this, p));
        this.complete = 0;
        this.flush();
    }

    endSession(session: Session) {
        session.players.forEach(player => {
            const profile = this.profileByPlayer(player);
            profile.stopPlaying();
        });
        this.flush();
    }

    isFinished() {
        return this.complete === this.profiles.length;
    }

    profileByPlayer(player: Player) {
        return this.profiles.filter(p => p.player.token === player.token)[0];
    }
    
    private startSession(session: Session, settings: Options = {}) {
        this.socketServer.emitPayload('stats', 'session-start', { players: session.playerTokens() });
        const game = new OnlineGame(session, this.socketServer, this.ui, settings);

        session.players.forEach(player => {
            player.session = session;
        });

        session.players.forEach(player => {
            player.socket.on('disconnect', () => {
                game.handleGameEnd(player.otherPlayerInSession(), true);
            });
            player.socket.on('game', game.handlePlayerMove(player));
        });

        game.playGame();
    }

    private flush() {
        for (let profile of this.profiles) {
            if (!profile.isPlaying()) {

                for (let other of this.profiles) {
                    if (profile.canPlayGivenProfile(other)) {
                        profile.startPlaying(other);
                        other.startPlaying(profile);
                    }
                }

                if (!profile.isPlaying()) {
                    profile.markAsComplete();
                    this.playerIsDone(profile);
                    this.complete++;
                } else {
                    const session = new Session([profile.player, profile.currentOpponent().player]);
                    this.startSession(session);
                }
            }
        }
    }

    private playerIsDone(profile: TournamentProfile) {
        // TODO: handle player completion
    }

}