export const lerp = (a: number, b: number, t: number) => {
  return a + t * (b - a);
};

export const getState = (a: number, b: number, c: number, d: number) => {
  return a * 8 + b * 4 + c * 2 + d * 1;
};
