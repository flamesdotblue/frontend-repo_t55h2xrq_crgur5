import React from 'react';

export default function ActivityLog({ events }) {
  return (
    <div className="w-full border rounded-xl p-6 bg-white/70 backdrop-blur">
      <div className="text-slate-800 font-semibold mb-3">Activity</div>
      <div className="h-56 overflow-auto space-y-2 pr-1">
        {events.length === 0 && (
          <div className="text-slate-500 text-sm">No events yet.</div>
        )}
        {events.map((e, idx) => (
          <div key={idx} className="text-xs text-slate-700 bg-slate-50 border rounded p-2">
            <span className="text-slate-400">[{e.time}]</span> {e.message}
          </div>
        ))}
      </div>
    </div>
  );
}
