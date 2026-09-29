"use client";
import React, { useState, useEffect } from 'react';

export default function SkyGuardDashboard() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await fetch('https://skyguard-backend-dm1b.onrender.com/api/telemetry');
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        
        setData(json);
        setError(false);
        
        // Keep a rolling history log of the last 6 telemetry streams
        setHistory((prev) => [
          {
            time: json?.timestamp || new Date().toLocaleTimeString(),
            temp: json?.telemetry?.temperature_c,
            pressure: json?.telemetry?.pressure_hpa,
            humidity: json?.telemetry?.humidity_pct,
            status: json?.ml_evaluation?.is_anomaly ? 'ANOMALY' : 'NOMINAL',
            root: json?.ml_evaluation?.root_cause || 'System Nominal'
          },
          ...prev.slice(0, 5)
        ]);
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
  const ml = data?.ml_evaluation || {};
  const spatial = data?.spatial_cross_check || {};
  const shap = data?.explainable_ai_shap || {};
  const healing = data?.auto_healing || {};

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans antialiased">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-wider text-emerald-400 uppercase">SkyGuard AI</h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono">
              MoES AWS Quality Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Station ID: {data?.station_id} | Region: West Bengal Circle</p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500">Pipelined Stream: </span>
            <span className="text-slate-200">{data?.timestamp}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-semibold">Render Engine Active</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-slate-900/90 border p-5 rounded-xl transition-all duration-300 ${ml?.primary_fault_metric === 'Temperature' ? 'border-red-500/80 shadow-lg shadow-red-500/10' : 'border-slate-800'}`}>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Temperature</span>
            <span className="font-mono text-slate-500">15 - 45°C</span>
          </div>
          <div className="flex items-baseline gap-2 my-3">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${ml?.primary_fault_metric === 'Temperature' ? 'text-red-400' : 'text-slate-100'}`}>
              {telemetry?.temperature_c}
            </span>
            <span className="text-slate-400 font-mono">°C</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: `${Math.min(100, Math.max(0, ((telemetry?.temperature_c - 15) / 30) * 100))}%` }}></div>
          </div>
        </div>

        <div className={`bg-slate-900/90 border p-5 rounded-xl transition-all duration-300 ${ml?.primary_fault_metric === 'Telemetry Pipeline' ? 'border-red-500/80 shadow-lg shadow-red-500/10' : 'border-slate-800'}`}>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Pressure</span>
            <span className="font-mono text-slate-500">980 - 1030 hPa</span>
          </div>
          <div className="flex items-baseline gap-2 my-3">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${ml?.primary_fault_metric === 'Telemetry Pipeline' ? 'text-red-400' : 'text-slate-100'}`}>
              {telemetry?.pressure_hpa}
            </span>
            <span className="text-slate-400 font-mono">hPa</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-400 h-full" style={{ width: `${Math.min(100, Math.max(0, ((telemetry?.pressure_hpa - 980) / 50) * 100))}%` }}></div>
          </div>
        </div>

        <div className={`bg-slate-900/90 border p-5 rounded-xl transition-all duration-300 ${ml?.primary_fault_metric === 'Relative Humidity' ? 'border-red-500/80 shadow-lg shadow-red-500/10' : 'border-slate-800'}`}>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Humidity</span>
            <span className="font-mono text-slate-500">30 - 95%</span>
          </div>
          <div className="flex items-baseline gap-2 my-3">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${ml?.primary_fault_metric === 'Relative Humidity' ? 'text-red-400' : 'text-slate-100'}`}>
              {telemetry?.humidity_pct}
            </span>
            <span className="text-slate-400 font-mono">%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full" style={{ width: `${Math.min(100, Math.max(0, telemetry?.humidity_pct))}%` }}></div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ML & Spatial Diagnostic */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Anomaly & Spatial Verification</h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold font-mono ${
                ml?.is_anomaly ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {ml?.is_anomaly ? 'ANOMALY DETECTED' : 'NOMINAL STREAM'}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Isolation Forest Score:</span>
                <span className="text-slate-200">{ml?.anomaly_score} ({ml?.confidence_pct}% Conf)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Root Cause Classification:</span>
                <span className="text-amber-400 font-bold">{ml?.root_cause}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">15km Spatial Cross-Check:</span>
                <span className="text-slate-200">{spatial?.status_label}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Neighbor Node ({spatial?.neighbor_node_id}):</span>
                <span className="text-slate-200">{spatial?.neighbor_temp_c}°C</span>
              </div>
            </div>
          </div>

          {healing?.engaged && (
            <div className="mt-5 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Self-Healing Data Imputation (SciPy)</p>
              <div className="flex justify-between items-center mt-2 font-mono text-xs">
                <span className="text-slate-400">Corrupted Input: <span className="text-red-400 line-through">{healing?.corrupted_raw}</span></span>
                <span className="text-slate-400">Reconstructed Proxy: <span className="text-emerald-300 font-bold">{healing?.reconstructed_proxy_value}</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Explainable AI */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 border-b border-slate-800 pb-3">
            Explainable AI (SHAP Feature Attribution)
          </h2>
          <p className="text-xs text-slate-400 mb-5">Quantifies metric responsibility during model anomaly scoring:</p>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Temperature Weight</span>
                <span>{shap?.temperature_pct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${shap?.temperature_pct || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pressure Weight</span>
                <span>{shap?.pressure_pct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${shap?.pressure_pct || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Humidity Weight</span>
                <span>{shap?.humidity_pct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${shap?.humidity_pct || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream Stream Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 mt-6">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
          Live Telemetry Stream History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 uppercase">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Temp (°C)</th>
                <th className="pb-3">Pressure (hPa)</th>
                <th className="pb-3">Humidity (%)</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Root Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 text-slate-400">{row.time}</td>
                  <td className="py-2.5 text-slate-200">{row.temp}</td>
                  <td className="py-2.5 text-slate-200">{row.pressure}</td>
                  <td className="py-2.5 text-slate-200">{row.humidity}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'ANOMALY' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400">{row.root}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
