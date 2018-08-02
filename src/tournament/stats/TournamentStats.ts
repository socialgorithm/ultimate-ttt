import Match from "tournament/match/Match";

/**
 * Statistics for matches played in a tournament
 */
export interface ITournamentStats {
    started: boolean;
    finished: boolean;
    waiting: boolean;
    matches: Match[];
}
