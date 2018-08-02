import Match from "../../tournament/match/Match";
import IMatchOptions from "../../tournament/match/MatchOptions";
import Player from "../../tournament/model/Player";
import { ITournamentStats } from "../../tournament/stats/TournamentStats";
import ITournamentEvents from "../../tournament/TournamentEvents";
import IMatchmaker from "./Matchmaker";
export default class FreeForAllMatchmaker implements IMatchmaker {
    private players;
    private options;
    private events;
    private maxMatches;
    private finished;
    private tournamentStats;
    private index;
    constructor(players: Player[], options: IMatchOptions, events: ITournamentEvents);
    isFinished(): boolean;
    updateStats(tournamentStats: ITournamentStats): void;
    getRemainingMatches(): Match[];
    getRanking(): string[];
}
