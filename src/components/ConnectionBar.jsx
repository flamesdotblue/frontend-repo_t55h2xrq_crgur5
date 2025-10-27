import React from 'react';
import { Plug, PlugZap, Globe } from 'lucide-react';

export default function ConnectionBar({ url, setUrl, connected, onConnect, onDisconnect }) {
  return (
    <div className="w-full bg-white/70 backdrop-blur border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-center gap-2 text-slate-700">
        <Globe className="w-5 h-5" />
        <span className="font-semibold">WebSocket Endpoint</span>
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        placeholder="ws://localhost:8080/stream?role=dashboard"
      />
      <div className="flex items-center gap-2">
        {!connected ? (
          <button
            onClick={onConnect}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <PlugZap className="w-4 h-4" /> Connect
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plug className="w-4 h-4 rotate-180" /> Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
