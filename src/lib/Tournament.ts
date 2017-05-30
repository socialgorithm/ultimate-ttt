import { Options } from './input';
import OnlineGame from './OnlineGame';
import { SocketServer } from './SocketServer';
import Session from './Session';
import { Player } from './Player';
import GUI from './GUI';
import {TournamentStats} from "../model/TournamentStats";
import StateImpl from "./State";

export class TournamentProfile {

    private opponent: TournamentProfile;
    private played: string[] = [];
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
        return this.opponent !== undefined;
    }

    currentOpponent(): TournamentProfile {
        return this.opponent;
    }

    isPlayable(): boolean {
        return !this.complete && !this.isPlaying() && this.player.alive();
    }

    canPlayGivenProfile(other: TournamentProfile) {
        return other !== this && this.isPlayable() && other.isPlayable() && this.played.indexOf(other.player.token) < 0;
    }

    isComplete(): boolean {
        return this.complete;
    }

    markAsComplete(): void {
        this.complete = true;
    }

    hasPlayed(other: Player): boolean {
        return this.played.filter(p => other.token === p).length > 0;
    }

}

export class Tournament {

    private profiles: TournamentProfile[];
    private complete: number;
    private started: boolean = false;
    private stats: TournamentStats;

    constructor(public readonly name: string, private socketServer: SocketServer, public participants: Player[], private options: Options, private ui?: GUI) {
        this.profiles = this.participants.map(p => new TournamentProfile(this, p));
        this.stats = {
            started: this.started,
            players: {},
        };
        this.participants.forEach((playerA) => {
            this.stats.players[playerA.token] = {};
            this.participants.forEach(
                (playerB) => {
                    this.stats.players[playerA.token][playerB.token] = {
                        started: false,
                        finished: false,
                        state: new StateImpl(),
                        stats: null,
                    };
                }
            )
        });
        this.complete = 0;
        this.started = false;
        this.flush();
    }

    start() {
        if (!this.started && !this.isFinished()) {
            this.started = true;
            this.stats.started = true;
            this.flush();
        }
    }

    private startSession(session: Session, settings: Options): void {
        this.socketServer.emitPayload('stats', 'session-start', { players: session.playerTokens() });
        const game = new OnlineGame(this, session, this.socketServer, this.ui, settings);

        session.players.forEach(player => {
            player.session = session;
        });

        session.players.forEach((player, index) => {
            session.registerHandler(index as 0|1, 'disconnect', () => {
                game.handleGameEnd(player.otherPlayerInSession().getIndexInSession(), true);
            });
            session.registerHandler(index as 0|1, 'game', game.handlePlayerMove(player));
        });

        game.playGame();

        this.stats.players[session.players[0].token][session.players[1].token].started = true;
        this.stats.players[session.players[1].token][session.players[0].token].started = true;
        this.sendUpdate();
    }

    endSession(session: Session): void {
        session.terminate();
        session.players.forEach(player => {
            const profile = this.profileByPlayer(player);
            profile.stopPlaying();
        });
        this.stats.players[session.players[0].token][session.players[1].token].finished = true;
        this.stats.players[session.players[1].token][session.players[0].token].finished = true;
        if (session.state && session.stats) {
            this.log('Updating stats between ' + session.players[0].token + ' and ' + session.players[1].token + ' ties: ' + session.state.ties);
            // player 1 stats
            this.stats.players[session.players[0].token][session.players[1].token].state = session.state;
            this.stats.players[session.players[0].token][session.players[1].token].stats = session.stats;
            // invert them for the other player
            const state = session.state;
            state.wins = [state.wins[1], state.wins[0]];
            this.stats.players[session.players[1].token][session.players[0].token].state = session.state;
            this.stats.players[session.players[1].token][session.players[0].token].stats = state.getStats();
        }
        this.flush();
    }

    isFinished(): boolean {
        return this.complete === this.profiles.length;
    }

    private profileByPlayer(player: Player): TournamentProfile {
        return this.profiles.filter(p => p.player.token === player.token)[0];
    }

    private leftToPlay(profile: TournamentProfile): number {
        const result = [];
        for (let other of this.profiles) {
            if (other !== profile && !profile.hasPlayed(other.player) && other.player.alive()) {
                result.push(other.player);
            }
        }
        return result.length;
    }

    private flush(): void {
        for (let profile of this.profiles) {
            if (!profile.isComplete() && !profile.isPlaying()) {

                for (let other of this.profiles) {
                    if (profile.canPlayGivenProfile(other)) {
                        profile.startPlaying(other);
                        other.startPlaying(profile);
                    }
                }

                if (profile.isPlaying()) {
                    const session = new Session([profile.player, profile.currentOpponent().player]);
                    this.startSession(session, this.options);
                } else if (this.leftToPlay(profile) === 0) {
                    profile.markAsComplete();
                    this.complete++;
                    this.playerIsDone(profile);
                }

            }
        }
        this.sendUpdate();
    }

    private sendUpdate() {
        this.socketServer.emitPayload('tournament', 'stats', this.stats);
    }

    private playerIsDone(profile: TournamentProfile) {
        if (this.isFinished()) {
            this.log('Tournament completed');
            this.sendUpdate();
        }
    }

    /**
     * Log a message to the console or the GUI if it's enabled
     * TODO inherit this from a shared parent class
     * @param message
     * @param skipRender only for GUI mode, set to true to avoid rerendering
     */
    private log(message: string, skipRender: boolean = false): void {
        const time = (new Date()).toTimeString().substr(0,5);
        if (this.ui) {
            this.ui.log(message, skipRender);
        } else {
            console.log(time, message);
        }
    }
}