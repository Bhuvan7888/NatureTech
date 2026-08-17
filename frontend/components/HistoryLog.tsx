'use client';

import React, { useEffect, useState } from 'react';
import { History, RefreshCw, Calendar, MapPin, DollarSign, PieChart } from 'lucide-react';
import { getApiBaseUrl } from '@/utils/api';

interface HistoryItem {
  id: number;
  timestamp: number;
  mode: string;
  latitude: number;
  longitude: number;
  damage_area_m2: number;
  estimated_cost_usd: number;
}

export default function HistoryLog() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 max-w-5xl mx-auto my-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>SQLite Analysis Audit Log</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical record of all satellite runs stored in SQLite regrow.db.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading historical analysis records...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
          No historical satellite analysis records found in database yet. Run an analysis above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-emerald-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Location (Lat, Lon)</th>
                <th className="py-3 px-4">Damage Area</th>
                <th className="py-3 px-4">Estimated Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">#{item.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-300">
                    {new Date(item.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.mode.toLowerCase().includes('fire')
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.mode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {item.damage_area_m2 >= 10000
                      ? `${(item.damage_area_m2 / 10000).toFixed(2)} ha`
                      : `${item.damage_area_m2.toLocaleString()} m²`}
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-300">
                    ${item.estimated_cost_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
