import { IGameStats } from "../../tournament/match/game/GameStats";
export interface IStats {
    winner?: number;
    total?: number;
    max?: number;
    avg?: number;
    min?: number;
    winPercentages?: string[];
    tiePercentage?: string;
}
export default class State {
    games: IGameStats[];
    gamesCompleted: number;
    gamesTied: number;
    wins: number[];
    times: number[];
    timeouts: number[];
    state: "playing" | "finished" | "upcoming";
    winner: number;
    constructor();
    printState(): void;
    getStats(): IStats;
}
