import React, { useEffect, useMemo, useRef, useState } from 'react';
import ConnectionBar from './components/ConnectionBar.jsx';
import TrafficStats from './components/TrafficStats.jsx';
import ActivityLog from './components/ActivityLog.jsx';
import SpeedChart from './components/SpeedChart.jsx';
import { Signal, Gauge, Activity } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('ws://localhost:8080/stream?role=dashboard');
  const [connected, setConnected] = useState(false);
  const [latestPacket, setLatestPacket] = useState(null);
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  const addEvent = (message) => {
    const ts = new Date().toLocaleTimeString();
    setEvents((e) => [{ time: ts, message }, ...e].slice(0, 200));
  };

  const connect = () => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      addEvent('Connecting...');

      ws.onopen = () => {
        setConnected(true);
        addEvent('Connected to stream.');
      };

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          // validate minimal fields
          if (
            data &&
            'segment' in data &&
            'pred_speed' in data &&
            'actual_speed' in data &&
            'timestamp' in data
          ) {
            setLatestPacket(data);
            setHistory((h) => [...h.slice(-199), data]);
          } else {
            addEvent(`Received non-conforming packet: ${evt.data.substring(0, 120)}...`);
          }
        } catch (err) {
          addEvent(`Failed to parse message: ${String(err)}`);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        addEvent('Disconnected from stream.');
      };

      ws.onerror = (e) => {
        addEvent('WebSocket error occurred.');
      };
    } catch (err) {
      addEvent(`Connection error: ${String(err)}`);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    // clean up on unmount
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const chartData = useMemo(() => history.map((d) => ({
    timestamp: d.timestamp,
    pred_speed: Number(d.pred_speed),
    actual_speed: Number(d.actual_speed),
  })), [history]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Signal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">Traffic Management Prediction Dashboard</h1>
              <p className="text-slate-500 text-sm">Real-time CNN–BiLSTM telemetry via WebSocket</p>
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full border ${connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </header>

        <ConnectionBar
          url={url}
          setUrl={setUrl}
          connected={connected}
          onConnect={connect}
          onDisconnect={disconnect}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TrafficStats latest={latestPacket} />
            <SpeedChart data={chartData} />
          </div>
          <div className="space-y-6">
            <QuickHelp />
            <ActivityLog events={events} />
          </div>
        </div>

        <FooterNote />
      </div>
    </div>
  );
}

function QuickHelp() {
  return (
    <div className="w-full border rounded-xl p-6 bg-white/70 backdrop-blur">
      <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
        <Gauge className="w-4 h-4" /> Quick Start
      </div>
      <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
        <li>Default endpoint expects role=dashboard: ws://localhost:8080/stream?role=dashboard</li>
        <li>Generators push packets instantly to dashboards: ws://localhost:8080/stream?role=generator</li>
        <li>Packet format: {`{"segment":"S1","pred_speed":67.5,"avg_speed":62.1,"occupancy":0.82,"status":"High Traffic","actual_speed":63.3,"timestamp":"2025-10-27 14:52:00"}`}</li>
      </ul>
    </div>
  );
}

function FooterNote() {
  return (
    <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
      <Activity className="w-3 h-3" /> Connect a generator to start streaming predictions.
    </div>
  );
}
