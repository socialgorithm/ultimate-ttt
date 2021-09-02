export declare const UNPLAYED: PlayerOrTie;
export declare const ME = 0;
export declare const OPPONENT = 1;
export declare const RESULT_TIE = -1;
export declare const RESULT_WIN = 0;
export declare const RESULT_LOSE = 1;
export declare type Coord = [number, number];
export interface Coords {
    board: Coord;
    move: Coord;
}
export declare type PlayerNumber = 0 | 1;
export declare type PlayerOrTie = -1 | PlayerNumber;
