export function scoreResult(primary: string, query: string): number {
  const p = primary.toLowerCase();
  const q = query.toLowerCase().trim();
  if (p === q) return 3;
  if (p.startsWith(q)) return 2;
  if (p.includes(q)) return 1;
  return 0;
}
