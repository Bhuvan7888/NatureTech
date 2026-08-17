'use client';

import React from 'react';
import { Sparkles, Globe, DollarSign, Trees, Zap, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-12 px-4 lg:px-8 text-center max-w-6xl mx-auto">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/40 mb-6 text-xs text-emerald-300 font-bold tracking-wide shadow-lg shadow-emerald-950/40 animate-pulse-glow">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>Next-Gen Active Reforestation & Disaster Recovery Engine</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
        Turn Satellite Disaster Data Into <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent drop-shadow-sm">
          Actionable Reforestation Plans
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
        Upload custom satellite imagery or stream live <strong className="text-emerald-400">Sentinel-2 STAC tiles</strong>. 
        Our algorithms quantify forest damage area, compute required saplings and USD recovery budgets, 
        and match you with verified local conservation NGOs within 50km.
      </p>

      {/* Live Metric Ticker Cards */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
        
        <div className="glass-panel glass-panel-hover p-4 rounded-2xl flex items-center space-x-3.5 text-left border-emerald-500/30">
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Planting Standard</div>
            <div className="text-base font-extrabold text-white">1 Tree / 4m²</div>
            <div className="text-[10px] text-emerald-400 font-medium">2,500 Trees / Hectare</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-4 rounded-2xl flex items-center space-x-3.5 text-left border-teal-500/30">
          <div className="p-3 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Recovery Cost</div>
            <div className="text-base font-extrabold text-white">$2.50 / Sapling</div>
            <div className="text-[10px] text-teal-400 font-medium">All-Inclusive Budget</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-4 rounded-2xl flex items-center space-x-3.5 text-left border-emerald-500/30">
          <div className="p-3 rounded-xl bg-green-500/15 text-green-400 border border-green-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Geospatial Radius</div>
            <div className="text-base font-extrabold text-white">50km Overpass</div>
            <div className="text-[10px] text-green-400 font-medium">OSM Verified NGOs</div>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-4 rounded-2xl flex items-center space-x-3.5 text-left border-teal-500/30">
          <div className="p-3 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">AI Processing Speed</div>
            <div className="text-base font-extrabold text-white">&lt; 3 Seconds</div>
            <div className="text-[10px] text-teal-400 font-medium">Real-Time Computer Vision</div>
          </div>
        </div>

      </div>
    </div>
  );
}
