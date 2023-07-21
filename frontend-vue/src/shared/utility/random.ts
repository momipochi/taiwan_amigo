export function randomNumberInRangeInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomNumberInRangeNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
