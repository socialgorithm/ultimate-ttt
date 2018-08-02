import Match from "../../tournament/match/Match";
import IMatchOptions from "../../tournament/match/MatchOptions";
import Player from "../../tournament/model/Player";
import { ITournamentStats } from "../../tournament/stats/TournamentStats";
import IMatchmaker from "./Matchmaker";
import TournamentEvents from "../../tournament/TournamentEvents";
export default class FreeForAllMatchmaker implements IMatchmaker {
    private players;
    private options;
    private events;
    private maxMatches;
    private finished;
    private stats;
    private index;
    constructor(players: Player[], options: IMatchOptions, events: TournamentEvents);
    isFinished(): boolean;
    getRemainingMatches(tournamentStats: ITournamentStats): Match[];
    getRanking(): string[];
}
