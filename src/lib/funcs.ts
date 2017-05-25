/**
 * Round a number to the nearest integer and return an int
 * @param time Float number
 * @returns {number} Int
 */
export const round = (time: number): number => {
  return Math.round(time * 100) / 100;
};

/**
 * Convert execution time to milliseconds
 * @param nanosecs Execution time in nanoseconds
 * @returns {number} Exec time in ms
 */
export const convertExecTime = (nanosecs: number): number => {
  return round(nanosecs/1000000);
};

/**
 * Convert a float 0-1 to a percentage string 0-100%
 * @param num Partial number
 * @param total Total number
 * @returns {string} Percentage string
 */
export const getPercentage = (num: number, total: number): string => {
  if(total < 1){
    return '0%';
  }
  return Math.floor(num * 100 / total) + '%';
};

export const winner = (board: number[][]) => {
  let count = 0;
  for (let i=0;i<3;++i) for(let j=0;j<3;++j) if(board[i][j] > -1 || board[i][j] < -1) ++count;
  if (count == 9) return -2;
  for (let i=0; i<3; ++i) {
    const r = board[i][0] == board[i][1] && board[i][1] == board[i][2];
    if (r) return board[i][0];
    const c = board[0][i] == board[1][i] && board[1][i] == board[2][i];
    if (c) return board[0][i];
  }
  if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) return board[0][0];
  if (board[2][0] == board[1][1] && board[1][1] == board[0][2]) return board[0][0];
  return -1;
}