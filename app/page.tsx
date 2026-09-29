"use client";
import React, { useState, useEffect } from 'react';

export default function SkyGuardDashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await fetch('https://skyguard-backend-dm1b.onrender.com/api/telemetry');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setData(json);
        setError(false);
      } catch (err) {
        console.error("Connection Failed:", err);
        setError(true);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-slate-950 text-red-400 p-8 min-h-screen flex items-center justify-center font-mono">
        ⚠️ Unable to connect to SkyGuard Backend.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-950 text-emerald-400 p-8 min-h-screen flex items-center justify-center font-mono">
        Connecting to SkyGuard AI Real-Time Telemetry Stream...
      </div>
    );
  }

  const telemetry = data?.telemetry || {};
  const ml_evaluation = data?.ml_evaluation || {};
  const spatial_cross_check = data?.spatial_cross_check || {};
  const explainable_ai_shap = data?.explainable_ai_shap || {};
  const auto_healing = data?.auto_healing || {};

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-emerald-400">SkyGuard AI</h1>
          <p className="text-xs text-slate-400">AWS Telemetry Quality Control & Self-Healing Engine | Node: {data?.station_id}</p>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <span>Last Stream: {data?.timestamp}</span>
          <div className="flex items-center gap-2 mt-1 justify-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400">Render Cloud Engine Online</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <p className="text-slate-400 text-xs font-semibold uppercase">Temperature</p>
          <div className={`text-3xl font-extrabold my-2 font-mono ${ml_evaluation?.primary_fault_metric === 'Temperature' ? 'text-red-500' : 'text-slate-100'}`}>
            {telemetry?.temperature_c}°C
          </div>
          <p className="text-xs text-slate-500">Nominal Threshold: 15°C - 45°C</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <p className="text-slate-400 text-xs font-semibold uppercase">Barometric Pressure</p>
          <div className={`text-3xl font-extrabold my-2 font-mono ${ml_evaluation?.primary_fault_metric === 'Telemetry Pipeline' ? 'text-red-500' : 'text-slate-100'}`}>
            {telemetry?.pressure_hpa} hPa
          </div>
          <p className="text-xs text-slate-500">Nominal Threshold: 980 hPa - 1030 hPa</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <p className="text-slate-400 text-xs font-semibold uppercase">Relative Humidity</p>
          <div className={`text-3xl font-extrabold my-2 font-mono ${ml_evaluation?.primary_fault_metric === 'Relative Humidity' ? 'text-red-500' : 'text-slate-100'}`}>
            {telemetry?.humidity_pct}%
          </div>
          <p className="text-xs text-slate-500">Nominal Threshold: 30% - 95%</p>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Real-Time Anomaly & Spatial Diagnostic
          </h2>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">System State:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
              ml_evaluation?.is_anomaly ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {ml_evaluation?.is_anomaly ? 'ANOMALY DETECTED' : 'NOMINAL STREAM'}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Isolation Forest Score:</span>
              <span className="text-slate-200">{ml_evaluation?.anomaly_score} ({ml_evaluation?.confidence_pct}% Conf)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Root Cause Classification:</span>
              <span className="text-amber-400 font-bold">{ml_evaluation?.root_cause}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-3">
              <span className="text-slate-500">15km Spatial Cross-Check:</span>
              <span className="text-slate-200">{spatial_cross_check?.status_label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Neighbor Node ({spatial_cross_check?.neighbor_node_id}):</span>
              <span className="text-slate-200">{spatial_cross_check?.neighbor_temp_c}°C</span>
            </div>
          </div>

          {auto_healing?.engaged && (
            <div className="mt-5 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Self-Healing Data Imputation (SciPy)</p>
              <div className="flex justify-between items-center mt-2 font-mono text-xs">
                <span className="text-slate-400">Corrupted Input: <span className="text-red-400 line-through">{auto_healing?.corrupted_raw}</span></span>
                <span className="text-slate-400">Reconstructed Proxy: <span className="text-emerald-300 font-bold">{auto_healing?.reconstructed_proxy_value}</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Explainable AI */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Explainable AI (SHAP Feature Attribution)
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Quantifies individual parameter contribution to anomaly flags:
          </p>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Temperature Contribution</span>
                <span>{explainable_ai_shap?.temperature_pct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: `${explainable_ai_shap?.temperature_pct || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pressure Contribution</span>
                <span>{explainable_ai_shap?.pressure_pct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full" style={{ width: `${explainable_ai_shap?.pressure_pct || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Humidity Contribution</span>
                <span>{explainable_ai_shap?.humidity_pct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${explainable_ai_shap?.humidity_pct || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
