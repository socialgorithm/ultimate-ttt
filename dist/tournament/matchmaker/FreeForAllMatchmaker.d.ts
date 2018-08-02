import Match from "tournament/match/Match";
import IMatchOptions from "tournament/match/MatchOptions";
import Player from "tournament/model/Player";
import { ITournamentStats } from "tournament/stats/TournamentStats";
import IMatchmaker from "./Matchmaker";
export default class FreeForAllMatchmaker implements IMatchmaker {
    private players;
    private options;
    private sendStats;
    private maxMatches;
    private finished;
    private stats;
    private index;
    constructor(players: Player[], options: IMatchOptions, sendStats: () => void);
    isFinished(): boolean;
    getRemainingMatches(tournamentStats: ITournamentStats): Match[];
    getRanking(): string[];
}
