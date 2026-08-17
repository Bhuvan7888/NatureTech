'use client';

import React from 'react';
import { Sparkles, Globe, DollarSign, Trees } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-10 px-4 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 mb-6 text-xs text-emerald-300 font-medium">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>Active Disaster Recovery & Economic Planning Engine</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
        Turn Satellite Disaster Data Into <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
          Actionable Reforestation Plans
        </span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
        Upload before & after satellite imagery to detect deforestation or forest fire burn scars. 
        Our algorithms quantify damage area, calculate required saplings and estimated USD recovery costs, 
        and automatically match you with local conservation NGOs in the impact zone.
      </p>

      {/* Feature Badges */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
        <div className="glass-panel p-3 rounded-xl flex items-center space-x-3 text-left">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Tree Density</div>
            <div className="text-sm font-bold text-white">1 Sapling / 4m²</div>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl flex items-center space-x-3 text-left">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Cost Benchmark</div>
            <div className="text-sm font-bold text-white">$2.50 / Tree</div>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl flex items-center space-x-3 text-left">
          <div className="p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">OSM Matchmaking</div>
            <div className="text-sm font-bold text-white">50 km Radius</div>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl flex items-center space-x-3 text-left">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Uptime Guarantee</div>
            <div className="text-sm font-bold text-white">SQLite Caching</div>
          </div>
        </div>
      </div>
    </div>
  );
}
