'use client';

import React, { useState } from 'react';
import { Upload, Flame, Trees, Zap, Sliders, MapPin, CheckCircle, RefreshCw, Satellite, Search, Globe, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  onAnalyze: (formData: FormData) => void;
  isLoading: boolean;
  onLoadSamples: () => void;
  beforePreview: string | null;
  setBeforePreview: (url: string | null) => void;
  afterPreview: string | null;
  setAfterPreview: (url: string | null) => void;
  beforeFile: File | null;
  setBeforeFile: (file: File | null) => void;
  afterFile: File | null;
  setAfterFile: (file: File | null) => void;
  latitude: number;
  setLatitude: (lat: number) => void;
  longitude: number;
  setLongitude: (lon: number) => void;
}

export default function ImageUploader({
  onAnalyze,
  isLoading,
  onLoadSamples,
  beforePreview,
  setBeforePreview,
  afterPreview,
  setAfterPreview,
  beforeFile,
  setBeforeFile,
  afterFile,
  setAfterFile,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
}: ImageUploaderProps) {
  const [sourceMode, setSourceMode] = useState<'upload' | 'sentinel'>('upload');
  const [mode, setMode] = useState<'deforestation' | 'fire'>('deforestation');
  const [pixelResolution, setPixelResolution] = useState<number>(1.0);
  const [minArea, setMinArea] = useState<number>(100);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Live Sentinel & Geocoding States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [isFetchingSentinel, setIsFetchingSentinel] = useState<boolean>(false);
  const [resolvedLocationName, setResolvedLocationName] = useState<string | null>(null);
  const [sentinelDates, setSentinelDates] = useState<{ before: string; after: string } | null>(null);

  const presets = [
    { label: '🌴 Amazon Rainforest', lat: -5.4517, lon: -74.3153 },
    { label: '🔥 California Fire Zone', lat: 37.7749, lon: -122.4194 },
    { label: '🌲 Black Forest', lat: 48.0000, lon: 8.2000 },
    { label: '🏝️ Maui Disaster Zone', lat: 20.7984, lon: -156.3319 },
  ];

  const base64ToFile = (base64String: string, filename: string): File => {
    try {
      const parts = base64String.split(';base64,');
      const contentType = parts[0].replace('data:', '') || 'image/png';
      const b64Data = parts[1] || parts[0];
      const raw = window.atob(b64Data);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      return new File([blob], filename, { type: contentType });
    } catch (e) {
      console.error("base64ToFile conversion error:", e);
      return new File([new Blob([""])], filename, { type: 'image/png' });
    }
  };

  const handleSearchLocation = async (overrideQuery?: string): Promise<{ lat: number; lon: number } | null> => {
    const q = overrideQuery || searchQuery;
    if (!q.trim()) return null;
    setIsSearchingLocation(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/live/geocode?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setResolvedLocationName(data.display_name);
        return { lat: data.latitude, lon: data.longitude };
      }
    } catch (e) {
      console.error('Geocoding search failed:', e);
    } finally {
      setIsSearchingLocation(false);
    }
    return null;
  };

  const handleFetchLiveSentinel = async () => {
    setIsFetchingSentinel(true);
    setSentinelDates(null);
    try {
      let targetLat = latitude;
      let targetLon = longitude;

      if (searchQuery.trim()) {
        const geoRes = await handleSearchLocation();
        if (geoRes) {
          targetLat = geoRes.lat;
          targetLon = geoRes.lon;
        }
      }

      const fd = new FormData();
      fd.append('latitude', targetLat.toString());
      fd.append('longitude', targetLon.toString());

      const res = await fetch('http://127.0.0.1:8000/api/live/fetch-satellite', {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.before_image && data.after_image) {
          setBeforePreview(data.before_image);
          setAfterPreview(data.after_image);
          setSentinelDates({ before: data.before_date, after: data.after_date });

          const fBefore = base64ToFile(data.before_image, 'sentinel_before.png');
          const fAfter = base64ToFile(data.after_image, 'sentinel_after.png');
          setBeforeFile(fBefore);
          setAfterFile(fAfter);
        }
      }
    } catch (e) {
      console.error('Failed to fetch live Sentinel-2 satellite imagery:', e);
    } finally {
      setIsFetchingSentinel(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'before') {
        setBeforeFile(file);
        setBeforePreview(url);
      } else {
        setAfterFile(file);
        setAfterPreview(url);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforePreview || !afterPreview) return;

    const fd = new FormData();
    if (beforeFile) {
      fd.append('before_image', beforeFile);
    }
    if (afterFile) {
      fd.append('after_image', afterFile);
    }
    fd.append('mode', mode === 'deforestation' ? 'deforestation' : 'fire');
    fd.append('pixel_resolution', pixelResolution.toString());
    fd.append('min_area', minArea.toString());
    fd.append('latitude', latitude.toString());
    fd.append('longitude', longitude.toString());

    onAnalyze(fd);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 shadow-2xl border border-emerald-500/30 max-w-5xl mx-auto my-8 relative">
      
      {/* Header & Source Mode Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Upload className="w-6 h-6 text-emerald-400" />
            <span>Satellite Image Acquisition Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload custom drone imagery, test 800x600 real satellite demo datasets, or stream live Sentinel-2 tiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSourceMode('upload')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                sourceMode === 'upload'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Custom Upload</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceMode('sentinel')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                sourceMode === 'sentinel'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="w-4 h-4 text-teal-300" />
              <span>Live Sentinel-2 Stream</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onLoadSamples}
            className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold hover:brightness-125 transition-all shadow-lg shadow-emerald-950/50 hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Quick Load Real Satellite Demo Pair</span>
          </button>
        </div>
      </div>

      {/* LIVE SENTINEL SATELLITE SEARCH CONTAINER */}
      {sourceMode === 'sentinel' && (
        <div className="mb-6 p-5 rounded-2xl bg-slate-900/90 border border-teal-500/40 text-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-teal-300 font-extrabold">
              <Satellite className="w-4 h-4 text-teal-400" />
              <span>Automated Sentinel-2 Earth Observation STAC Search</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60 font-mono">
              ESA Copernicus STAC API
            </span>
          </div>

          {/* Quick Location Preset Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-400 font-semibold shrink-0">Quick Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(p.label.replace(/^[^\s]+\s*/, ''));
                  setLatitude(p.lat);
                  setLongitude(p.lon);
                  setResolvedLocationName(`${p.label} (${p.lat}°, ${p.lon}°)`);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-teal-500/60 hover:text-white transition shrink-0 font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                placeholder="Search global target (e.g. 'Amazon Rainforest', 'California', 'Maui')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-20 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => handleSearchLocation()}
                disabled={isSearchingLocation}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-lg text-[11px] font-bold hover:bg-teal-900 transition"
              >
                {isSearchingLocation ? 'Locating...' : 'Locate'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleFetchLiveSentinel}
              disabled={isFetchingSentinel}
              className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 hover:brightness-110 transition shadow-lg shadow-teal-950/40 disabled:opacity-50"
            >
              {isFetchingSentinel ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching Sentinel STAC Tiles...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-teal-200" />
                  <span>Fetch Cloud-Free Satellite Data</span>
                </>
              )}
            </button>
          </div>

          {resolvedLocationName && (
            <div className="flex items-center space-x-1.5 text-slate-300 text-[11px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Resolved Target: <strong>{resolvedLocationName}</strong> ({latitude.toFixed(4)}°, {longitude.toFixed(4)}°)</span>
            </div>
          )}

          {sentinelDates && (
            <div className="flex items-center space-x-3 text-[11px] text-emerald-400 font-bold bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <span>Baseline Imagery: {sentinelDates.before}</span>
              <span>•</span>
              <span>Recent Imagery: {sentinelDates.after}</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Before Image Card */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-200 mb-2 flex items-center justify-between">
              <span>Before Image (Baseline Satellite)</span>
              {beforePreview && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Ready</span>}
            </label>
            <div className="relative group border-2 border-dashed border-emerald-800/60 hover:border-emerald-500/80 rounded-2xl bg-slate-900/50 p-4 transition-all min-h-[240px] flex flex-col items-center justify-center text-center">
              {beforePreview ? (
                <div className="w-full relative group">
                  <img
                    src={beforePreview}
                    alt="Before Satellite"
                    className="w-full h-52 object-cover rounded-xl border border-slate-700 shadow-md"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-950/85 text-emerald-400 rounded-lg text-[10px] font-mono font-bold border border-emerald-500/30">
                    BASELINE
                  </div>
                  <button
                    type="button"
                    onClick={() => { setBeforeFile(null); setBeforePreview(null); }}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-slate-950/85 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-950 transition border border-red-800/40"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-8">
                  <Upload className="w-10 h-10 text-emerald-500 mb-3 group-hover:scale-110 transition" />
                  <span className="text-sm font-bold text-slate-200">Click to upload or drag & drop</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG, TIF or TIFF</span>
                  <input
                    type="file"
                    accept="image/*,.tif,.tiff"
                    onChange={(e) => handleFileChange(e, 'before')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* After Image Card */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-200 mb-2 flex items-center justify-between">
              <span>After Image (Post-Disaster Satellite)</span>
              {afterPreview && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Ready</span>}
            </label>
            <div className="relative group border-2 border-dashed border-emerald-800/60 hover:border-emerald-500/80 rounded-2xl bg-slate-900/50 p-4 transition-all min-h-[240px] flex flex-col items-center justify-center text-center">
              {afterPreview ? (
                <div className="w-full relative group">
                  <img
                    src={afterPreview}
                    alt="After Satellite"
                    className="w-full h-52 object-cover rounded-xl border border-slate-700 shadow-md"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-950/85 text-red-400 rounded-lg text-[10px] font-mono font-bold border border-red-500/30">
                    POST-DISASTER
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAfterFile(null); setAfterPreview(null); }}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-slate-950/85 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-950 transition border border-red-800/40"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-8">
                  <Upload className="w-10 h-10 text-emerald-500 mb-3 group-hover:scale-110 transition" />
                  <span className="text-sm font-bold text-slate-200">Click to upload or drag & drop</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG, TIF or TIFF</span>
                  <input
                    type="file"
                    accept="image/*,.tif,.tiff"
                    onChange={(e) => handleFileChange(e, 'after')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

        </div>

        {/* Analysis Mode Toggle */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 block flex items-center justify-between">
            <span>Analysis Mode Selection</span>
            <span className="text-[10px] text-emerald-400 font-normal">Dual Computer Vision Algorithms</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('deforestation')}
              className={`flex items-center space-x-3.5 p-4 rounded-2xl border text-left transition-all ${
                mode === 'deforestation'
                  ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-xl shadow-emerald-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-3 rounded-xl ${mode === 'deforestation' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400'}`}>
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-extrabold">Deforestation Analysis</div>
                <div className="text-xs text-slate-400 mt-0.5">Identify tree cover loss & barren soil conversion</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('fire')}
              className={`flex items-center space-x-3.5 p-4 rounded-2xl border text-left transition-all ${
                mode === 'fire'
                  ? 'bg-red-950/90 border-red-500 text-white shadow-xl shadow-red-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-3 rounded-xl ${mode === 'fire' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-extrabold">Forest Fire Detection</div>
                <div className="text-xs text-slate-400 mt-0.5">Detect active fires & burn scar boundaries</div>
              </div>
            </button>
          </div>
        </div>

        {/* Advanced Settings Drawer */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-5 py-3.5 text-xs font-bold text-slate-300 flex items-center justify-between hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Advanced Geospatial & Resolution Parameters</span>
            </div>
            <span className="text-emerald-400 font-extrabold">{showAdvanced ? 'Hide [-]' : 'Expand [+]'}</span>
          </button>

          {showAdvanced && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Pixel Resolution (m/px)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={pixelResolution}
                  onChange={(e) => setPixelResolution(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Min Region (Pixels)</label>
                <input
                  type="number"
                  step="10"
                  min="10"
                  max="5000"
                  value={minArea}
                  onChange={(e) => setMinArea(parseInt(e.target.value) || 100)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Target Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0.0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Target Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0.0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Action CTA */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!beforePreview || !afterPreview || isLoading}
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center space-x-3 shadow-2xl ${
              !beforePreview || !afterPreview || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : mode === 'deforestation'
                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-emerald-900/50 hover:scale-[1.03]'
                : 'bg-gradient-to-r from-red-500 via-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-red-900/50 hover:scale-[1.03]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Computer Vision Algorithms...</span>
              </>
            ) : (
              <>
                {mode === 'deforestation' ? <Trees className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
                <span>Execute {mode === 'deforestation' ? 'Deforestation Analysis' : 'Forest Fire Detection'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
