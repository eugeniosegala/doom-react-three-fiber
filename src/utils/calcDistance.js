const calcDistance = (p1, p2) => {
  if (!p1 || !p2) {
    return null;
  }
  const a = p2.x - p1.x;
  const b = p2.y - p1.y;
  const c = p2.z - p1.z;

  // Pythagorean theorem: https://en.wikipedia.org/wiki/Pythagorean_theorem
  return Math.sqrt(a * a + b * b + c * c);
};

const closestObject = (arr, val, fallback) => {
  if (!arr.length) {
    return fallback;
  }
  return arr.reduce((a, b) => {
    return Math.abs(b - val) < Math.abs(a - val) ? b : a;
  });
};

export { calcDistance, closestObject };
