import React, { useMemo } from 'react';

export default function SpeedChart({ data }) {
  // data: array of { timestamp, pred_speed, actual_speed }
  const { pointsPred, pointsActual } = useMemo(() => {
    const maxLen = 40;
    const d = data.slice(-maxLen);
    // compute min/max speeds for scaling
    let minV = Infinity;
    let maxV = -Infinity;
    d.forEach((p) => {
      [p.pred_speed, p.actual_speed].forEach((v) => {
        if (typeof v === 'number') {
          minV = Math.min(minV, v);
          maxV = Math.max(maxV, v);
        }
      });
    });
    if (!isFinite(minV) || !isFinite(maxV)) {
      minV = 0;
      maxV = 100;
    }
    if (maxV === minV) maxV = minV + 1;

    const width = 600;
    const height = 220;
    const pad = 24;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    const scaleX = (i) => (i / Math.max(1, d.length - 1)) * innerW + pad;
    const scaleY = (v) => height - pad - ((v - minV) / (maxV - minV)) * innerH;

    const toPath = (arr, key) => {
      return arr
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(Number(p[key] || 0))}`)
        .join(' ');
    };

    return {
      pointsPred: toPath(d, 'pred_speed'),
      pointsActual: toPath(d, 'actual_speed'),
    };
  }, [data]);

  return (
    <div className="w-full border rounded-xl p-6 bg-white/70 backdrop-blur">
      <div className="text-slate-800 font-semibold mb-3">Speed Trend (km/h)</div>
      <svg viewBox="0 0 600 220" className="w-full h-56">
        <defs>
          <linearGradient id="pred" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="actual" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="220" fill="#ffffff" rx="12" />
        <path d={pointsPred} fill="none" stroke="#6366f1" strokeWidth="2" />
        <path d={pointsActual} fill="none" stroke="#10b981" strokeWidth="2" />
      </svg>
      <div className="flex gap-4 text-xs text-slate-600 mt-2">
        <div className="inline-flex items-center gap-2"><span className="w-3 h-1 bg-indigo-500 inline-block" /> Predicted</div>
        <div className="inline-flex items-center gap-2"><span className="w-3 h-1 bg-emerald-500 inline-block" /> Actual</div>
      </div>
    </div>
  );
}
