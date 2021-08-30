/**
 * Constant to represent an unplayed cell
 * @type {number}
 */
export const UNPLAYED: PlayerOrTie = undefined;

/**
 * Constant to represent player 1
 * @type {number}
 */
export const ME = 0;

/**
 * Constant to represent player 2
 * @type {number}
 */
export const OPPONENT = 1;

/**
 * Constant to represent a tie
 * @type {number}
 */
export const RESULT_TIE = -1;

/**
 * Constant to represent player 1 winning
 * @type {number}
 */
export const RESULT_WIN = 0;

/**
 * Constant to represent player 2 winning
 * @type {number}
 */
export const RESULT_LOSE = 1;

/**
 * Coordinate in the form [x, y]
 */
export type Coord = [number, number];

/**
 * Coordinates for moves on the big board
 */
export interface Coords {
    board: Coord;
    move: Coord
}

/**
 * Represent a player value (0 || 1)
 */
export type PlayerNumber = 0 | 1;

/**
 * Store a player or a tie
 */
export type PlayerOrTie = -1 | PlayerNumber;