export interface UIGame {
    playerA: string;
    playerB: string;
    winner: number;
    result: number;
}
export interface Round {
    games: Array<UIGame>;
}
