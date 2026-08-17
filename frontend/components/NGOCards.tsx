'use client';

import React, { useState } from 'react';
import { Building2, ExternalLink, Mail, Phone, MapPin, Search, Tag, CheckCircle2 } from 'lucide-react';

interface NGO {
  name: string;
  category: string;
  contact: string;
  website: string;
  location: string;
  source: string;
}

interface NGOCardsProps {
  ngos: NGO[];
}

export default function NGOCards({ ngos }: NGOCardsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'NGO', 'Forestry', 'Nature Club'];

  const filteredNgos = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.contact.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      ngo.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 max-w-5xl mx-auto my-6">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-5 border-b border-slate-800 gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Matched Local Conservation Partners</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial Overpass API partners available within 50km for sapling planting & ecosystem recovery.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Organizations' : cat}
          </button>
        ))}
      </div>

      {/* NGO Cards Grid */}
      {filteredNgos.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-900/60 rounded-2xl border border-amber-500/30 text-slate-300 text-xs space-y-2 shadow-lg">
          <div className="flex items-center justify-center space-x-2 text-amber-400 font-extrabold text-sm">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>No Registered Conservation NGOs Found Within 50km Radius</span>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
            No registered forestry offices, environmental NGOs, or nature clubs were found on OpenStreetMap within 50km of these coordinates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNgos.map((ngo, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold uppercase tracking-wide">
                    {ngo.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {ngo.source}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug mb-2">
                  {ngo.name}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{ngo.location}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-400">{ngo.contact}</span>
                  </div>
                </div>
              </div>

              {ngo.website && ngo.website !== 'No website' ? (
                <a
                  href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-emerald-900 transition"
                >
                  <span>Connect & Partner</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="w-full py-2 px-3 rounded-lg bg-slate-900 text-slate-500 text-xs font-semibold text-center">
                  Direct Partner Contact
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
