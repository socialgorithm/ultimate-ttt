import Player from "tournament/model/Player";
import MatchOptions from "tournament/match/MatchOptions";
import { TournamentStats } from "tournament/stats/TournamentStats";
import Matchmaker from "./Matchmaker";
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
    private createMatch;
    private playerIsWaitingForMatch;
    private anyPlayersWaiting;
    private setParentMatches;
    getRanking(): string[];
}
