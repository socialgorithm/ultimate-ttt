import Game from 'tournament/match/game/Game';
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
    games: Game[];
    gamesCompleted: number;
    gamesTied: number;
    wins: Array<number>;
    times: Array<number>;
    timeouts: Array<number>;
    state: 'playing' | 'finished' | 'upcoming';
    winner: number;
    constructor();
    toJSON(): {
        games: Game[];
        gamesCompleted: number;
        gamesTied: number;
        wins: number[];
        times: number[];
        timeouts: number[];
        state: "playing" | "finished" | "upcoming";
        winner: number;
    };
    printState(): void;
    getStats(): Stats;
}
