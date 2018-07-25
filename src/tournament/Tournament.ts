import * as uuid from 'uuid/v4';

import SocketServer from '../server/SocketServer';
import Player from './model/Player';
import {TournamentStats} from "./model/TournamentStats";
import Matchmaker from './matchmaker/Matchmaker';
import Match from './match/Match';
import FreeForAllMatchmaker from './matchmaker/FreeForAllMatchmaker';
import { MatchOptions } from './match/MatchOptions';
import PubSubber from './model/Subscriber';
import { MATCH_END } from '../events';

/**
 * Tournament Options, these can be modified by the web interface
 * when starting a tournament.
 */
export type TournamentOptions = {
    numberOfGames: number,
    type: string,
    timeout: number,
};

/**
 * Represents a tournament within a lobby, when given a matching strategy, it matches players according to that strategy,
 * runs the games between matched players and broadcasts game stats
 */
export class Tournament extends PubSubber {
    private player: Player[];
    private stats: TournamentStats = {
        started: false,
        finished: false,
        matches: [],
    };
    private matchmaker: Matchmaker;
    private tournamentID: string;

    constructor(private options: TournamentOptions, private socket: SocketServer, public players: Player[], private lobbyToken: string) {
        super();
        this.tournamentID = uuid();
        const matchOptions: MatchOptions = {
            maxGames: this.options.numberOfGames,
            timeout: this.options.timeout,
        };
        switch (options.type) {
            case 'FreeForAll':
            default:
                this.matchmaker = new FreeForAllMatchmaker(this.players, matchOptions);
                break;
        }

        this.subscribeNamespaced(this.tournamentID, MATCH_END, this.playNextMatch);
    }

    public start() {
        this.stats.started = true;
        this.playNextMatches();
    }

    private playNextMatch() {
        const nextMatch = this.stats.matches.find(match => match.stats.state === 'upcoming');
        if (!nextMatch) {
            return this.onAllMatchesEnd();
        }
        nextMatch.start();
    }

    private playNextMatches() {
        const matches = this.matchmaker.getRemainingMatches(this.tournamentID, this.stats);
        if (matches.length < 1) {
            // potential bug in the matchmaker (no more matches, yet not finished)
            return this.onTournamentEnd();
        }
        this.stats.matches = this.stats.matches.concat(matches);
        this.playNextMatch();
    }

    private onAllMatchesEnd() {
        if (this.matchmaker.isFinished()) {
            return this.onTournamentEnd();
        }
        this.playNextMatches();
    }

    private onTournamentEnd() {
        this.stats.finished = true;
        this.unsubscribeAll();
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
            ranking: this.matchmaker.getRanking(this.stats),
        };
    }

    // private sendStats = (): void => {
    //     this.socket.emitInLobby(this.lobbyToken, 'tournament stats', this.getStats());
    // }
}