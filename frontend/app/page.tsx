'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ImageUploader from '@/components/ImageUploader';
import ComparisonSlider from '@/components/ComparisonSlider';
import MetricsGrid from '@/components/MetricsGrid';
import MapView from '@/components/MapView';
import NGOCards from '@/components/NGOCards';
import RegionsTable from '@/components/RegionsTable';
import HistoryLog from '@/components/HistoryLog';
import LiveClimateCard from '@/components/LiveClimateCard';
import { getApiBaseUrl } from '@/utils/api';
import { AlertCircle, CheckCircle, Trees } from 'lucide-react';

interface AnalysisResult {
  mode: string;
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
  visualization: string;
  region_details: any[];
  ngos: any[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  const [latitude, setLatitude] = useState<number>(18.5204);
  const [longitude, setLongitude] = useState<number>(73.8567);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const API_URL = getApiBaseUrl();

  // Check Backend API Health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (err) {
        setApiStatus('offline');
      }
    };
    checkHealth();
  }, []);

  // Helper to convert Base64 data URI to File
  const base64ToFile = async (base64String: string, filename: string): Promise<File> => {
    const res = await fetch(base64String);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  };

  // Load sample dataset
  const handleLoadSamples = async () => {
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/samples`);
      if (!res.ok) {
        throw new Error('Failed to load sample dataset from API.');
      }
      const data = await res.json();
      setBeforePreview(data.before_image);
      setAfterPreview(data.after_image);
      setLatitude(data.default_lat || 18.5204);
      setLongitude(data.default_lon || 73.8567);

      const fBefore = await base64ToFile(data.before_image, 'sample_before.jpg');
      const fAfter = await base64ToFile(data.after_image, 'sample_after.jpg');
      setBeforeFile(fBefore);
      setAfterFile(fAfter);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading sample images.');
    }
  };

  // Execute Analysis
  const handleAnalyze = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Analysis request failed.');
      }

      const data: AnalysisResult = await res.json();
      setAnalysisResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('analysis-results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process satellite analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* Sticky Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} apiStatus={apiStatus} />

      {/* Main Content Tabs */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
        
        {/* TAB 1: SATELLITE ANALYZER */}
        {activeTab === 'analyzer' && (
          <>
            <Hero />

            {errorMsg && (
              <div className="max-w-5xl mx-auto my-4 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-sm flex items-start space-x-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Analysis Exception</div>
                  <div>{errorMsg}</div>
                </div>
              </div>
            )}

            <ImageUploader
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onLoadSamples={handleLoadSamples}
              beforePreview={beforePreview}
              setBeforePreview={setBeforePreview}
              afterPreview={afterPreview}
              setAfterPreview={setAfterPreview}
              beforeFile={beforeFile}
              setBeforeFile={setBeforeFile}
              afterFile={afterFile}
              setAfterFile={setAfterFile}
              latitude={latitude}
              setLatitude={setLatitude}
              longitude={longitude}
              setLongitude={setLongitude}
            />

            {/* Analysis Results View */}
            {analysisResult && (
              <div id="analysis-results-section" className="pt-6 animate-fadeIn">
                
                {/* Visual Image Comparison Slider */}
                <ComparisonSlider
                  beforeUrl={beforePreview || ''}
                  afterUrl={afterPreview || ''}
                  visualizationUrl={analysisResult.visualization}
                  modeName={analysisResult.mode}
                />

                {/* Live Environmental & Weather Telemetry */}
                <LiveClimateCard
                  latitude={analysisResult.coordinates.latitude}
                  longitude={analysisResult.coordinates.longitude}
                />

                {/* KPI Metrics */}
                <MetricsGrid
                  metrics={analysisResult.metrics}
                  economics={analysisResult.economics}
                  mode={analysisResult.mode}
                />

                {/* Regions Breakdown Table */}
                {analysisResult.region_details && analysisResult.region_details.length > 0 && (
                  <RegionsTable regionDetails={analysisResult.region_details} />
                )}

                {/* Interactive Map View */}
                <MapView
                  latitude={analysisResult.coordinates.latitude}
                  longitude={analysisResult.coordinates.longitude}
                  ngos={analysisResult.ngos}
                />

                {/* NGO Partner Grid */}
                <NGOCards ngos={analysisResult.ngos} />

              </div>
            )}
          </>
        )}

        {/* TAB 2: NGO DIRECTORY */}
        {activeTab === 'ngos' && (
          <div className="pt-6">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl font-extrabold text-white">Geospatial Conservation NGO Directory</h2>
              <p className="text-slate-400 text-sm mt-2">
                OpenStreetMap Overpass API index of registered forestry offices, nature clubs, and environmental non-profits.
              </p>
            </div>
            <NGOCards ngos={analysisResult ? analysisResult.ngos : []} />
          </div>
        )}

        {/* TAB 3: HISTORY LOG */}
        {activeTab === 'history' && (
          <div className="pt-6">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl font-extrabold text-white">Analysis Run History</h2>
              <p className="text-slate-400 text-sm mt-2">
                All satellite deforestation & fire detection runs logged in SQLite database (regrow.db).
              </p>
            </div>
            <HistoryLog />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Trees className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-400">Re-Grow Active Recovery Platform</span>
          </div>
          <div>Built with Next.js 15, FastAPI, OpenCV & OpenStreetMap Overpass API</div>
        </div>
      </footer>

    </div>
  );
}
