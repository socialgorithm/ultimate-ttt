import SocketServer from '../server/SocketServer';
import Player from './model/Player';
import {TournamentStats} from "./model/TournamentStats";
import Matchmaker from './matchmaker/Matchmaker';
import Match from './match/Match';
import FreeForAllMatchmaker from './matchmaker/FreeForAllMatchmaker';
import { MatchOptions } from './match/MatchOptions';

/**
 * Tournament Options, these can be modified by the web interface
 * when starting a tournament.
 */
export type TournamentOptions = {
    numberOfGames: number,
    type: string,
    timeout: number,
    autoPlay: boolean
};

/**
 * Represents a tournament within a lobby, when given a matching strategy, it matches players according to that strategy,
 * runs the games between matched players and broadcasts game stats
 */
export class Tournament {
    private player: Player[];
    private stats: TournamentStats = {
        started: false,
        finished: false,
        waiting: false,
        matches: [],
        upcomingMatches: []
    };
    private matchmaker: Matchmaker;

    constructor(private options: TournamentOptions, private socket: SocketServer, public players: Player[], private lobbyToken: string) {
        const matchOptions: MatchOptions = {
            maxGames: this.options.numberOfGames,
            timeout: this.options.timeout,
            autoPlay: this.options.autoPlay
        };
        switch (options.type) {
            case 'FreeForAll':
            default:
                this.matchmaker = new FreeForAllMatchmaker(this.players, matchOptions, this.sendStats);
                break;
        }
    }

    async start() {
        if (!this.stats.started && !this.isFinished()) {
            this.stats.started = true;
            this.playTournament();
        }
    }

    async continue() {
        this.playTournament();
    }

    private async playTournament() {
        this.stats.waiting = false;
        while(!this.matchmaker.isFinished()) {
            if (this.stats.upcomingMatches.length > 0) {
                await this.playMatches(this.stats.upcomingMatches);
                this.stats.matches = this.stats.matches.concat(this.stats.upcomingMatches);
            }

            this.stats.upcomingMatches = this.matchmaker.getRemainingMatches(this.stats);

            if (this.options.autoPlay) {
                this.sendStats();
            } else {
                break;
            }
        }
        if (!this.matchmaker.isFinished()) {
            this.stats.waiting = true;
            this.sendStats();
        } else {
            this.stats.finished = true;
            this.sendStats();
        }
    }

    async playMatches(matches: Match[]) {
        for(let match of matches) {
            await match.playGames();
        }
    }
    
    isFinished(): boolean {
        return this.stats.finished;
    }

    public getStats() {
        return {
            options: this.options,
            started: this.stats.started,
            finished: this.stats.finished,
            matches: this.stats.matches.filter((match: Match) => match && match.stats).map((match: Match) => ({
                stats: match.stats,
                players: match.players.map(player => ({
                    token: player.token,
                })),
            })),
            upcomingMatches: this.stats.upcomingMatches.filter((match: Match) => match && match.stats).map((match: Match) => ({
                stats: match.stats,
                players: match.players.map(player => ({
                    token: player.token,
                })),
            })),
            ranking: this.matchmaker.getRanking(this.stats),
            waiting: this.stats.waiting
        };
    }

    private sendStats = (): void => {
        this.socket.emitInLobby(this.lobbyToken, 'tournament stats', this.getStats());
    };
}