import Match from "tournament/match/Match";

/**
 * Statistics for matches played in a tournament
 */
export type TournamentStats = {
    started: boolean,
    finished: boolean,
    waiting: boolean,
    matches: Match[],
}