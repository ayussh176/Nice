import React from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function RetentionDashboardDesktop() {
  return (
    <DesktopLayout activePath="/">
      <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full">
<div className="p-space-lg space-y-space-lg max-w-[1720px] mx-auto w-full">
<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-base shadow-sm">
<div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base relative z-10">
<div className="flex items-center gap-space-md min-w-0">
<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
<span className="material-symbols-outlined text-[24px]">route</span>
</div>
<div className="min-w-0">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="font-headline-sm text-headline-sm text-on-surface">Demo Sandbox Guided Journey</span>
<span className="inline-flex items-center gap-1 rounded-full bg-tertiary/10 px-2 py-0.5 text-caption font-caption text-tertiary">
<span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Live Telemetry Active
              </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Standard operating protocol for high-loss mitigation &amp; automated policy re-underwriting.</p>
</div>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm w-full xl:w-auto">
<div className="flex items-center gap-space-xs rounded-xl bg-surface-container-low px-space-md py-space-xs transition-colors hover:bg-surface-container">
<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-error text-on-error font-label-code text-[11px] font-bold">1</span>
<div className="min-w-0">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant block">Phase 1</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface truncate block">High Risk Triage</span>
</div>
</div>
<div className="flex items-center gap-space-xs rounded-xl bg-surface-container-low px-space-md py-space-xs transition-colors hover:bg-surface-container">
<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-label-code text-[11px] font-bold">2</span>
<div className="min-w-0">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant block">Phase 2</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface truncate block">Audit Dossier</span>
</div>
</div>
<div className="flex items-center gap-space-xs rounded-xl bg-surface-container-low px-space-md py-space-xs transition-colors hover:bg-surface-container">
<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary font-label-code text-[11px] font-bold">3</span>
<div className="min-w-0">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant block">Phase 3</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface truncate block">Rule Offer Matrix</span>
</div>
</div>
<div className="flex items-center gap-space-xs rounded-xl bg-surface-container-low px-space-md py-space-xs transition-colors hover:bg-surface-container">
<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container font-label-code text-[11px] font-bold">4</span>
<div className="min-w-0">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant block">Phase 4</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface truncate block">Omni Dispatch</span>
</div>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
<div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Total Portfolio</span>
<span className="material-symbols-outlined text-outline text-[18px]">folder_shared</span>
</div>
<div className="my-space-xs">
<span className="font-metric-stat text-[26px] text-on-surface">200</span>
<span className="font-caption text-caption text-on-surface-variant block mt-0.5">Policies Underwritten</span>
</div>
<div className="flex items-center gap-1.5 pt-space-xs bg-surface-container-lowest">
<span className="h-2 w-2 rounded-full bg-tertiary"></span>
<span className="font-caption text-caption text-tertiary font-semibold">99.4% active sync</span>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase tracking-wider text-error">Premium At Risk</span>
<span className="material-symbols-outlined text-error text-[18px]">warning</span>
</div>
<div className="my-space-xs">
<span className="font-metric-stat text-[24px] text-error font-bold">₹4,52,000</span>
<span className="font-caption text-caption text-on-surface-variant block mt-0.5">Estimated Loss Exp.</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant">
<span className="font-label-code text-[12px] font-semibold text-error">18</span>
<span className="font-caption text-caption">critical accounts flag</span>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Due This Month</span>
<span className="material-symbols-outlined text-primary text-[18px]">event_repeat</span>
</div>
<div className="my-space-xs">
<span className="font-metric-stat text-[26px] text-on-surface">35</span>
<span className="font-caption text-caption text-on-surface-variant block mt-0.5">Maturity Horizon</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant">
<span className="font-caption text-caption">Volume share</span>
<span className="font-label-code text-label-code text-primary font-semibold">17.5% book</span>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Renewal Rate</span>
<span className="material-symbols-outlined text-tertiary text-[18px]">query_stats</span>
</div>
<div className="my-space-xs">
<span className="font-metric-stat text-[26px] text-on-surface">87.4%</span>
<span className="font-caption text-caption text-on-surface-variant block mt-0.5">Rolling 30D Window</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant">
<span className="font-caption text-caption">Target: 90.0%</span>
<span className="font-label-code text-[12px] text-error font-medium">-2.6% gap</span>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Outreach Sent</span>
<span className="material-symbols-outlined text-primary text-[18px]">forward_to_inbox</span>
</div>
<div className="my-space-xs">
<div className="flex items-baseline gap-1">
<span className="font-metric-stat text-[24px] text-on-surface">14</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">/ 35 due</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width": "40%"}}></div>
</div>
</div>
<div className="flex items-center justify-between text-on-surface-variant">
<span className="font-caption text-caption">40% completed</span>
<span className="font-label-code text-[11px] text-on-surface-variant font-medium">21 pending</span>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Lapsed MTD</span>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">cancel_schedule_send</span>
</div>
<div className="my-space-xs">
<span className="font-metric-stat text-[26px] text-on-surface">12</span>
<span className="font-caption text-caption text-on-surface-variant block mt-0.5">Definitive Expirations</span>
</div>
<div className="flex items-center justify-between bg-surface-container-low px-2 py-1 rounded-md">
<span className="font-caption text-[11px] text-tertiary font-medium">₹1.42L avoided</span>
<span className="font-label-code text-[11px] text-tertiary font-bold">73% saved</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
<div className="lg:col-span-8 space-y-space-lg">
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-base">
<div>
<span className="font-headline-sm text-headline-sm text-on-surface">Renewal Trajectory Engine</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Monthly historical tracking of reclaimed policies versus realized unmitigated lapses.</p>
</div>
<div className="flex items-center gap-space-md bg-surface-container-low px-space-md py-1 rounded-xl">
<div className="flex items-center gap-1.5">
<span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
<span className="font-caption text-caption text-on-surface">Saved Volume</span>
</div>
<div className="flex items-center gap-1.5">
<span className="h-2.5 w-2.5 rounded-full bg-error"></span>
<span className="font-caption text-caption text-on-surface">Lapsed Loss</span>
</div>
</div>
</div>
<div className="w-full h-56 pt-2">
<svg className="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 650 180">
<line stroke="#E2E8F0" stroke-dasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="30" y2="30"></line>
<line stroke="#E2E8F0" stroke-dasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="80" y2="80"></line>
<line stroke="#E2E8F0" stroke-dasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="130" y2="130"></line>
<defs>
<lineargradient id="primaryAreaGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#2563EB" stop-opacity="0.18"></stop>
<stop offset="100%" stop-color="#2563EB" stop-opacity="0"></stop>
</lineargradient>
</defs>
<path d="M 10 120 Q 120 100, 220 85 T 430 40 T 640 25 L 640 160 L 10 160 Z" fill="url(#primaryAreaGrad)"></path>
<path d="M 10 120 Q 120 100, 220 85 T 430 40 T 640 25" fill="none" stroke="#2563EB" strokeLinecap="round" strokeWidth="3"></path>
<path d="M 10 70 Q 120 85, 220 100 T 430 135 T 640 148" fill="none" stroke="#BA1A1A" stroke-dasharray="3 3" strokeLinecap="round" strokeWidth="2.5"></path>
<circle cx="10" cy="120" fill="#2563EB" r="4"></circle>
<circle cx="220" cy="85" fill="#2563EB" r="4"></circle>
<circle cx="430" cy="40" fill="#2563EB" r="4"></circle>
<circle cx="640" cy="25" fill="#2563EB" r="5"></circle>
<circle cx="640" cy="148" fill="#BA1A1A" r="4"></circle>
</svg>
</div>
<div className="grid grid-cols-7 pt-space-xs text-center font-label-code text-[11px] text-on-surface-variant">
<span>Nov</span>
<span>Dec</span>
<span>Jan</span>
<span>Feb</span>
<span>Mar</span>
<span>Apr</span>
<span className="font-bold text-primary">May (Proj.)</span>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
<div className="flex items-center justify-between mb-space-base">
<div>
<span className="font-headline-sm text-headline-sm text-on-surface">Premium at Risk by Line of Business</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Segmented exposure requiring customized retention discount protocols.</p>
</div>
<span className="font-label-code text-label-code text-on-surface-variant bg-surface-container-low px-space-sm py-1 rounded-lg">₹4.52L Combined</span>
</div>
<div className="space-y-space-base">
<div>
<div className="flex justify-between items-center mb-1.5 font-body-sm text-body-sm">
<span className="font-semibold text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-primary">directions_car</span> Motor Comprehensive
                </span>
