import { TournamentStats } from "tournament/stats/TournamentStats";
import Match from "tournament/match/Match";
export default interface Matchmaker {
    isFinished(): Boolean;
    getRemainingMatches(stats: TournamentStats): Match[];
    getRanking(): string[];
}
