import { describe, expect, it } from 'vitest';
import { getState, lerp } from '../utils/math';

describe('getState', () => {
  it.each([
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 8],
    [0, 1, 0, 0, 4],
    [0, 0, 1, 0, 2],
    [0, 0, 0, 1, 1],
    [1, 1, 0, 0, 12],
    [1, 0, 1, 0, 10],
    [1, 0, 0, 1, 9],
  ])(
    'should return good state for (%d, %d, %d, %d)',
    (v1, v2, v3, v4, expected) => {
      expect(getState(v1, v2, v3, v4)).toBe(expected);
    }
  );
});

describe('lerp', () => {
  it('should interpolate correctly between two values', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });
});
