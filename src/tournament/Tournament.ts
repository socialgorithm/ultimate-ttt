import { IMove } from "../tournament/match/game/GameStats";
import ITournamentEvents from "../tournament/TournamentEvents";
import Match from "./match/Match";
import { IMatchOptions } from "./match/MatchOptions";
import DoubleEliminationMatchmaker from "./matchmaker/DoubleEliminationMatchmaker";
import FreeForAllMatchmaker from "./matchmaker/FreeForAllMatchmaker";
import IMatchmaker from "./matchmaker/Matchmaker";
import Player from "./model/Player";
import {ITournamentStats} from "./stats/TournamentStats";
import DetailedMatchStats from "../tournament/match/DetailedMatchStats";

/**
 * Tournament Options, these can be modified by the web interface
 * when starting a tournament.
 */
export interface ITournamentOptions {
    numberOfGames: number;
    type: string;
    timeout: number;
    autoPlay: boolean;
}

/**
 * Represents a tournament within a lobby, when given a matching strategy, it matches players according to that strategy,
 * runs the games between matched players and broadcasts game stats
 */
export class Tournament {
    private player: Player[];
    private stats: ITournamentStats = {
        finished: false,
        matches: [],
        started: false,
        waiting: false,
    };
    private matchmaker: IMatchmaker;

    constructor(private options: ITournamentOptions, public players: Player[], private lobbyToken: string) {
        const matchOptions: IMatchOptions = {
            autoPlay: this.options.autoPlay,
            maxGames: this.options.numberOfGames,
            timeout: this.options.timeout,
        };
        const tournamentEventCallbacks: ITournamentEvents = {
            onMatchEnd: this.onMatchEnd,
            sendStats: this.sendStats,
        };
        switch (options.type) {
            case "DoubleElimination":
                this.matchmaker = new DoubleEliminationMatchmaker(this.players, matchOptions, tournamentEventCallbacks);
                break;
            case "FreeForAll":
            default:
                this.matchmaker = new FreeForAllMatchmaker(this.players, matchOptions, tournamentEventCallbacks);
                break;
        }
    }

    public async start() {
        if (!this.stats.started && !this.isFinished()) {
            this.stats.started = true;
            this.playTournament();
        }
    }

    public async continue() {
        this.playTournament();
    }

    public async playMatches(matches: Match[]) {
        for (const match of matches) {
            await match.playGames();
        }
    }

    public isFinished(): boolean {
        return this.stats.finished;
    }

    public getStats() {
        this.matchmaker.updateStats(this.stats);
        return {
            finished: this.stats.finished,
            matches: this.stats.matches.filter((match: Match) => match && match.stats).map((match: Match) => match.getStats()),
            options: this.options,
            ranking: this.matchmaker.getRanking(),
            started: this.stats.started,
            waiting: this.stats.waiting,
        };
    }

    private async playMatch(match: Match) {
        await match.playGames();
    }

    private async playTournament() {
        this.stats.waiting = false;
        while (!this.matchmaker.isFinished()) {
            const upcomingMatches = this.stats.matches.filter(match => match.stats.state === "upcoming");
            if (upcomingMatches.length > 0) {
                const nextMatch = upcomingMatches[0];
                await this.playMatch(nextMatch);
                this.onMatchEnd(nextMatch.getDetailedStats());
                this.updateStats();
                if (!this.options.autoPlay) {
                    break;
                }
            } else {
                this.stats.matches.push(...this.matchmaker.getRemainingMatches());
            }
            this.updateStats();
        }
    }

    private updateStats() {
        this.matchmaker.updateStats(this.stats);
        if (this.matchmaker.isFinished()) {
            this.stats.finished = true;
            this.stats.waiting = false;
            this.sendStats();
        } else {
            this.stats.waiting = true;
            this.sendStats();
        }
    }

    private sendStats = (): void => {
        PubSub.publish('tournament start', this.getStats());
    }

    private onMatchEnd = (detailedMatchStats: DetailedMatchStats): void => {
        PubSub.publish('tournament match end', detailedMatchStats);
    }
}