<div className="flex items-center gap-space-sm">
<span className="font-label-code text-label-code font-bold text-on-surface">₹1,80,000</span>
<span className="font-caption text-caption text-on-surface-variant w-10 text-right">39.8%</span>
</div>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width": "39.8%"}}></div>
</div>
</div>
<div>
<div className="flex justify-between items-center mb-1.5 font-body-sm text-body-sm">
<span className="font-semibold text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-tertiary">health_and_safety</span> Health Mediclaim
                </span>
<div className="flex items-center gap-space-sm">
<span className="font-label-code text-label-code font-bold text-on-surface">₹1,60,000</span>
<span className="font-caption text-caption text-on-surface-variant w-10 text-right">35.4%</span>
</div>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width": "35.4%"}}></div>
</div>
</div>
<div>
<div className="flex justify-between items-center mb-1.5 font-body-sm text-body-sm">
<span className="font-semibold text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">family_restroom</span> Life Term Secure
                </span>
<div className="flex items-center gap-space-sm">
<span className="font-label-code text-label-code font-bold text-on-surface">₹75,000</span>
<span className="font-caption text-caption text-on-surface-variant w-10 text-right">16.6%</span>
</div>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width": "16.6%"}}></div>
</div>
</div>
<div>
<div className="flex justify-between items-center mb-1.5 font-body-sm text-body-sm">
<span className="font-semibold text-on-surface flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">roofing</span> Home &amp; Assets Commercial
                </span>
