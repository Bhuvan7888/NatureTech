'use client';

import React, { useState } from 'react';
import { Table, ListFilter, Download } from 'lucide-react';

interface RegionDetail {
  id: number;
  area_m2: number;
  area_ha: number;
  percentage: number;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

interface RegionsTableProps {
  regionDetails: RegionDetail[];
}

export default function RegionsTable({ regionDetails }: RegionsTableProps) {
  if (!regionDetails || regionDetails.length === 0) return null;

  const handleExportCSV = () => {
    const headers = ['Region_ID', 'Area_m2', 'Area_ha', 'Share_Percentage', 'Centroid_X', 'Centroid_Y', 'BBox'];
    const rows = regionDetails.map(r => [
      r.id,
      r.area_m2,
      r.area_ha,
      r.percentage,
      r.centroid[0],
      r.centroid[1],
      `"${r.bbox.join(',')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deforested_regions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 max-w-5xl mx-auto my-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Table className="w-5 h-5 text-emerald-400" />
            <span>Detected Damage Clusters Breakdown ({regionDetails.length} Regions)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual cluster bounding boxes, area dimensions, and spatial centroids.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-emerald-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Cluster ID</th>
              <th className="py-3 px-4">Area (m²)</th>
              <th className="py-3 px-4">Area (Hectares)</th>
              <th className="py-3 px-4">% Share</th>
              <th className="py-3 px-4">Bounding Box (X0, Y0, X1, Y1)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {regionDetails.slice(0, 15).map((r) => (
              <tr key={r.id} className="hover:bg-slate-900/50 transition">
                <td className="py-2.5 px-4 font-bold text-white">#Region-{r.id}</td>
                <td className="py-2.5 px-4">{r.area_m2.toLocaleString()} m²</td>
                <td className="py-2.5 px-4 font-mono text-emerald-300">{r.area_ha} ha</td>
                <td className="py-2.5 px-4 text-amber-400 font-semibold">{r.percentage}%</td>
                <td className="py-2.5 px-4 font-mono text-slate-400">
                  [{r.bbox[0]}, {r.bbox[1]}, {r.bbox[2]}, {r.bbox[3]}]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {regionDetails.length > 15 && (
        <p className="text-center text-xs text-slate-500 mt-3">
          Showing top 15 of {regionDetails.length} detected regions. Click Export CSV for complete cluster analysis data.
        </p>
      )}
    </div>
  );
}
