import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../stats/TournamentStats";
import MatchOptions from "../match/MatchOptions";
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
