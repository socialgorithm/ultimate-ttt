import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
import MatchOptions from "../match/MatchOptions";
export default class FreeForAllMatchmaker implements Matchmaker {
    private players;
    private options;
    private maxMatches;
    private finished;
    constructor(players: Player[], options: MatchOptions);
    isFinished(): boolean;
    getRemainingMatches(tournamentId: string, tournamentStats: TournamentStats): Match[];
    getRanking(stats: TournamentStats): string[];
}
