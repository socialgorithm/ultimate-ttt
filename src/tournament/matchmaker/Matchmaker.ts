import { TournamentStats } from "tournament/stats/TournamentStats";
import Match from "tournament/match/Match";

/**
 * MatchMaker defines a strategy for matching players.
 * 
 * It is responsible to produce new matches until it considers that there is a winner
 * according to the strategy followed.
 */
export default interface Matchmaker {
    isFinished(): Boolean,
    getRemainingMatches(stats: TournamentStats): Match[],
    getRanking(): string[],
}