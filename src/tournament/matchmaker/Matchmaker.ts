import Match from "tournament/match/Match";
import { ITournamentStats } from "tournament/stats/TournamentStats";

/**
 * MatchMaker defines a strategy for matching players.
 *
 * It is responsible to produce new matches until it considers that there is a winner
 * according to the strategy followed.
 */
export default interface IMatchmaker {
    isFinished(): boolean;
    getRemainingMatches(stats: ITournamentStats): Match[];
    getRanking(): string[];
}
