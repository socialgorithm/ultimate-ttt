export interface Stats {
    winner?: number;
    total?: number;
    max?: number;
    avg?: number;
    min?: number;
    winPercentages?: Array<string>;
    tiePercentage?: string;
}
export default class State {
    games: number;
    ties: number;
    wins: Array<number>;
    times: Array<number>;
    timeouts: Array<number>;
    constructor();
    printState(): void;
    getStats(): Stats;
}
