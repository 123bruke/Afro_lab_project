import React from 'react';

interface LinePoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface AnalyticsChartProps {
  title: string;
  subtitle: string;
  type: 'line' | 'comparison-bar' | 'stacked-growth';
  data: LinePoint[];
  unit?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  subtitle,
  type,
  data,
  unit = '%',
  primaryLabel,
  secondaryLabel,
}) => {
  const maxVal = Math.max(
    100,
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0))
  );

  return (
    <div className="border border-zinc-800 bg-zinc-900/40 rounded-md p-4 flex flex-col justify-between">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs font-semibold text-zinc-200">{title}</h3>
          <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{subtitle}</p>
        </div>

        {(primaryLabel || secondaryLabel) && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            {primaryLabel && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-sky-400" aria-hidden="true" />
                <span>{primaryLabel}</span>
              </span>
            )}
            {secondaryLabel && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-emerald-400" aria-hidden="true" />
                <span>{secondaryLabel}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {type === 'line' && (
        <div className="w-full">
          <svg
            viewBox="0 0 480 140"
            className="w-full h-36 overflow-visible"
            role="img"
            aria-label={title}
          >
            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = 120 - ratio * 100;
              return (
                <g key={idx}>
                  <line
                    x1={28}
                    y1={y}
                    x2={468}
                    y2={y}
                    stroke="#27272a"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <text
                    x={0}
                    y={y + 3}
                    fill="#71717a"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {Math.round(ratio * maxVal)}
                    {unit}
                  </text>
                </g>
              );
            })}

            {/* Polyline path */}
            {(() => {
              const stepX = (468 - 36) / Math.max(1, data.length - 1);
              const points = data.map((d, i) => {
                const x = 36 + i * stepX;
                const y = 120 - (d.value / maxVal) * 100;
                return `${x},${y}`;
              });
              const areaPoints = `36,120 ${points.join(' ')} ${
                36 + (data.length - 1) * stepX
              },120`;

              return (
                <>
                  <polygon points={areaPoints} fill="rgba(56, 189, 248, 0.08)" />
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.75"
                    points={points.join(' ')}
                  />
                  {data.map((d, i) => {
                    const x = 36 + i * stepX;
                    const y = 120 - (d.value / maxVal) * 100;
                    return (
                      <g key={d.label}>
                        <circle cx={x} cy={y} r="3" fill="#38bdf8" />
                        <text
                          x={x}
                          y={135}
                          textAnchor="middle"
                          fill="#a1a1aa"
                          fontSize="9"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {d.label}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      )}

      {type === 'comparison-bar' && (
        <div className="space-y-2.5">
          {data.map((item) => {
            const pct1 = Math.round((item.value / maxVal) * 100);
            const pct2 = Math.round(((item.secondaryValue || 0) / maxVal) * 100);
            return (
              <div key={item.label} className="text-xs font-mono tabular-nums">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span className="text-zinc-300">{item.label}</span>
                  <span>
                    Retrieved: {item.value}
                    {unit} · Compressed: {item.secondaryValue}
                    {unit}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-zinc-800 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-sky-400/80 origin-left"
                      style={{ width: `${pct1}%` }}
                    />
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-emerald-400/90 origin-left"
                      style={{ width: `${pct2}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'stacked-growth' && (
        <div className="grid grid-cols-8 gap-2 items-end h-36 pt-4">
          {data.map((d) => {
            const total = d.value + (d.secondaryValue || 0);
            const totalHeightPct = Math.max(12, Math.round((total / maxVal) * 100));
            const primaryShare = Math.round((d.value / Math.max(1, total)) * 100);

            return (
              <div
                key={d.label}
                className="flex flex-col items-center justify-end h-full gap-1.5"
              >
                <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
                  {total}
                </span>
                <div
                  className="w-full max-w-[28px] bg-zinc-800 rounded-xs overflow-hidden flex flex-col justify-end"
                  style={{ height: `${totalHeightPct}%` }}
                >
                  <div
                    className="w-full bg-sky-400"
                    style={{ height: `${100 - primaryShare}%` }}
                  />
                  <div
                    className="w-full bg-emerald-400"
                    style={{ height: `${primaryShare}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
