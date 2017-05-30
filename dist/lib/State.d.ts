export interface Stats {
    winner?: number;
    total?: number;
    max?: number;
    avg?: number;
    min?: number;
    winPercentages?: Array<string>;
    tiePercentage?: string;
}
export interface State {
    games: number;
    ties: number;
    wins: Array<number>;
    times: Array<number>;
    timeouts: Array<number>;
}
export default class StateImpl implements State {
    games: number;
    ties: number;
    wins: Array<number>;
    times: Array<number>;
    timeouts: Array<number>;
    constructor();
    toJSON(): State;
    printState(): void;
    getStats(): Stats;
}