<div className="flex items-center gap-space-sm">
<span className="font-label-code text-label-code font-bold text-on-surface">₹37,000</span>
<span className="font-caption text-caption text-on-surface-variant w-10 text-right">8.2%</span>
</div>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-outline h-full rounded-full" style={{"width": "8.2%"}}></div>
</div>
</div>
</div>
</div>
</div>
<div className="lg:col-span-4 space-y-space-lg">
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
<div className="flex items-center justify-between mb-space-base">
<div>
<span className="font-headline-sm text-headline-sm text-on-surface">Portfolio Risk Segments</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Predictive churn categorization</p>
</div>
<span className="material-symbols-outlined text-outline text-[20px]">pie_chart</span>
</div>
<div className="flex items-center justify-center py-space-sm relative">
<svg className="w-44 h-44 -rotate-90" viewbox="0 0 120 120">
<circle cx="60" cy="60" fill="transparent" r="46" stroke="#E2E8F0" strokeWidth="12"></circle>
<circle cx="60" cy="60" fill="transparent" r="46" stroke="#007D55" stroke-dasharray="289" stroke-dashoffset="98" strokeWidth="12"></circle>
<circle cx="60" cy="60" fill="transparent" r="46" stroke="#565E74" stroke-dasharray="289" stroke-dashoffset="216" strokeLinecap="round" strokeWidth="12"></circle>
<circle cx="60" cy="60" fill="transparent" r="46" stroke="#BA1A1A" stroke-dasharray="289" stroke-dashoffset="263" strokeLinecap="round" strokeWidth="12"></circle>
</svg>
<div className="absolute flex flex-col items-center justify-center text-center">
<span className="font-caption text-caption uppercase text-on-surface-variant">Active Book</span>
<span className="font-headline-lg text-headline-lg text-on-surface font-bold leading-none">200</span>
<span className="font-caption text-caption text-on-surface-variant">Policies</span>
</div>
</div>
<div className="space-y-space-xs mt-space-sm">
<div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-low">
<div className="flex items-center gap-space-xs">
<span className="h-3 w-3 rounded-full bg-tertiary-container"></span>
<span className="font-body-sm text-body-sm font-medium text-on-surface">Low Risk (Standard)</span>
</div>
<div className="flex items-center gap-space-sm font-label-code text-label-code">
<span className="font-bold text-on-surface">132</span>
<span className="text-on-surface-variant text-[11px]">66%</span>
</div>
</div>
<div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-low">
<div className="flex items-center gap-space-xs">
<span className="h-3 w-3 rounded-full bg-secondary"></span>
<span className="font-body-sm text-body-sm font-medium text-on-surface">Medium Risk (Watchlist)</span>
</div>
<div className="flex items-center gap-space-sm font-label-code text-label-code">
<span className="font-bold text-on-surface">50</span>
<span className="text-on-surface-variant text-[11px]">25%</span>
</div>
</div>
<div className="flex items-center justify-between p-space-xs rounded-lg bg-error-container/40">
<div className="flex items-center gap-space-xs">
<span className="h-3 w-3 rounded-full bg-error"></span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface">High Risk (At-Lapse)</span>
</div>
<div className="flex items-center gap-space-sm font-label-code text-label-code">
<span className="font-bold text-error">18</span>
<span className="text-error text-[11px]">9%</span>
</div>
</div>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-headline-sm text-headline-sm text-on-surface">Intervention Queue</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-caption font-label-code bg-error/10 text-error font-semibold">Priority SLA</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Escalated triggers requiring underwriter concessions within 24 hours.</p>
<div className="space-y-space-sm">
<div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
<div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-error text-[18px]">emergency</span>
<span className="font-body-sm text-body-sm font-bold text-on-surface">Critical &lt; 7 Days</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">5 policies · ₹1.84L Exposure</span>
</div>
<button className="h-9 px-space-md bg-error text-on-error rounded-xl font-body-sm text-body-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
                Execute SLA
              </button>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
