'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Eye, Download, Image as ImageIcon, Sparkles, Layers, Maximize2 } from 'lucide-react';

interface ComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
  visualizationUrl?: string;
  modeName: string;
}

export default function ComparisonSlider({
  beforeUrl,
  afterUrl,
  visualizationUrl,
  modeName,
}: ComparisonSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'slider' | 'overlay' | 'side-by-side'>('slider');

  const handleDownloadVisualization = () => {
    if (!visualizationUrl) return;
    const link = document.createElement('a');
    link.href = visualizationUrl;
    link.download = `regrow_analysis_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-emerald-500/30 max-w-5xl mx-auto my-8 shadow-2xl relative">
      
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 mb-6 border-b border-slate-800 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center space-x-2.5">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span>Interactive Satellite Image Comparison Slider</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag the divider or switch view modes to analyze high-resolution {modeName} changes.
          </p>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'slider'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ↔ Interactive Slider
          </button>

          <button
            type="button"
            onClick={() => setViewMode('overlay')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'overlay'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ AI Mask Heatmap
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🖼️ Side-by-Side
          </button>

          {visualizationUrl && (
            <button
              type="button"
              onClick={handleDownloadVisualization}
              className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 transition-all ml-1.5 shadow-md hover:scale-105"
              title="Download AI High-Res Heatmap Overlay PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Display Area */}
      {viewMode === 'slider' && (
        <div className="relative w-full h-[420px] sm:h-[520px] rounded-2xl overflow-hidden select-none border border-slate-800 shadow-2xl bg-slate-950">
          
          {/* Base Layer: After Image */}
          <img
            src={visualizationUrl && showOverlay ? visualizationUrl : afterUrl}
            alt="After Satellite"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top Layer: Before Image Clipped */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={beforeUrl}
              alt="Before Satellite"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute top-4 left-4 bg-slate-950/90 px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-400 border border-emerald-500/40 shadow-lg">
              BASELINE SATELLITE
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-slate-950/90 px-3.5 py-1.5 rounded-xl text-xs font-black text-red-400 border border-red-500/40 shadow-lg">
            POST-DISASTER {visualizationUrl && showOverlay ? '(AI Heatmap Masked)' : ''}
          </div>

          {/* Slider Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-teal-300 to-emerald-400 cursor-ew-resize shadow-[0_0_15px_rgba(52,211,153,0.9)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-slate-950 shadow-2xl flex items-center justify-center text-slate-950 font-black text-sm hover:scale-110 transition-transform">
              ↔
            </div>
          </div>

          {/* Range Controller Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
        </div>
      )}

      {viewMode === 'overlay' && (
        <div className="relative w-full h-[420px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center bg-slate-950">
          {visualizationUrl ? (
            <img
              src={visualizationUrl}
              alt="AI Detected Damage Mask"
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={afterUrl}
              alt="After Satellite"
              className="w-full h-full object-contain"
            />
          )}
          <div className="absolute bottom-4 left-4 bg-slate-950/90 px-4 py-2 rounded-xl border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center space-x-2 shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI Computer Vision Heatmap Mask (Red/Orange Highlights = Detected Damage)</span>
          </div>
        </div>
      )}

      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
            <img src={beforeUrl} alt="Before" className="w-full h-80 object-cover" />
            <div className="absolute top-3 left-3 bg-slate-950/90 px-3 py-1 rounded-xl text-xs font-black text-emerald-400 border border-emerald-500/30">
              BASELINE SATELLITE
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
            <img src={visualizationUrl || afterUrl} alt="After" className="w-full h-80 object-cover" />
            <div className="absolute top-3 left-3 bg-slate-950/90 px-3 py-1 rounded-xl text-xs font-black text-red-400 border border-red-500/30">
              POST-DISASTER {visualizationUrl ? '(AI Heatmap Masked)' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Slider Hint */}
      {viewMode === 'slider' && (
        <p className="text-center text-xs text-slate-400 mt-4">
          Drag horizontally across the image to inspect baseline satellite imagery vs post-disaster analysis.
        </p>
      )}

    </div>
  );
}
