import { Options } from '../lib/cli-options';
import SocketServer from '../server/SocketServer';
import Session from './model/Session';
import Player from './model/Player';
import GUI from '../server/GUI';
import {TournamentStats} from "./model/TournamentStats";
import StateImpl from "./model/State";
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
};

/**
 * Represents a tournament within a lobby, when given a matching strategy, it matches players according to that strategy,
 * runs the games between matched players and broadcasts game stats
 */
export class Tournament {

    private player: Player[];
    private stats: TournamentStats;
    private matchmaker: Matchmaker;

    constructor(private options: TournamentOptions, private socket: SocketServer, public players: Player[]) {
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
    }

    start() {
        if (!this.stats.started && !this.isFinished()) {
            this.stats.started = true;
            while(!this.matchmaker.isFinished()) {
                const matches = this.matchmaker.getRemainingMatches(this.stats);
                const playedMatches = this.playMatches(matches)
                this.stats.matches = this.stats.matches.concat(playedMatches)
            }
            this.stats.finished = true;
        }
    }

    playMatches(matches: Match[]): Match[] {
        for(let match of matches) {
            match.playGames();
        }
        return matches;
    }
    
    isFinished(): boolean {
        return this.stats.finished
    }
}