import { TournamentStats } from "../stats/TournamentStats";
import Match from "../match/Match";
export default interface Matchmaker {
    isFinished(): Boolean;
    getRemainingMatches(stats: TournamentStats): Match[];
    getRanking(): string[];
}
