'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Eye, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

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
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 max-w-5xl mx-auto my-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span>Interactive Satellite Image Comparison</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Slide divider or switch views to analyze {modeName} before/after differences.
          </p>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'slider'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Slider
          </button>

          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'overlay'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Mask Overlay
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'side-by-side'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>

          {visualizationUrl && (
            <button
              onClick={handleDownloadVisualization}
              className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 transition ml-2"
              title="Download AI High-Res Overlay"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Image Display Area */}
      {viewMode === 'slider' && (
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden select-none border border-slate-800 shadow-2xl">
          
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
            <div className="absolute top-4 left-4 bg-slate-950/80 px-3 py-1 rounded-md text-xs font-bold text-emerald-400 border border-emerald-500/30">
              BEFORE
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-slate-950/80 px-3 py-1 rounded-md text-xs font-bold text-red-400 border border-red-500/30">
            AFTER {visualizationUrl && showOverlay ? '(AI Masked)' : ''}
          </div>

          {/* Slider Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-emerald-400 cursor-ew-resize shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-lg flex items-center justify-center text-slate-950 font-bold">
              ↔
            </div>
          </div>

          {/* Range Input controller overlay */}
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
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center bg-slate-950">
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
          <div className="absolute bottom-4 left-4 bg-slate-950/90 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Computer Vision Heatmap Mask (Red Highlights = Detected Damage)</span>
          </div>
        </div>
      )}

      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-xl overflow-hidden border border-slate-800">
            <img src={beforeUrl} alt="Before" className="w-full h-72 object-cover" />
            <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-xs font-bold text-emerald-400">
              BEFORE
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-slate-800">
            <img src={visualizationUrl || afterUrl} alt="After" className="w-full h-72 object-cover" />
            <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-xs font-bold text-red-400">
              AFTER {visualizationUrl ? '(AI Masked)' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Slider Hint */}
      {viewMode === 'slider' && (
        <p className="text-center text-xs text-slate-400 mt-3">
          Drag horizontally across the image to compare the baseline satellite picture with the post-disaster analysis.
        </p>
      )}

    </div>
  );
}
