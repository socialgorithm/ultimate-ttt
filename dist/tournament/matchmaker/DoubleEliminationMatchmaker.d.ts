import Matchmaker from "./Matchmaker";
import Match from "../match/Match";
import Player from "../model/Player";
import { TournamentStats } from "../model/TournamentStats";
import MatchOptions from "../match/MatchOptions";
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
    constructor(players: Player[], options: MatchOptions, sendStats: Function);
    isFinished(): boolean;
    getRemainingMatches(tournamentStats: TournamentStats): Match[];
    private matchPlayers;
    getRanking(): string[];
}
