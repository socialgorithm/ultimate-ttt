import Match from "../../tournament/match/Match";
import { ITournamentStats } from "../../tournament/stats/TournamentStats";
export default interface IMatchmaker {
    isFinished(): boolean;
    updateStats(stats: ITournamentStats): void;
    getRemainingMatches(): Match[];
    getRanking(): string[];
}
