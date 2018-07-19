import Match from "../match/Match";

/**
 * Statistics for matches played in a tournament
 */
export interface TournamentStats {
    started: boolean;
    finished: boolean;
    matches: Match[]
}