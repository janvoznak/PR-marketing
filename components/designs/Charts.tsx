export type Series = { name: string; color: string; values: number[] };

/** Skládaný plošný graf. */
export function AreaChart({ series, height = 190 }: { series: Series[]; height?: number }) {
  const W = 600;
  const H = 180;
  const n = series[0].values.length;
  const totals = series[0].values.map((_, i) => series.reduce((a, s) => a + s.values[i], 0));
  const max = Math.max(...totals) * 1.15;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const cum = series.map(() => new Array<number>(n).fill(0));
  series.forEach((s, si) => s.values.forEach((v, i) => (cum[si][i] = (si ? cum[si - 1][i] : 0) + v)));

  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full" style={{ height }} preserveAspectRatio="none" role="img" aria-label="Poptávky za 30 dní">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#e5e7eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {[...series].reverse().map((s, ri) => {
        const si = series.length - 1 - ri;
        const top = cum[si].map((v, i) => `${x(i)},${y(v)}`).join(" L");
        const bottom = (si ? cum[si - 1] : cum[si].map(() => 0))
          .map((v, i) => `${x(i)},${y(v)}`)
          .reverse()
          .join(" L");
        return <path key={s.name} d={`M${top} L${bottom} Z`} fill={s.color} />;
      })}
    </svg>
  );
}

export function Legend({ items }: { items: { name: string; color: string; value?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-gray-600">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: i.color }} />
          {i.name}
          {i.value && <b className="text-gray-900">{i.value}</b>}
        </li>
      ))}
    </ul>
  );
}

export function Donut({ parts, size = 150, label, sub }: { parts: { color: string; value: number }[]; size?: number; label: string; sub: string }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" className="-rotate-90" width={size} height={size}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {parts.map((p, i) => {
          const len = (p.value / total) * c;
          const el = <circle key={i} cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="18" strokeDasharray={`${len - 2} ${c - len + 2}`} strokeDashoffset={-off} />;
          off += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-bold leading-none text-gray-900">{label}</div>
          <div className="mt-1 text-[11px] text-gray-500">{sub}</div>
        </div>
      </div>
    </div>
  );
}

export function Spark({ values, color = "#0b4fc4" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
