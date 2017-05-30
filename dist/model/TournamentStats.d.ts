import { Stats } from "../lib/State";
export interface SessionInfo {
    started: boolean;
    finished: boolean;
    stats: Stats;
}
export interface TournamentStats {
    started: boolean;
    players: {
        [key: string]: {
            [key: string]: SessionInfo;
        };
    };
}
