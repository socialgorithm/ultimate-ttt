import Match from "../match/Match";
export interface TournamentStats {
    started: boolean;
    finished: boolean;
    matches: Match[];
}
