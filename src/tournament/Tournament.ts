import SocketServer from "../server/SocketServer";

import { IMove } from "../tournament/match/game/GameStats";
import ITournamentEvents from "../tournament/TournamentEvents";
import Match from "./match/Match";
import { IMatchOptions } from "./match/MatchOptions";
import DoubleEliminationMatchmaker from "./matchmaker/DoubleEliminationMatchmaker";
import FreeForAllMatchmaker from "./matchmaker/FreeForAllMatchmaker";
import IMatchmaker from "./matchmaker/Matchmaker";
import Player from "./model/Player";
import {ITournamentStats} from "./stats/TournamentStats";

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

    constructor(private options: ITournamentOptions, private socket: SocketServer, public players: Player[], private lobbyToken: string) {
        const matchOptions: IMatchOptions = {
            autoPlay: this.options.autoPlay,
            maxGames: this.options.numberOfGames,
            timeout: this.options.timeout,
        };
        const tournamentEventCallbacks: ITournamentEvents = {
            onGameInit: this.onGameInit,
            onGameMove: this.onGameMove,
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
                await this.playMatch(upcomingMatches[0]);
                if (this.options.autoPlay) {
                    this.sendStats();
                } else {
                    break;
                }
            } else {
                this.matchmaker.updateStats(this.stats);
                this.stats.matches.push(...this.matchmaker.getRemainingMatches());
            }
        }
        if (!this.matchmaker.isFinished()) {
            this.stats.waiting = true;
            this.sendStats();
        } else {
            const upcomingMatches = this.stats.matches.filter(match => match.stats.state === "upcoming" || match.stats.state === "playing");
            this.stats.finished = upcomingMatches.length < 1;
            this.sendStats();
        }
    }

    private sendStats = (): void => {
        this.socket.emitToLobbyInfo(this.lobbyToken, "tournament stats", this.getStats());
    }

    private onGameInit = (): void => {
        this.socket.emitToLobbyInfo(this.lobbyToken, "tournament game init", []);
    }

    private onGameMove = (move: IMove): void => {
        this.socket.emitToLobbyInfo(this.lobbyToken, "tournament game move", move);
    }
}