<div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">notification_important</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface">Elevated &lt; 14 Days</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">12 policies · Pending outreach</span>
</div>
<button className="h-9 px-space-md bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold rounded-xl hover:bg-surface-container-high transition-colors">
                Batch View
              </button>
</div>
</div>
</div>
</div>
</div>
<div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
<div className="p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-base bg-surface-container-lowest">
<div>
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">High-Risk Interventions Required</span>
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">18 Accounts</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Actionable workbench displaying active lapse probabilities derived from claim disputes and telematics friction.</p>
</div>
<div className="flex items-center gap-space-sm">
<button className="h-10 px-space-md bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm font-medium hover:bg-surface-container transition-colors flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px]">filter_list</span> Filter Triggers
          </button>
<button className="h-10 px-space-md bg-primary-container text-on-primary rounded-xl font-body-sm text-body-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px]">auto_fix_high</span> Auto-Dispatch All (18)
          </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption uppercase tracking-wider">
<th className="py-space-sm px-space-base">Customer &amp; Policy</th>
<th className="py-space-sm px-space-base">LOB Segment</th>
<th className="py-space-sm px-space-base">Renewal Due</th>
<th className="py-space-sm px-space-base">Annual Premium</th>
<th className="py-space-sm px-space-base">Risk Probability</th>
<th className="py-space-sm px-space-base">Primary Red Flag Trigger</th>
<th className="py-space-sm px-space-base text-right">Immediate Action</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<div className="h-9 w-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm text-[13px]">
                    RS
                  </div>
<div>
<span className="font-semibold text-on-surface block">Rahul Sharma</span>
<span className="font-label-code text-[11px] text-on-surface-variant">POL-8842-MTR</span>
</div>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-caption text-caption text-on-surface">
<span className="material-symbols-outlined text-[13px] text-primary">directions_car</span> Motor Comp
                </span>
</td>
<td className="py-space-md px-space-base">
<span className="font-label-code text-label-code text-on-surface font-semibold block">04 Nov 2024</span>
<span className="font-caption text-caption text-error font-medium">In 2 Days</span>
</td>
<td className="py-space-md px-space-base font-label-code text-label-code font-bold text-on-surface">
                ₹38,450
              </td>
<td className="py-space-md px-space-base">
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[14px]">local_fire_department</span> 78/100
                  </span>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 text-on-surface font-medium">
<span className="material-symbols-outlined text-[16px] text-error">gavel</span> Claim repudiation dispute (Q2)
                </span>
</td>
<td className="py-space-md px-space-base text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-md h-8 rounded-lg bg-primary text-on-primary font-caption text-caption font-semibold shadow-sm hover:opacity-90 transition-opacity">
                    Retain Offer
                  </button>
<button className="px-space-sm h-8 rounded-lg bg-surface-container-high text-on-surface-variant font-caption text-caption font-semibold hover:bg-surface-container transition-colors">
                    Dossier
                  </button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<div className="h-9 w-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm text-[13px]">
                    PP
                  </div>
<div>
<span className="font-semibold text-on-surface block">Priya Patel</span>
<span className="font-label-code text-[11px] text-on-surface-variant">POL-9201-HLT</span>
</div>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-caption text-caption text-on-surface">
<span className="material-symbols-outlined text-[13px] text-tertiary">health_and_safety</span> Mediclaim Plus
                </span>
</td>
<td className="py-space-md px-space-base">
<span className="font-label-code text-label-code text-on-surface font-semibold block">07 Nov 2024</span>
<span className="font-caption text-caption text-error font-medium">In 5 Days</span>
</td>
<td className="py-space-md px-space-base font-label-code text-label-code font-bold text-on-surface">
                ₹52,000
              </td>
