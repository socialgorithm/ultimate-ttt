/**
 * Round a number to the nearest integer and return an int
 * @param time Float number
 * @returns {number} Int
 */
export function round(time: number): number {
  return Math.round(time * 100) / 100;
}

/**
 * Convert execution time to milliseconds
 * @param nanosecs Execution time in nanoseconds
 * @returns {number} Exec time in ms
 */
export function convertExecTime(nanosecs: number): number {
  return round(nanosecs/1000000);
}

/**
 * Convert a float 0-1 to a percentage string 0-100%
 * @param num Partial number
 * @param total Total number
 * @returns {string} Percentage string
 */
export function getPercentage(num: number, total: number): string {
  if(total < 1){
    return '0%';
  }
  return Math.floor(num * 100 / total) + '%';
}