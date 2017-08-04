export default (a, b) => {
  if (!a.toLowerCase || !b.toLowerCase) return a - b;
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
};
