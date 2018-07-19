import { Options } from '../lib/cli-options';
import SocketServer from '../server/SocketServer';
import Session from './model/Session';
import Player from './model/Player';
import GUI from '../server/GUI';
import {TournamentStats} from "./model/TournamentStats";
import StateImpl from "./model/State";
import Matchmaker from './matchmaker/Matchmaker';
import Match from './match/Match';

export class TournamentOptions {
    private numberOfGames: number;
}

export class TournamentEventsListener {

}

/**
 * Represents a tournament within a lobby, when given a matching strategy, it matches players according to that strategy,
 * runs the games between matched players and broadcasts game stats
 */
export class Tournament {

    private player: Player[];
    private stats: TournamentStats;

    constructor(private options: TournamentOptions, private matchmaker: Matchmaker, private eventsListener: TournamentEventsListener, public players: Player[]) {
        
    }

    start() {
        if (!this.stats.started && !this.isFinished()) {
            this.stats.started = true;
            while(!this.matchmaker.isFinished()) {
                const matches = this.matchmaker.getRemainingMatches(this.stats);
                const playedMatches = this.playMatches(matches)
                this.stats.matches = this.stats.matches.concat(playedMatches)
            }
            this.stats.finished = true
        }
    }

    playMatches(matches: Match[]): Match[] {
        for(let match of matches) {
            match.playGames()
        }
        return matches
    }
    
    isFinished(): boolean {
        return this.stats.finished
    }
}