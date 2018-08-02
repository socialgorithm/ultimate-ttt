import Match from "../../tournament/match/Match";
import { ITournamentStats } from "../../tournament/stats/TournamentStats";
export default interface IMatchmaker {
    isFinished(): boolean;
    getRemainingMatches(stats: ITournamentStats): Match[];
    getRanking(): string[];
}
