'use client';

import React from 'react';
import { Trees, DollarSign, Layers, PieChart, ShieldAlert } from 'lucide-react';

interface MetricsGridProps {
  metrics: {
    damaged_area_m2: number;
    damaged_area_ha: number;
    total_analyzed_area_m2: number;
    damage_percentage: number;
    region_count: number;
  };
  economics: {
    trees_required: number;
    total_cost_usd: number;
    summary: string;
  };
  mode: string;
}

export default function MetricsGrid({ metrics, economics, mode }: MetricsGridProps) {
  const isFire = mode.toLowerCase().includes('fire');

  return (
    <div className="max-w-5xl mx-auto my-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <ShieldAlert className={`w-5 h-5 ${isFire ? 'text-red-400' : 'text-emerald-400'}`} />
          <span>Active Recovery Metrics & Economic Estimation</span>
        </h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${isFire ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
          {mode}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Damaged Area */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Damage Area</span>
            <div className={`p-2 rounded-lg ${isFire ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">
              {metrics.damaged_area_m2 >= 10000 
                ? `${metrics.damaged_area_ha.toLocaleString()} ha` 
                : `${metrics.damaged_area_m2.toLocaleString()} m²`}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              ({metrics.damaged_area_m2.toLocaleString()} sq meters)
            </div>
          </div>
        </div>

        {/* Metric 2: Damage % */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Damage Share</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-400">
              {metrics.damage_percentage}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              of total analyzed territory
            </div>
          </div>
        </div>

        {/* Metric 3: Regions Count */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Distinct Clusters</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-teal-300">
              {metrics.region_count}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              detected damage zones
            </div>
          </div>
        </div>

        {/* Metric 4: Trees Required */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-emerald-950/60 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-bold">Required Saplings</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-300">
              {economics.trees_required.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400/80 mt-1 font-medium">
              1 tree per 4m² standard
            </div>
          </div>
        </div>

        {/* Metric 5: Estimated Cost */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border border-teal-500/30 relative overflow-hidden bg-gradient-to-br from-teal-950/60 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-teal-300 font-bold">Estimated Cost</span>
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">
              ${economics.total_cost_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-teal-400/80 mt-1 font-medium">
              @ $2.50 per sapling
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
