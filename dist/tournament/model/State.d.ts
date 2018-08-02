import Game from "tournament/match/game/Game";
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
    games: Game[];
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
