# SkyGuard AI - Frontend Dashboard

Official frontend web interface for **SkyGuard AI**, developed for Smart India Hackathon (SIH 2026) under Problem Statement **SIH26073** (AI/ML-Based Intelligent Anomaly Detection for Automatic Weather Stations).

## 🚀 Overview
The SkyGuard AI Frontend is a high-performance, real-time analytics dashboard built with **Next.js**, **React**, and **Tailwind CSS**. It connects directly to our live cloud-hosted backend engine to visualize automated weather station (AWS) telemetry, live anomaly flags, spatial verification audits, Explainable AI (SHAP) feature weights, and self-healing data imputations.

---

## 🛠️ Tech Stack & Libraries
* **Framework:** Next.js (App Router), React
* **Styling:** Tailwind CSS, Lucide Icons
* **Deployment:** Vercel (Production Cloud Hosting)
* **Backend Integration:** REST API polling via FastAPI (Render Cloud)

---

## 📊 Core Dashboard Features
1. **Live Telemetry Stream:** Real-time monitoring of Temperature (°C), Barometric Pressure (hPa), and Relative Humidity (%) with automated polling loops.
2. **Anomaly & Spatial Diagnostics:** Instant visual alerts for hardware sensor spikes, accompanied by a 15km spatial cross-check to separate sensor errors from regional weather events.
3. **Explainable AI (SHAP) Visualizer:** Dynamic progress bars quantifying exact metric responsibility during anomaly scoring.
4. **Self-Healing Data Interception:** Live simulation display showing corrupted raw inputs being replaced by SciPy-reconstructed proxy values.
5. **Stream Audit History:** A rolling historical table logging recent telemetry streams, system states, and root-cause classifications.

---
