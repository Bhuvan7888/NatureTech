'use client';

import React, { useState, useEffect } from 'react';
import { Trees, ShieldAlert, History, MapPin, Activity, Leaf } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiStatus: 'online' | 'offline' | 'checking';
}

export default function Navbar({ activeTab, setActiveTab, apiStatus }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-900/40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Trees className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200 bg-clip-text text-transparent">
                Re-Grow
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-semibold uppercase tracking-wider">
                v2.0 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Satellite Deforestation & Recovery Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'analyzer'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Satellite Analyzer</span>
          </button>

          <button
            onClick={() => setActiveTab('ngos')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'ngos'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>NGO Partner Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Analytics History</span>
          </button>
        </nav>

        {/* API Connection Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${
              apiStatus === 'online' 
                ? 'bg-emerald-400 animate-pulse' 
                : apiStatus === 'offline' 
                ? 'bg-red-500' 
                : 'bg-yellow-400 animate-bounce'
            }`} />
            <span className="font-medium text-slate-300">
              {apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Connecting...'}
            </span>
          </div>

          <a
            href="https://github.com/Bhuvan7888/NatureTech"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Docs</span>
          </a>
        </div>

      </div>
    </header>
  );
}
