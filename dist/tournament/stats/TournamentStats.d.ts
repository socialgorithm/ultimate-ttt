import Match from "../../tournament/match/Match";
export interface ITournamentStats {
    started: boolean;
    finished: boolean;
    waiting: boolean;
    matches: Match[];
}
