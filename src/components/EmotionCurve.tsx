import { useId } from 'react';
import type { EmotionPoint } from '@/lib/types';

interface EmotionCurveProps {
  data: EmotionPoint[];
}

export default function EmotionCurve({ data }: EmotionCurveProps) {
  const gradientId = useId();
  const W = 260;
  const H = 72;
  const PAD = 12; // padding for points near edges

  if (!data || data.length < 2) return null;

  const xs = data.map(
    (_, i) => PAD + (i / (data.length - 1)) * (W - 2 * PAD)
  );
  const ys = data.map((p) => H - PAD - ((p.value / 100) * (H - 2 * PAD)));

  const pointsStr = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const areaStr = `${xs[0]},${H - PAD} ${pointsStr} ${xs[xs.length - 1]},${H - PAD}`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="情感曲线"
      >
        {/* Baseline grid */}
        {[25, 50, 75].map((v) => {
          const y = H - PAD - ((v / 100) * (H - 2 * PAD));
          return (
            <line
              key={v}
              x1={PAD}
              y1={y}
              x2={W - PAD}
              y2={y}
              stroke="white"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <polygon
          points={areaStr}
          fill={`url(#${gradientId})`}
          opacity="0.15"
        />

        {/* Gradient def */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Line */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {xs.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={ys[i]}
            r="3"
            fill="#c7d2fe"
            stroke="#818cf8"
            strokeWidth="1"
          />
        ))}

        {/* Year labels */}
        {data.map((p, i) => (
          <text
            key={i}
            x={xs[i]}
            y={H - 2}
            textAnchor="middle"
            fill="white"
            fillOpacity="0.35"
            fontSize="8"
            fontFamily="system-ui"
          >
            {p.year}
          </text>
        ))}
      </svg>
    </div>
  );
}
