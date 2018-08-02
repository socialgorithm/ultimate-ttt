import Match from "tournament/match/Match";
export declare type TournamentStats = {
    started: boolean;
    finished: boolean;
    waiting: boolean;
    matches: Match[];
};
