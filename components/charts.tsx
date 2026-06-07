"use client";

// Small, dependency-free SVG charts so the dashboard reads like a real
// analytics backend. Deliberately lightweight, no chart library.

export function AreaChart({
  data,
  labels,
  color = "#9a7b4f",
  height = 150,
  /** Optional projected next point (e.g. the new value after an attempt). */
  projected,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  projected?: number | null;
}) {
  const width = 460;
  const padX = 8;
  const padY = 14;
  const series = projected != null ? [...data, projected] : data;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const x = (i: number) =>
    padX + (i * (width - padX * 2)) / Math.max(series.length - 1, 1);
  const y = (v: number) =>
    padY + (height - padY * 2) * (1 - (v - min) / span);

  const linePts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaPts = `${padX},${height - padY} ${linePts} ${x(
    data.length - 1,
  )},${height - padY}`;

  const lastReal = data.length - 1;

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend chart"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={padX}
          x2={width - padX}
          y1={padY + (height - padY * 2) * g}
          y2={padY + (height - padY * 2) * g}
          stroke="#e3ded3"
          strokeWidth="1"
        />
      ))}

      <polygon points={areaPts} fill="url(#areaFill)" />
      <polyline
        points={linePts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* projected segment (dashed) + point */}
      {projected != null ? (
        <>
          <line
            x1={x(lastReal)}
            y1={y(data[lastReal])}
            x2={x(lastReal + 1)}
            y2={y(projected)}
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx={x(lastReal + 1)} cy={y(projected)} r="5" fill={color} />
        </>
      ) : null}

      {/* last real point */}
      <circle cx={x(lastReal)} cy={y(data[lastReal])} r="4" fill={color} />

      {labels
        ? labels.map((l, i) => (
            <text
              key={i}
              x={x(i)}
              y={height - 2}
              textAnchor="middle"
              fontSize="9"
              fill="#9a948a"
            >
              {l}
            </text>
          ))
        : null}
    </svg>
  );
}

export function Sparkline({
  data,
  color = "#9a7b4f",
}: {
  data: number[];
  color?: string;
}) {
  const w = 90;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const denom = Math.max(data.length - 1, 1);
  const pts = data
    .map(
      (v, i) =>
        `${(i * w) / denom},${h - 2 - (h - 4) * ((v - min) / span)}`,
    )
    .join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Donut({
  segments,
  size = 132,
}: {
  segments: { name: string; share: number; color: string }[];
  size?: number;
}) {
  const r = size / 2 - 12;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#eee7da" strokeWidth="14" />
      {segments.map((s) => {
        const len = (s.share / 100) * circ;
        const el = (
          <circle
            key={s.name}
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${c} ${c})`}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}
