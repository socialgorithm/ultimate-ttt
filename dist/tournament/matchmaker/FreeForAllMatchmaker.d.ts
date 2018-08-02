import Match from "tournament/match/Match";
import Player from "tournament/model/Player";
import { TournamentStats } from "tournament/stats/TournamentStats";
import MatchOptions from "tournament/match/MatchOptions";
import Matchmaker from "./Matchmaker";
export default class FreeForAllMatchmaker implements Matchmaker {
    private players;
    private options;
    private sendStats;
    private maxMatches;
    private finished;
    private stats;
    private index;
    constructor(players: Player[], options: MatchOptions, sendStats: Function);
    isFinished(): boolean;
    getRemainingMatches(tournamentStats: TournamentStats): Match[];
    getRanking(): string[];
}
