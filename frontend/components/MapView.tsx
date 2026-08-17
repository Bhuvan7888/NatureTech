'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface NGO {
  name: string;
  category: string;
  contact: string;
  website: string;
  location: string;
  source: string;
}

interface MapViewProps {
  latitude: number;
  longitude: number;
  ngos: NGO[];
}

export default function MapView({ latitude, longitude, ngos }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
        Loading Interactive Geospatial Map...
      </div>
    );
  }

  // Fallback lat/lon if 0,0
  const activeLat = latitude === 0 ? 18.5204 : latitude;
  const activeLon = longitude === 0 ? 73.8567 : longitude;

  // Render Leaflet map via iframe or react leaflet dynamically
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeLon - 0.15}%2C${activeLat - 0.15}%2C${activeLon + 0.15}%2C${activeLat + 0.15}&layer=mapnik&marker=${activeLat}%2C${activeLon}`;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 max-w-5xl mx-auto my-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Impact Location & Nearby NGO Mapping</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial coordinates ({activeLat.toFixed(4)}°, {activeLon.toFixed(4)}°) with OpenStreetMap Overpass radius query.
          </p>
        </div>

        <a
          href={`https://www.openstreetmap.org/?mlat=${activeLat}&mlon=${activeLon}#map=12/${activeLat}/${activeLon}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open Full OSM Map</span>
        </a>
      </div>

      <div className="relative w-full h-[350px] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
        <iframe
          title="Impact Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={openStreetMapUrl}
          className="w-full h-full filter contrast-105 brightness-95"
        />
        
        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-xs text-slate-300 max-w-xs shadow-lg">
          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Target Impact Zone</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Coordinates: {activeLat.toFixed(4)}, {activeLon.toFixed(4)}
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-400">
            {ngos.length} Partner NGO(s) within 50km
          </div>
        </div>
      </div>
    </div>
  );
}
