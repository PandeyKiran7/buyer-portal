export function todayYmdLocal(): string {
  const d = new Date();
  return dateToYmd(d);
}

function dateToYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseYmdStrict(s: string): { y: number; m: number; d: number } | null {
  const t = s.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const y = Number(t.slice(0, 4));
  const m = Number(t.slice(5, 7));
  const d = Number(t.slice(8, 10));
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return { y, m, d };
}

export function addDaysYmd(ymd: string, days: number): string | null {
  const p = parseYmdStrict(ymd);
  if (!p) return null;
  const dt = new Date(p.y, p.m - 1, p.d);
  dt.setDate(dt.getDate() + days);
  return dateToYmd(dt);
}

export function nightsBetweenYmd(checkIn: string, checkOut: string): number {
  const a = parseYmdStrict(checkIn);
  const b = parseYmdStrict(checkOut);
  if (!a || !b) return 0;
  const t0 = new Date(a.y, a.m - 1, a.d).getTime();
  const t1 = new Date(b.y, b.m - 1, b.d).getTime();
  const n = Math.round((t1 - t0) / 86400000);
  return n > 0 ? n : 0;
}

export function clampYmdToRange(ymd: string, minYmd: string, maxYmd: string): string {
  const p = parseYmdStrict(ymd);
  if (!p) return "";
  if (ymd < minYmd) return minYmd;
  if (ymd > maxYmd) return maxYmd;
  return ymd;
}
