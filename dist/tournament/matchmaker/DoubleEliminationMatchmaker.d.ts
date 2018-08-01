import Matchmaker from "./Matchmaker";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
import MatchOptions from "../match/MatchOptions";
import DoubleEliminationMatch from "./DoubleEliminationMatch";
export default class DoubleEliminationMatchmaker implements Matchmaker {
    private players;
    private options;
    private sendStats;
    private finished;
    private tournamentStats;
    private processedMatches;
    private playerStats;
    private zeroLossOddPlayer;
    private oneLossOddPlayer;
    private waitingForFinal;
    private unlinkedMatches;
    constructor(players: Player[], options: MatchOptions, sendStats: Function);
    isFinished(): boolean;
    getRemainingMatches(tournamentStats: TournamentStats): DoubleEliminationMatch[];
    private matchPlayers;
    private setParentMatches;
    getRanking(): string[];
}
