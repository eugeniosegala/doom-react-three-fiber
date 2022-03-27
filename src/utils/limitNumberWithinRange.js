const limitNumberWithinRange = (num, min, max) => {
  const MIN = min;
  const MAX = max;
  return Math.min(Math.max(num, MIN), MAX);
};

export default limitNumberWithinRange;
