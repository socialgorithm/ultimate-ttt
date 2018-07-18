import State, {Stats} from "./State";
/**
 * Tournament Stats
 */
export interface SessionInfo {
    started: boolean,
    finished: boolean,
    state: State,
    stats: Stats,
}

export interface TournamentStats {
    started: boolean;
    players: {
        [key: string]: {
            [key: string]: SessionInfo;
        };
    };
}