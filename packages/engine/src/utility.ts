
export const isInteger = (value: number) => {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
}