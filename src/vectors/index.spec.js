import { v3 } from ".";

describe("vectors", () => {
  describe("cross product", () => {
    it.each([
      [
        [3, -3, 1],
        [4, 9, 2],
        [-15, -2, 39]
      ],
      [
        [3, -3, 1],
        [-12, 12, -4],
        [0, 0, 0]
      ]
    ])("cross product of [%s] and [%s] should be [%s]", (a, b, result) => {
      expect(v3.cross(a, b)).toEqual(result);
    });
  });
  describe("subtract", () => {
    it.each([
      [
        [2, 1],
        [3, -2],
        [-1, 3]
      ],
      [
        [-1, 3],
        [2, 4],
        [-3, -1]
      ]
    ])("subtraction of [%s] and [%s] should be [%s]", (a, b, result) => {
      expect(v3.subtract(a, b)).toEqual(result);
    });
  });
  describe("normalize", () => {
    it.each([
      [
        [3, 1, 2],
        [0.802, 0.267, 0.534]
      ]
    ])("normalization of [%s] should be close to [%s]", (vector, expected) => {
      const normalized = v3.normalize(vector);
      normalized.forEach((e, i) => {
        expect(e).toBeCloseTo(expected[i]);
      });
    });
  });
});
