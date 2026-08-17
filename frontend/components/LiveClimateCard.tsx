'use client';

import React, { useEffect, useState } from 'react';
import { Wind, Thermometer, Flame, Compass, ShieldCheck, RefreshCw } from 'lucide-react';

interface ClimateData {
  latitude: number;
  longitude: number;
  temperature_c: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  fire_spread_risk: string;
  source: string;
}

interface LiveClimateCardProps {
  latitude: number;
  longitude: number;
}

export default function LiveClimateCard({ latitude, longitude }: LiveClimateCardProps) {
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClimate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/live/climate?lat=${latitude}&lon=${longitude}`);
      if (res.ok) {
        const data: ClimateData = await res.json();
        setClimate(data);
      }
    } catch (e) {
      console.error('Failed to fetch climate data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClimate();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="glass-panel p-4 rounded-xl border border-slate-800 text-slate-400 text-xs flex items-center justify-center space-x-2 max-w-5xl mx-auto my-4">
        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
        <span>Fetching live environmental & weather telemetry...</span>
      </div>
    );
  }

  if (!climate) return null;

  const isHighRisk = climate.fire_spread_risk.toLowerCase().includes('critical') || climate.fire_spread_risk.toLowerCase().includes('elevated');

  return (
    <div className="glass-panel rounded-xl p-4 border border-emerald-500/20 max-w-5xl mx-auto my-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Target Zone Climate Telemetry ({climate.source})
          </h4>
        </div>
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
          isHighRisk 
            ? 'bg-red-950 text-red-300 border border-red-800' 
            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
        }`}>
          Fire Propagation Risk: {climate.fire_spread_risk}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold">Temperature</div>
            <div className="text-sm font-bold text-white">{climate.temperature_c}°C</div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold">Wind Speed</div>
            <div className="text-sm font-bold text-white">{climate.wind_speed_kmh} km/h</div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold">Wind Heading</div>
            <div className="text-sm font-bold text-white">{climate.wind_direction_deg}°</div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-md ${isHighRisk ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {isHighRisk ? <Flame className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold">Coordinates</div>
            <div className="text-xs font-mono font-bold text-slate-200">
              {latitude.toFixed(2)}°, {longitude.toFixed(2)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
