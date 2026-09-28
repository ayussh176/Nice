import React, { useState } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function LapseRiskAnalysisDesktop() {
  React.useEffect(() => {
    const cards = document.querySelectorAll('.policy-card');
    const handleClick = (e) => {
      const card = e.currentTarget;
      cards.forEach(c => {
        c.classList.remove('ring-2', 'ring-primary', 'shadow-[0_4px_6px_-1px_rgba(37,99,235,0.12)]');
        c.classList.add('shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]');
        const bar = c.querySelector('.policy-accent-bar');
        if (bar) bar.remove();
      });

      card.classList.add('ring-2', 'ring-primary', 'shadow-[0_4px_6px_-1px_rgba(37,99,235,0.12)]');
      card.classList.remove('shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]');

      if (!card.querySelector('.policy-accent-bar')) {
        const accent = document.createElement('div');
        accent.className = 'policy-accent-bar absolute top-0 left-0 bottom-0 w-1.5 bg-primary';
        card.prepend(accent);
      }
    };

    cards.forEach(card => card.addEventListener('click', handleClick));
    return () => {
      cards.forEach(card => card.removeEventListener('click', handleClick));
    };
  }, []);

  return (
    <DesktopLayout activePath="/lapse-risk-analysis">
      <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full">
<div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg">
{/*  Top Executive Metrics Bar  */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/*  Premium at Risk  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between relative overflow-hidden">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Total Premium At Risk</span>
<span className="material-symbols-outlined text-error text-[20px]">monetization_on</span>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">₹4,52,000</span>
<span className="font-label-code text-label-code text-error bg-error-container/40 px-space-xs py-space-2xs rounded text-error font-medium">18 Policies</span>
</div>
<div className="flex items-center gap-space-xs mt-space-sm text-on-surface-variant font-caption text-caption">
<span className="material-symbols-outlined text-error text-[14px]">trending_up</span>
<span>+₹68,400 projected this fiscal cycle</span>
</div>
</div>
{/*  Critical Churn Ratio  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Critical Churn Ratio</span>
<span className="material-symbols-outlined text-primary text-[20px]">crisis_alert</span>
</div>
<div className="flex items-baseline gap-space-sm">
<span className="font-metric-stat text-display text-on-surface">9.0%</span>
<div className="flex items-center gap-space-2xs font-label-code text-label-code text-error bg-error-container/30 px-space-xs py-space-2xs rounded">
<span>+1.2%</span>
<span className="text-on-surface-variant">vs 7.8% base</span>
</div>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-sm">
<div className="bg-error h-full rounded-full" style={{"width": "58%"}}></div>
</div>
</div>
{/*  Portfolio Health Spectrum  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-2xs">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Portfolio Health (200 Total)</span>
<span className="font-label-code text-label-code text-on-surface font-semibold">Q3 Cohort</span>
</div>
<div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 my-space-xs bg-surface-container">
<div className="h-full bg-tertiary-container transition-all" style={{"width": "66%"}} title="Low Risk: 132 (66%)"></div>
<div className="h-full bg-secondary transition-all" style={{"width": "25%"}} title="Medium Risk: 50 (25%)"></div>
<div className="h-full bg-error transition-all" style={{"width": "9%"}} title="Critical Risk: 18 (9%)"></div>
</div>
<div className="flex items-center justify-between font-caption text-caption">
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-tertiary-container inline-block"></span> Low 132 (66%)
          </span>
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> Med 50 (25%)
          </span>
<span className="flex items-center gap-1 text-error font-semibold">
<span className="w-2 h-2 rounded-full bg-error inline-block"></span> Crit 18 (9%)
          </span>
</div>
</div>
{/*  AI Diagnostics Status  */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
<div className="flex items-center justify-between mb-space-2xs">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Diagnostic Engine</span>
<span className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary font-label-code text-caption font-semibold px-space-xs py-space-2xs rounded-full">
<span className="material-symbols-outlined text-[12px]" style={{"fontVariationSettings": "'FILL' 1"}}>verified</span> AI Audited
          </span>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">v4.11 Neural</span>
<span className="font-caption text-caption text-on-surface-variant">Continuous Calibration</span>
</div>
<div className="text-right">
<span className="font-label-code text-label-code text-primary font-semibold">98.4%</span>
<p className="font-caption text-caption text-on-surface-variant">Precision</p>
</div>
</div>
<div className="flex items-center gap-space-xs pt-space-xs font-caption text-caption text-on-surface-variant">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
<span>Last automated batch run: 14 mins ago</span>
</div>
</div>
</div>
{/*  Explainable AI Scoring Banner  */}
<div className="bg-surface-container-low p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-base">
<div className="flex items-start gap-space-md max-w-xl">
<div className="p-space-sm bg-primary/10 rounded-xl text-primary flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[24px]">psychology</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Explainable Lapse Inference Model</span>
<span className="font-label-code text-caption bg-surface-container-highest text-on-surface-variant px-space-xs py-space-2xs rounded">0 - 100 Hazard Index</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Real-time multi-factorial scoring maps behavioral friction and commercial triggers. Policies scoring ≥75 require mandatory same-week retention intervention.
          </p>
</div>
</div>
{/*  Logic Pills  */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs w-full lg:w-auto">
<div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
<span className="font-label-code text-label-code text-error font-semibold">+25 pts</span>
<span className="font-caption text-caption text-on-surface-variant truncate">Late Payments (≥3x)</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
<span className="font-label-code text-label-code text-error font-semibold">+20 pts</span>
<span className="font-caption text-caption text-on-surface-variant truncate">Claim Rejection</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
<span className="font-label-code text-label-code text-secondary font-semibold">+15 pts</span>
<span className="font-caption text-caption text-on-surface-variant truncate">Premium Hike &gt;10%</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
<span className="font-label-code text-label-code text-secondary font-semibold">+18 pts</span>
<span className="font-caption text-caption text-on-surface-variant truncate">Inactivity (&gt;90d)</span>
</div>
</div>
</div>
{/*  Split-Pane Deep Dive Layout  */}
<div className="grid grid-cols-12 gap-space-lg items-start">
{/*  LEFT PANE: Priority Triage Queue (40% width on widescreen: col-span-12 lg:col-span-5 xl:col-span-5)  */}
<div className="col-span-12 lg:col-span-5 flex flex-col gap-space-md">
{/*  Queue Header & Filters  */}
<div className="bg-surface-container-lowest p-space-base rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Priority Triage Queue</span>
<span className="font-label-code text-caption bg-surface-container text-on-surface px-space-xs py-space-2xs rounded-full font-medium">Sorted: Risk Desc</span>
</div>
<button className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 font-caption text-caption" type="button">
<span className="material-symbols-outlined text-[16px]">tune</span>
<span>Filter</span>
</button>
</div>
{/*  Queue Filter Tabs  */}
<div className="flex items-center gap-space-2xs bg-surface-container-low p-1 rounded-lg" id="queue-tabs">
<button className="flex-1 py-space-xs text-center font-caption text-caption rounded-md text-on-surface-variant hover:text-on-surface font-medium transition-colors" type="button">
              All <span className="font-label-code">200</span>
</button>
<button className="flex-1 py-space-xs text-center font-caption text-caption rounded-md bg-surface-container-lowest text-error font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04)]" type="button">
              High Risk <span className="font-label-code">18</span>
</button>
<button className="flex-1 py-space-xs text-center font-caption text-caption rounded-md text-on-surface-variant hover:text-on-surface font-medium transition-colors" type="button">
              Med <span className="font-label-code">50</span>
</button>
<button className="flex-1 py-space-xs text-center font-caption text-caption rounded-md text-on-surface-variant hover:text-on-surface font-medium transition-colors" type="button">
              Low <span className="font-label-code">132</span>
</button>
</div>
</div>
{/*  Policy Cards List  */}
<div className="flex flex-col gap-space-sm" id="policy-list">
{/*  Card 1: Sunita Rao  */}
<div className="policy-card bg-surface-container-lowest p-space-base rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] cursor-pointer hover:shadow-md transition-all flex flex-col gap-space-sm relative overflow-hidden" data-policy="POL-3021">
<div className="flex items-start justify-between">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-body-lg text-on-surface font-semibold">Sunita Rao</span>
<span className="font-label-code text-caption text-on-surface-variant">#POL-3021</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Comprehensive Health Platinum • ₹48,000/yr</span>
</div>
<div className="flex items-center gap-1.5 bg-error-container/40 text-error px-space-xs py-space-2xs rounded-full">
<span className="material-symbols-outlined text-[14px]">local_fire_department</span>
<span className="font-label-code text-label-code font-bold">88/100</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs font-caption text-caption text-on-surface-variant">
<span className="flex items-center gap-1 text-error">
<span className="material-symbols-outlined text-[14px]">warning</span> Lapse in 6 days
              </span>
<span>2 Claim Denials • ₹0 YTD Spend</span>
</div>
</div>
{/*  Card 2: Rajesh Khanna  */}
<div className="policy-card bg-surface-container-lowest p-space-base rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] cursor-pointer hover:shadow-md transition-all flex flex-col gap-space-sm relative overflow-hidden" data-policy="POL-2094">
<div className="flex items-start justify-between">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-body-lg text-on-surface font-semibold">Rajesh Khanna</span>
<span className="font-label-code text-caption text-on-surface-variant">#POL-2094</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Family Motor Floater Plus • ₹24,500/yr</span>
</div>
<div className="flex items-center gap-1.5 bg-error-container/40 text-error px-space-xs py-space-2xs rounded-full">
<span className="material-symbols-outlined text-[14px]">report</span>
<span className="font-label-code text-label-code font-bold">85/100</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs font-caption text-caption text-on-surface-variant">
<span className="flex items-center gap-1 text-error">
<span className="material-symbols-outlined text-[14px]">warning</span> Lapse in 9 days
              </span>
<span>Unresolved Dispute • Escalated</span>
</div>
</div>
{/*  Card 3: Rahul Sharma (ACTIVE / SELECTED)  */}
<div className="policy-card bg-surface-container-lowest p-space-base rounded-xl shadow-[0_4px_6px_-1px_rgba(37,99,235,0.12)] cursor-pointer ring-2 ring-primary transition-all flex flex-col gap-space-sm relative overflow-hidden" data-policy="POL-1082">
<div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
<div className="flex items-start justify-between pl-space-xs">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-body-lg text-on-surface font-bold">Rahul Sharma</span>
<span className="font-label-code text-caption text-primary font-semibold">#POL-1082</span>
<span className="bg-primary/10 text-primary font-caption text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Inspecting</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Executive Term &amp; Critical Care • ₹32,000/yr</span>
</div>
<div className="flex items-center gap-1.5 bg-error-container/60 text-error px-space-xs py-space-2xs rounded-full">
<span className="material-symbols-outlined text-[14px]">priority_high</span>
<span className="font-label-code text-label-code font-bold">78/100</span>
</div>
</div>
<div className="flex items-center justify-between pl-space-xs pt-space-xs font-caption text-caption text-on-surface-variant">
<span className="flex items-center gap-1 text-error font-medium">
<span className="material-symbols-outlined text-[14px]">event_busy</span> Lapse in 12 days
              </span>
<span>4 Critical Triggers Active</span>
</div>
</div>
{/*  Card 4: Vikram Malhotra  */}
<div className="policy-card bg-surface-container-lowest p-space-base rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] cursor-pointer hover:shadow-md transition-all flex flex-col gap-space-sm relative overflow-hidden" data-policy="POL-4412">
<div className="flex items-start justify-between">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-body-lg text-on-surface font-semibold">Vikram Malhotra</span>
<span className="font-label-code text-caption text-on-surface-variant">#POL-4412</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Urban Life Guard Basic • ₹18,200/yr</span>
</div>
<div className="flex items-center gap-1.5 bg-surface-container-high text-on-surface px-space-xs py-space-2xs rounded-full">
<span className="material-symbols-outlined text-[14px] text-secondary">info</span>
<span className="font-label-code text-label-code font-bold">54/100</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs font-caption text-caption text-on-surface-variant">
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[14px]">schedule</span> Lapse in 24 days
              </span>
<span>Payment Reminder Read</span>
</div>
</div>
{/*  Card 5: Ananya Sengupta  */}
<div className="policy-card bg-surface-container-lowest p-space-base rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] cursor-pointer hover:shadow-md transition-all flex flex-col gap-space-sm relative overflow-hidden" data-policy="POL-5920">
<div className="flex items-start justify-between">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-body-lg text-on-surface font-semibold">Ananya Sengupta</span>
<span className="font-label-code text-caption text-on-surface-variant">#POL-5920</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Global Shield Premier • ₹52,400/yr</span>
</div>
<div className="flex items-center gap-1.5 bg-tertiary-container/10 text-tertiary px-space-xs py-space-2xs rounded-full">
<span className="material-symbols-outlined text-[14px]">verified_user</span>
<span className="font-label-code text-label-code font-bold">22/100</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs font-caption text-caption text-on-surface-variant">
<span className="flex items-center gap-1 text-tertiary font-medium">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Auto-Debit Enabled
              </span>
<span>Lapse in 38 days</span>
</div>
</div>
</div>
</div>
{/*  RIGHT PANE: Diagnostic Inspector (60% width on widescreen: col-span-12 lg:col-span-7 xl:col-span-7)  */}
<div className="col-span-12 lg:col-span-7 flex flex-col gap-space-base">
{/*  Inspector Core Container  */}
<div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
{/*  Inspector Header Bar  */}
<div className="p-space-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-base">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md font-bold">
                RS
              </div>
<div className="flex flex-col">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-md text-headline-md text-on-surface font-bold">Rahul Sharma</span>
<span className="font-label-code text-body-sm text-primary bg-primary/10 px-2 py-0.5 rounded font-semibold">#POL-1082</span>
<span className="font-caption text-caption bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded">Active 4 Years</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Executive Term &amp; Critical Care • Annual Premium ₹32,000 • Renewal Date: Oct 28, 2024</span>
</div>
</div>
<div className="flex items-center gap-space-xs self-end sm:self-center">
<span className="font-caption text-caption text-on-surface-variant">Agent:</span>
<span className="font-caption text-caption text-on-surface font-semibold">K. Iyer (#AG-404)</span>
</div>
</div>
<div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg">
{/*  Risk Gauge & Primary Score Banner  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-base items-center bg-surface-container-low p-space-lg rounded-xl">
{/*  Circular Gauge (Inline SVG Chart)  */}
<div className="md:col-span-5 flex flex-col items-center justify-center">
<div className="relative w-44 h-44 flex items-center justify-center">
<svg className="w-full h-full -rotate-90 transform" viewbox="0 0 120 120">
{/*  Background Circle  */}
<circle className="text-surface-container-high" cx="60" cy="60" fill="none" r="48" stroke="currentColor" strokeWidth="10"></circle>
{/*  Foreground Risk Arc (78% of circumference: 2 * pi * 48 = 301.6)  */}
{/*  78% = 235.2 stroke-dasharray  */}
<circle className="text-error" cx="60" cy="60" fill="none" r="48" stroke="currentColor" stroke-dasharray="301.6" stroke-dashoffset="66.35" strokeLinecap="round" strokeWidth="10"></circle>
</svg>
<div className="absolute flex flex-col items-center justify-center text-center">
<span className="font-metric-stat text-display text-on-surface leading-none font-bold">78</span>
<span className="font-label-code text-caption text-on-surface-variant uppercase tracking-wider font-semibold">/ 100 Index</span>
<span className="font-caption text-[10px] text-error font-bold uppercase tracking-widest mt-0.5">High Hazard</span>
</div>
</div>
<div className="flex items-center gap-1.5 mt-space-xs font-caption text-caption text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span>Confidence Rating: 94.2%</span>
</div>
</div>
{/*  Contextual Diagnostic Summary  */}
<div className="md:col-span-7 flex flex-col justify-center gap-space-sm pl-0 md:pl-space-base">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-[20px]">warning</span>
<span className="font-headline-sm text-headline-sm text-error font-bold">High Lapse Hazard Detected</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">
                  Customer exhibits behavioral divergence spanning multiple friction vectors. The convergence of an unsettled hospital claim with recurring payment friction escalates customer non-renewal likelihood to <strong>78% within 12 days</strong>.
                </p>
<div className="grid grid-cols-2 gap-space-sm pt-space-xs font-caption text-caption">
<div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
<span className="text-on-surface-variant">Baseline Risk</span>
<span className="font-metric-stat text-body-lg text-on-surface font-semibold">14 / 100</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
<span className="text-on-surface-variant">Variance Escalation</span>
<span className="font-metric-stat text-body-lg text-error font-semibold">+64 Pts Spike</span>
</div>
</div>
</div>
</div>
{/*  Itemized Attribution Factors Breakdown Table  */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Attribution Factors &amp; Score Weightings</span>
<span className="font-label-code text-caption bg-surface-container text-on-surface-variant px-space-xs py-space-2xs rounded">4 Triggers</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Model impact weights calibrated</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption uppercase tracking-wider">
<th className="py-space-sm px-space-base rounded-l-lg">Risk Factor Vector</th>
<th className="py-space-sm px-space-base">Observed Evidence</th>
<th className="py-space-sm px-space-base text-right">Points Added</th>
<th className="py-space-sm px-space-base rounded-r-lg text-right">Severity</th>
</tr>
</thead>
<tbody className="divide-y divide-transparent">
{/*  Factor 1  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-error text-[18px]">credit_card_off</span>
<span className="font-headline-sm text-body-md text-on-surface font-semibold">Late Payment Frequency</span>
</div>
</td>
<td className="py-space-md px-space-base text-on-surface-variant">
                        3 late premium installments in past 12 mos
                      </td>
<td className="py-space-md px-space-base text-right font-metric-stat text-body-md text-error font-semibold">
                        +25 pts
                      </td>
<td className="py-space-md px-space-base text-right">
<span className="bg-error-container/40 text-error font-caption text-[11px] font-bold px-2 py-0.5 rounded-full">Severe</span>
</td>
</tr>
{/*  Factor 2  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-error text-[18px]">cancel</span>
<span className="font-headline-sm text-body-md text-on-surface font-semibold">Claim Rejection Dispute</span>
</div>
</td>
<td className="py-space-md px-space-base text-on-surface-variant">
                        Hospitalization Claim <span className="font-label-code text-on-surface font-semibold">#CLM-901</span> rejected for documentation
                      </td>
<td className="py-space-md px-space-base text-right font-metric-stat text-body-md text-error font-semibold">
                        +20 pts
                      </td>
<td className="py-space-md px-space-base text-right">
<span className="bg-error-container/40 text-error font-caption text-[11px] font-bold px-2 py-0.5 rounded-full">High Hazard</span>
</td>
</tr>
{/*  Factor 3  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[18px]">price_change</span>
<span className="font-headline-sm text-body-md text-on-surface font-semibold">Premium Inflation Spike</span>
</div>
</td>
<td className="py-space-md px-space-base text-on-surface-variant">
                        12% increase year-over-year adjustments
                      </td>
<td className="py-space-md px-space-base text-right font-metric-stat text-body-md text-secondary font-semibold">
                        +15 pts
                      </td>
<td className="py-space-md px-space-base text-right">
<span className="bg-surface-container text-on-surface-variant font-caption text-[11px] font-bold px-2 py-0.5 rounded-full">Moderate</span>
</td>
</tr>
{/*  Factor 4  */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[18px]">person_off</span>
<span className="font-headline-sm text-body-md text-on-surface font-semibold">Portal Engagement Drop</span>
</div>
</td>
<td className="py-space-md px-space-base text-on-surface-variant">
                        Zero member portal sessions recorded in 118 days
                      </td>
<td className="py-space-md px-space-base text-right font-metric-stat text-body-md text-secondary font-semibold">
                        +18 pts
                      </td>
<td className="py-space-md px-space-base text-right">
<span className="bg-surface-container text-on-surface-variant font-caption text-[11px] font-bold px-2 py-0.5 rounded-full">Moderate</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Recommended AI Intervention Strategy  */}
<div className="bg-primary/5 p-space-lg rounded-xl flex flex-col gap-space-md relative overflow-hidden">
<div className="flex items-start justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
</div>
<div>
<span className="font-headline-sm text-body-lg text-on-surface font-bold">Prescribed Intervention Workflow</span>
<span className="block font-caption text-caption text-on-surface-variant">Algorithmically generated playbook to reverse attrition risk</span>
</div>
</div>
<span className="bg-tertiary-container/10 text-tertiary font-label-code text-caption px-2 py-0.5 rounded font-bold">
                  82% Retention Probability If Deployed
                </span>
</div>
{/*  Recommendation Tiles  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-xl flex items-start gap-space-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
<div className="p-space-xs bg-primary/10 text-primary rounded-lg">
<span className="material-symbols-outlined text-[20px]">call</span>
</div>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Recommended Contact Channel</span>
<span className="font-headline-sm text-body-md text-on-surface font-bold">Phone Call by Senior Specialist</span>
<p className="font-caption text-caption text-on-surface-variant mt-0.5">Empathetic resolution required for Claim #CLM-901 prior to renewal pitch.</p>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl flex items-start gap-space-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
<div className="p-space-xs bg-tertiary/10 text-tertiary rounded-lg">
<span className="material-symbols-outlined text-[20px]">loyalty</span>
</div>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Approved Counter-Offer</span>
<span className="font-headline-sm text-body-md text-on-surface font-bold">12% Loyalty Discount Package</span>
<p className="font-caption text-caption text-on-surface-variant mt-0.5">Neutralizes the 12% inflation spike while attaching free tele-consult rider.</p>
</div>
</div>
</div>
{/*  Action Buttons Row  */}
<div className="flex flex-wrap items-center justify-end gap-space-sm pt-space-xs">
<button className="px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-body-sm font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" type="button">
<span className="material-symbols-outlined text-[18px]">folder_shared</span>
<span>View Full Dossier</span>
</button>
<button className="px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-primary hover:bg-primary/5 transition-colors font-body-sm font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" type="button">
<span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
<span>Schedule Call</span>
</button>
<button className="px-space-lg py-space-sm rounded-xl bg-primary-container text-on-primary hover:bg-primary transition-all font-body-sm font-semibold flex items-center gap-2 shadow-[0_2px_4px_rgba(37,99,235,0.2)] active:scale-[0.98]" type="button">
<span className="material-symbols-outlined text-[18px]">send</span>
<span>Deploy Retention Offer</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
    </DesktopLayout>
  );
}
