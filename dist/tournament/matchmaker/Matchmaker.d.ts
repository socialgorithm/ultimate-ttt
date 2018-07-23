import { TournamentStats } from "../model/TournamentStats";
import Match from "../match/Match";
export default interface Matchmaker {
    isFinished(): Boolean;
    getRemainingMatches(stats: TournamentStats): Match[];
    getRanking(stats: TournamentStats): string[];
}
