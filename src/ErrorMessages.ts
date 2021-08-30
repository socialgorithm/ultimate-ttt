/**
 * Error definitions
 */
export default {
  board: {
    code: 4,
    message: "Invalid next board (%s), it must be the same as the last valid move\'s coordinates",
  },
  boardFinished: {
    code: 5,
    message: "Board already finished",
  },
  gameFinished: {
    code: 6,
    message: "Game already finished",
  },
  gameNotFinished: {
    code: 7,
    message: "Game not finished",
  },
  move: {
    code: 2,
    message: "Invalid move coordinates (%s)",
  },
  player: {
    code: 1,
    message: "Invalid player (%s), it must be either 0 or 1",
  },
};
