"use client";

interface ChartPoint {
  date: string;
  before: number;
  after: number;
}

interface UncertaintyChartProps {
  data: ChartPoint[];
}

const W = 320;
const H = 140;
const PAD_X = 10;
const PAD_Y = 16;

function toPoints(
  values: number[],
  maxVal: number,
  w: number,
  h: number
): string {
  if (values.length === 0) return "";
  const stepX = values.length > 1 ? (w - PAD_X * 2) / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = PAD_X + i * stepX;
      const y = PAD_Y + ((maxVal - v) / maxVal) * (h - PAD_Y * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

export function UncertaintyChart({ data }: UncertaintyChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-sm text-[var(--text-secondary)]">
        Пока нет данных
      </div>
    );
  }

  const befores = data.map((d) => d.before);
  const afters = data.map((d) => d.after);
  const beforePoints = toPoints(befores, 10, W, H);
  const afterPoints = toPoints(afters, 10, W, H);

  // Labels: first and last date (day.month)
  const fmt = (iso: string) => {
    const [, m, d] = iso.split("-");
    return `${parseInt(d)}.${parseInt(m)}`;
  };

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        aria-label="График неопределённости"
      >
        {/* Grid lines */}
        {[0, 2.5, 5, 7.5, 10].map((v) => {
          const y = PAD_Y + ((10 - v) / 10) * (H - PAD_Y * 2);
          return (
            <line
              key={v}
              x1={PAD_X}
              y1={y}
              x2={W - PAD_X}
              y2={y}
              stroke="var(--bg-elevated, #3f3f46)"
              strokeWidth="1"
            />
          );
        })}

        {/* Before line */}
        {data.length > 1 && (
          <polyline
            points={beforePoints}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.7"
          />
        )}
        {/* After line */}
        {data.length > 1 && (
          <polyline
            points={afterPoints}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Dots */}
        {befores.map((v, i) => {
          const stepX =
            befores.length > 1 ? (W - PAD_X * 2) / (befores.length - 1) : 0;
          const x = PAD_X + i * stepX;
          const y = PAD_Y + ((10 - v) / 10) * (H - PAD_Y * 2);
          return (
            <circle key={`b${i}`} cx={x} cy={y} r="3" fill="#6366f1" opacity="0.8" />
          );
        })}
        {afters.map((v, i) => {
          const stepX =
            afters.length > 1 ? (W - PAD_X * 2) / (afters.length - 1) : 0;
          const x = PAD_X + i * stepX;
          const y = PAD_Y + ((10 - v) / 10) * (H - PAD_Y * 2);
          return (
            <circle key={`a${i}`} cx={x} cy={y} r="3" fill="var(--accent)" />
          );
        })}
      </svg>

      {/* X labels */}
      {data.length >= 2 && (
        <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1 px-[10px]">
          <span>{fmt(data[0].date)}</span>
          <span>{fmt(data[data.length - 1].date)}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-2 text-[10px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[#6366f1] opacity-70 rounded" />
          <span>До</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[var(--accent)] rounded" />
          <span>После</span>
        </div>
      </div>
    </div>
  );
}
