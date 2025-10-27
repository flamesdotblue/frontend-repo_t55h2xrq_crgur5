import React from 'react';

export default function TrafficStats({ latest }) {
  if (!latest) {
    return (
      <div className="w-full border rounded-xl p-6 bg-white/70 backdrop-blur text-slate-600">
        Waiting for live traffic data...
      </div>
    );
  }

  const { segment, pred_speed, avg_speed, occupancy, status, actual_speed, timestamp } = latest;

  const badgeColor = status?.toLowerCase().includes('high')
    ? 'bg-rose-100 text-rose-700'
    : status?.toLowerCase().includes('moderate')
    ? 'bg-amber-100 text-amber-700'
    : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="w-full border rounded-xl p-6 bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-800 font-semibold text-lg">Segment {segment}</div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{status}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Predicted Speed" value={`${Number(pred_speed).toFixed(1)} km/h`} />
        <Stat label="Actual Speed" value={`${Number(actual_speed).toFixed(1)} km/h`} />
        <Stat label="Average Speed" value={`${Number(avg_speed).toFixed(1)} km/h`} />
        <Stat label="Occupancy" value={`${(Number(occupancy) * 100).toFixed(0)}%`} />
      </div>
      <div className="mt-4 text-xs text-slate-500">Last update • {timestamp}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="text-slate-900 font-semibold text-xl">{value}</div>
    </div>
  );
}