<td className="py-space-md px-space-base">
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[14px]">local_fire_department</span> 82/100
                  </span>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 text-on-surface font-medium">
<span className="material-symbols-outlined text-[16px] text-error">price_change</span> 18% rate revision shock
                </span>
</td>
<td className="py-space-md px-space-base text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-md h-8 rounded-lg bg-primary text-on-primary font-caption text-caption font-semibold shadow-sm hover:opacity-90 transition-opacity">
                    Dispatch Nudge
                  </button>
<button className="px-space-sm h-8 rounded-lg bg-surface-container-high text-on-surface-variant font-caption text-caption font-semibold hover:bg-surface-container transition-colors">
                    Dossier
                  </button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<div className="h-9 w-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm text-[13px]">
                    AV
                  </div>
<div>
<span className="font-semibold text-on-surface block">Amit Verma</span>
<span className="font-label-code text-[11px] text-on-surface-variant">POL-3490-LFE</span>
</div>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-caption text-caption text-on-surface">
<span className="material-symbols-outlined text-[13px] text-secondary">family_restroom</span> Term Shield 20
                </span>
</td>
<td className="py-space-md px-space-base">
<span className="font-label-code text-label-code text-on-surface font-semibold block">12 Nov 2024</span>
<span className="font-caption text-caption text-on-surface-variant font-medium">In 10 Days</span>
</td>
<td className="py-space-md px-space-base font-label-code text-label-code font-bold text-on-surface">
                ₹64,200
              </td>
<td className="py-space-md px-space-base">
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[14px]">local_fire_department</span> 74/100
                  </span>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 text-on-surface font-medium">
<span className="material-symbols-outlined text-[16px] text-secondary">unsubscribe</span> Unopened WhatsApp &amp; SMS notifications (3x)
                </span>
</td>
<td className="py-space-md px-space-base text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-md h-8 rounded-lg bg-primary text-on-primary font-caption text-caption font-semibold shadow-sm hover:opacity-90 transition-opacity">
                    Retain Offer
                  </button>
<button className="px-space-sm h-8 rounded-lg bg-surface-container-high text-on-surface-variant font-caption text-caption font-semibold hover:bg-surface-container transition-colors">
                    Dossier
                  </button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-space-md px-space-base">
<div className="flex items-center gap-space-sm">
<div className="h-9 w-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm text-[13px]">
                    NM
                  </div>
<div>
<span className="font-semibold text-on-surface block">Nandini Mukhopadhyay</span>
<span className="font-label-code text-[11px] text-on-surface-variant">POL-6731-MTR</span>
</div>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-caption text-caption text-on-surface">
<span className="material-symbols-outlined text-[13px] text-primary">directions_car</span> Private EV Fleet
                </span>
</td>
<td className="py-space-md px-space-base">
<span className="font-label-code text-label-code text-on-surface font-semibold block">14 Nov 2024</span>
<span className="font-caption text-caption text-on-surface-variant font-medium">In 12 Days</span>
</td>
<td className="py-space-md px-space-base font-label-code text-label-code font-bold text-on-surface">
                ₹89,000
              </td>
<td className="py-space-md px-space-base">
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[14px]">local_fire_department</span> 88/100
                  </span>
</div>
</td>
<td className="py-space-md px-space-base">
<span className="inline-flex items-center gap-1 text-on-surface font-medium">
<span className="material-symbols-outlined text-[16px] text-error">credit_card_off</span> Recurring Auto-Debit Mandate Failed
                </span>
</td>
<td className="py-space-md px-space-base text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-md h-8 rounded-lg bg-primary text-on-primary font-caption text-caption font-semibold shadow-sm hover:opacity-90 transition-opacity">
                    Trigger Mandate
                  </button>
<button className="px-space-sm h-8 rounded-lg bg-surface-container-high text-on-surface-variant font-caption text-caption font-semibold hover:bg-surface-container transition-colors">
                    Dossier
                  </button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-space-base bg-surface-container-lowest flex items-center justify-between font-caption text-caption text-on-surface-variant">
<span>Showing 4 of 18 High-Risk Policyholders requiring action</span>
<div className="flex items-center gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50" disabled="">Previous</button>
<span className="px-2 py-1 font-label-code text-primary font-bold">Page 1 of 5</span>
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">Next</button>
</div>
</div>
</div>
</div>
</div></main>
    </DesktopLayout>
  );
}
