export const v3 = {
  cross: (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],
  subtract: (a, b) => a.map((elem, i) => elem - b[i]),
  normalize: v => {
    const length = Math.sqrt(v.reduce(reduceSumElementsSquared, 0));
    return length == 0 ? [0, 0, 0] : v.map(elem => elem / length);
  }
};

const reduceSumElementsSquared = (sum, element) => (sum += element * element);
