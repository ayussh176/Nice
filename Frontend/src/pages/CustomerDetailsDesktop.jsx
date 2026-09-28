import React, { useState } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function CustomerDetailsDesktop() {
  React.useEffect(() => {
    const tabs = ['timeline', 'ledger', 'claims', 'documents'];
    tabs.forEach(tab => {
      const btn = document.getElementById('tab-' + tab);
      if (btn) {
        btn.onclick = () => {
          tabs.forEach(t => {
            const b = document.getElementById('tab-' + t);
            const c = document.getElementById('content-' + t);
            if (!b || !c) return;
            if (t === tab) {
              b.className = "pb-space-sm px-space-md font-headline-sm text-body-md font-semibold text-primary border-b-2 border-primary transition-all flex items-center gap-space-xs whitespace-nowrap";
              c.classList.remove('hidden');
              c.classList.add('flex');
            } else {
              b.className = "pb-space-sm px-space-md font-body-md text-body-md font-normal text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-space-xs whitespace-nowrap";
              c.classList.add('hidden');
              c.classList.remove('flex');
            }
          });
        };
      }
    });

    const customerRows = ['rahul', 'sunita', 'amit', 'priya', 'rajesh', 'vikram'];
    const customerNames = {
      'rahul': 'Rahul Sharma (#POL-1082)',
      'sunita': 'Sunita Rao (#POL-1044)',
      'amit': 'Amit Verma (#POL-1102)',
      'priya': 'Priya Patel (#POL-1104)',
      'rajesh': 'Rajesh Khanna (#POL-1205)',
      'vikram': 'Vikram Malhotra (#POL-1192)'
    };

    customerRows.forEach(id => {
      const el = document.getElementById('row-' + id);
      if (el) {
        el.onclick = () => {
          customerRows.forEach(r => {
            const rowEl = document.getElementById('row-' + r);
            if (rowEl) {
              rowEl.className = r === id
                ? "bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-l-4 border-l-primary group"
                : "hover:bg-surface-container-low/60 transition-colors cursor-pointer border-l-4 border-l-transparent group";
            }
          });
          triggerToast('Loaded detailed customer retention dossier for ' + (customerNames[id] || id));
        };
      }
    });

    function triggerToast(message) {
      const toast = document.getElementById('toastNotification');
      const toastMsg = document.getElementById('toastMessage');
      if (!toast || !toastMsg) return;
      toastMsg.innerText = message;
      toast.classList.remove('opacity-0', 'translate-y-[-100px]', 'pointer-events-none');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-100px]', 'pointer-events-none');
        toast.classList.remove('opacity-100', 'translate-y-0');
      }, 4200);
    }
  }, []);

  return (
    <DesktopLayout activePath="/customer-details">
      {/*  Interactive Feedback Toast  */}
<div className="fixed top-20 right-8 z-50 transform translate-y-[-100px] opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-space-sm px-space-lg py-space-md rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl border border-outline-variant/30" id="toastNotification">
<span className="material-symbols-outlined text-tertiary-fixed text-[22px]">check_circle</span>
<div className="flex flex-col">
<span className="font-headline-sm text-body-md text-inverse-on-surface font-semibold" id="toastTitle">Intervention Deployed</span>
<span className="font-caption text-caption text-inverse-on-surface/80" id="toastMessage">12% Retention discount voucher generated for #POL-1082</span>
</div>
</div>
      <main className="w-full pt-16 bg-surface min-h-screen">
<div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg max-w-[1680px] mx-auto w-full">
{/*  Top Breadcrumb & Status Telemetry  */}
<div className="flex items-center justify-between flex-wrap gap-space-sm">
<nav className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
<span className="hover:text-primary cursor-pointer transition-colors">Customer Directory</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="hover:text-primary cursor-pointer transition-colors">Retention Workbench</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-on-surface font-semibold bg-surface-container px-space-xs py-space-2xs rounded-lg">Roster &amp; Detailed Dossier</span>
</nav>
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant bg-surface-container-low px-space-md py-space-xs rounded-full">
<span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
<span className="font-label-code text-label-code text-on-surface font-semibold">18 CUSTOMERS REQUIRING ATTENTION</span>
</div>
<span className="font-caption text-caption text-outline">Underwriter Audit Ref: #BLR-RET-9941</span>
</div>
</div>
{/*  SECTION 1: MASTER CUSTOMER DIRECTORY TABLE (Row-wise View)  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col overflow-hidden">
{/*  Table Header / Toolbar  */}
<div className="p-space-md lg:p-space-lg bg-surface-container-lowest border-b border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div>
<h1 className="font-headline-md text-headline-sm lg:text-headline-md text-on-surface font-bold tracking-tight">Customer Retention Directory</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Select any customer row below to inspect risk telemetry, AI prescriptive intervention, and lifecycle audits.</p>
</div>
{/*  Controls: Search, Filters, Export  */}
<div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
{/*  Search in table  */}
<div className="relative">
<span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
<input className="h-9 pl-8 pr-3 text-body-sm bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline border-none focus:ring-2 focus:ring-primary/20 w-44 sm:w-56" placeholder="Filter customer, policy..." type="text"/>
</div>
{/*  Filter: Risk Tier  */}
<div className="flex items-center gap-1 bg-surface-container-low px-space-sm h-9 rounded-xl text-caption">
<span className="text-on-surface-variant font-medium">Risk:</span>
<select className="bg-transparent text-on-surface font-semibold focus:outline-none border-none p-0 pr-4 text-body-sm cursor-pointer">
<option selected="">All Tiers</option>
<option>High Risk (70+)</option>
<option>Medium Risk (40-69)</option>
<option>Low Risk (&lt;40)</option>
</select>
</div>
{/*  Filter: Line of Business  */}
<div className="flex items-center gap-1 bg-surface-container-low px-space-sm h-9 rounded-xl text-caption">
<span className="text-on-surface-variant font-medium">LOB:</span>
<select className="bg-transparent text-on-surface font-semibold focus:outline-none border-none p-0 pr-4 text-body-sm cursor-pointer">
<option selected="">All Products</option>
<option>Health Shield</option>
<option>Motor Comprehensive</option>
<option>Term Life Protection</option>
</select>
</div>
{/*  Export Button  */}
<button className="h-9 px-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors" >
<span className="material-symbols-outlined text-[16px] text-primary">download</span>
<span className="hidden sm:inline">Export</span>
</button>
</div>
</div>
{/*  Roster Table  */}
<div className="overflow-x-auto w-full">
<table className="w-full text-left font-body-sm text-body-sm border-collapse min-w-[980px]">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption border-b border-surface-container">
<th className="py-3 px-4 font-semibold">Customer &amp; Policy ID</th>
<th className="py-3 px-4 font-semibold">Plan / Line of Business</th>
<th className="py-3 px-4 font-semibold">Annual Premium</th>
<th className="py-3 px-4 font-semibold">Renewal Due Date</th>
<th className="py-3 px-4 font-semibold">Lapse Risk Score</th>
<th className="py-3 px-4 font-semibold">Payment / Grievance Status</th>
<th className="py-3 px-4 font-semibold text-center">Inspect</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container text-on-surface">
{/*  ROW 1 (Active / Selected Customer - Rahul Sharma)  */}
<tr className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-l-4 border-l-primary group" id="row-rahul" >
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="relative shrink-0">
<div className="w-10 h-10 rounded-full bg-primary-fixed text-primary font-headline-sm text-body-md font-bold flex items-center justify-center shadow-sm">
                          RS
                        </div>
<span className="absolute -bottom-0.5 -right-0.5 bg-surface-container-lowest p-0.5 rounded-full shadow">
<span className="material-symbols-outlined text-[14px] text-tertiary" style={{"fontVariationSettings": "'FILL' 1"}}>verified</span>
</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Rahul Sharma</span>
<span className="bg-surface-container-high text-primary font-label-code text-[11px] px-1.5 py-0.5 rounded font-bold">Platinum</span>
</div>
<span className="font-label-code text-caption text-outline">#POL-1082 • Bengaluru, KA</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">health_and_safety</span>
<span className="font-medium text-on-surface">Health Comprehensive Shield</span>
</div>
<span className="font-caption text-on-surface-variant text-[11px]">Sum Insured: ₹10,00,000</span>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-label-code font-bold text-on-surface">₹28,500</span>
<span className="text-error font-caption text-[11px] font-medium">+12% hike applied</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-semibold text-error">Oct 28, 2025</span>
<span className="font-caption text-[11px] text-error font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> In 3 Days (Critical)
                      </span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-error-container/50 text-error font-metric-stat text-body-sm font-bold flex items-center justify-center">
                        78
                      </div>
<div className="flex flex-col">
<span className="bg-error text-on-error font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">High Risk</span>
<span className="font-caption text-[10px] text-error">+24% (14d)</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col gap-0.5">
<span className="bg-error-container/50 text-error text-[11px] font-medium px-2 py-0.5 rounded w-max">3 Late Pays / Claim Dispute</span>
<span className="font-caption text-on-surface-variant text-[11px]">Grievance #CLM-901 active</span>
</div>
</td>
<td className="py-3.5 px-4 text-center">
<span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary shadow-sm">
<span className="material-symbols-outlined text-[16px]">visibility</span>
</span>
</td>
</tr>
{/*  ROW 2: Sunita Rao  */}
<tr className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-l-4 border-l-transparent group" id="row-sunita" >
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface font-headline-sm text-body-md font-bold flex items-center justify-center">
                        SR
                      </div>
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Sunita Rao</span>
<span className="bg-surface-container-low text-on-surface-variant font-label-code text-[11px] px-1.5 py-0.5 rounded">Gold</span>
</div>
<span className="font-label-code text-caption text-outline">#POL-1044 • Mumbai, MH</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">directions_car</span>
<span className="font-medium text-on-surface">Motor Zero Depreciation</span>
</div>
<span className="font-caption text-on-surface-variant text-[11px]">Sedan EV • 2022</span>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-label-code font-bold text-on-surface">₹19,200</span>
<span className="text-on-surface-variant font-caption text-[11px]">No NCB discount</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-semibold text-error">Oct 30, 2025</span>
<span className="font-caption text-[11px] text-error font-medium">In 5 Days</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-error-container/50 text-error font-metric-stat text-body-sm font-bold flex items-center justify-center">
                        88
                      </div>
<div className="flex flex-col">
<span className="bg-error text-on-error font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">Critical</span>
<span className="font-caption text-[10px] text-error">+31% (7d)</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col gap-0.5">
<span className="bg-secondary/15 text-secondary text-[11px] font-medium px-2 py-0.5 rounded w-max">Competitor Quote Solicited</span>
<span className="font-caption text-on-surface-variant text-[11px]">AutoPay revoked</span>
</div>
</td>
<td className="py-3.5 px-4 text-center">
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary">chevron_right</span>
</td>
</tr>
{/*  ROW 3: Amit Verma  */}
<tr className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-l-4 border-l-transparent group" id="row-amit" >
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface font-headline-sm text-body-md font-bold flex items-center justify-center">
                        AV
                      </div>
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Amit Verma</span>
<span className="bg-surface-container-low text-on-surface-variant font-label-code text-[11px] px-1.5 py-0.5 rounded">Silver</span>
</div>
<span className="font-label-code text-caption text-outline">#POL-1102 • Gurgaon, HR</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">family_restroom</span>
<span className="font-medium text-on-surface">Term Life 360 Shield</span>
</div>
<span className="font-caption text-on-surface-variant text-[11px]">Sum Insured: ₹1.5 Cr</span>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-label-code font-bold text-on-surface">₹34,800</span>
<span className="text-tertiary font-caption text-[11px]">Level Premium</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-semibold text-secondary">Nov 04, 2025</span>
<span className="font-caption text-[11px] text-on-surface-variant font-medium">In 10 Days</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-error-container/40 text-error font-metric-stat text-body-sm font-bold flex items-center justify-center">
                        74
                      </div>
<div className="flex flex-col">
<span className="bg-error text-on-error font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">High Risk</span>
<span className="font-caption text-[10px] text-error">Unresponsive</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col gap-0.5">
<span className="bg-error-container/40 text-error text-[11px] font-medium px-2 py-0.5 rounded w-max">2 Bounced Direct Debits</span>
<span className="font-caption text-on-surface-variant text-[11px]">NACH Mandate Failed</span>
</div>
</td>
<td className="py-3.5 px-4 text-center">
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary">chevron_right</span>
</td>
</tr>
{/*  ROW 4: Priya Patel  */}
<tr className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-l-4 border-l-transparent group" id="row-priya" >
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface font-headline-sm text-body-md font-bold flex items-center justify-center">
                        PP
                      </div>
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Priya Patel</span>
<span className="bg-surface-container-high text-primary font-label-code text-[11px] px-1.5 py-0.5 rounded font-bold">Platinum</span>
</div>
<span className="font-label-code text-caption text-outline">#POL-1104 • Ahmedabad, GJ</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">health_and_safety</span>
<span className="font-medium text-on-surface">Health Care Family Floater</span>
</div>
<span className="font-caption text-on-surface-variant text-[11px]">4 Members Covered</span>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-label-code font-bold text-on-surface">₹41,200</span>
<span className="text-tertiary font-caption text-[11px]">Loyalty 5% eligible</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Nov 14, 2025</span>
<span className="font-caption text-[11px] text-on-surface-variant">In 20 Days</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-surface-container-high text-secondary font-metric-stat text-body-sm font-bold flex items-center justify-center">
                        48
                      </div>
<div className="flex flex-col">
<span className="bg-secondary text-on-secondary font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">Moderate</span>
<span className="font-caption text-[10px] text-secondary">Portal Engaged</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col gap-0.5">
<span className="bg-tertiary/15 text-tertiary text-[11px] font-medium px-2 py-0.5 rounded w-max">Clean Payment Track</span>
<span className="font-caption text-on-surface-variant text-[11px]">Viewed renewal quote 2x</span>
</div>
</td>
<td className="py-3.5 px-4 text-center">
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary">chevron_right</span>
</td>
</tr>
{/*  ROW 5: Rajesh Khanna  */}
<tr className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-l-4 border-l-transparent group" id="row-rajesh" >
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface font-headline-sm text-body-md font-bold flex items-center justify-center">
                        RK
                      </div>
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Rajesh Khanna</span>
<span className="bg-surface-container-low text-on-surface-variant font-label-code text-[11px] px-1.5 py-0.5 rounded">Silver</span>
</div>
<span className="font-label-code text-caption text-outline">#POL-1205 • Delhi, NCR</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">directions_car</span>
<span className="font-medium text-on-surface">Commercial Fleet Shield</span>
</div>
<span className="font-caption text-on-surface-variant text-[11px]">3 Light Vehicles</span>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-label-code font-bold text-on-surface">₹58,900</span>
<span className="text-error font-caption text-[11px] font-medium">+18% hike</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-semibold text-secondary">Nov 02, 2025</span>
<span className="font-caption text-[11px] text-error font-medium">In 8 Days</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-error-container/40 text-error font-metric-stat text-body-sm font-bold flex items-center justify-center">
                        69
                      </div>
<div className="flex flex-col">
<span className="bg-secondary text-on-secondary font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">Elevated</span>
<span className="font-caption text-[10px] text-error">+18% price sensitivity</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col gap-0.5">
<span className="bg-secondary/15 text-secondary text-[11px] font-medium px-2 py-0.5 rounded w-max">1 Delay (15 Days)</span>
<span className="font-caption text-on-surface-variant text-[11px]">Requested fleet discount</span>
</div>
</td>
<td className="py-3.5 px-4 text-center">
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary">chevron_right</span>
</td>
</tr>
{/*  ROW 6: Vikram Malhotra  */}
<tr className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-l-4 border-l-transparent group" id="row-vikram" >
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface font-headline-sm text-body-md font-bold flex items-center justify-center">
                        VM
                      </div>
<div className="flex flex-col">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Vikram Malhotra</span>
<span className="bg-surface-container-high text-primary font-label-code text-[11px] px-1.5 py-0.5 rounded font-bold">Platinum</span>
</div>
<span className="font-label-code text-caption text-outline">#POL-1192 • Hyderabad, TS</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
<span className="font-medium text-on-surface">Super Top-up Health</span>
</div>
<span className="font-caption text-on-surface-variant text-[11px]">Deductible: ₹5L • Base: ₹25L</span>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-label-code font-bold text-on-surface">₹14,500</span>
<span className="text-tertiary font-caption text-[11px]">AutoPay Confirmed</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Nov 28, 2025</span>
<span className="font-caption text-[11px] text-tertiary font-medium">In 34 Days</span>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-tertiary/15 text-tertiary font-metric-stat text-body-sm font-bold flex items-center justify-center">
                        22
                      </div>
<div className="flex flex-col">
<span className="bg-tertiary text-on-tertiary font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">Low Risk</span>
<span className="font-caption text-[10px] text-tertiary">High Affinity</span>
</div>
</div>
</td>
<td className="py-3.5 px-4">
<div className="flex flex-col gap-0.5">
<span className="bg-tertiary/15 text-tertiary text-[11px] font-medium px-2 py-0.5 rounded w-max">100% On-time</span>
<span className="font-caption text-on-surface-variant text-[11px]">Zero disputes across 4 yrs</span>
</div>
</td>
<td className="py-3.5 px-4 text-center">
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary">chevron_right</span>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Footer Pagination & Summary  */}
<div className="px-space-md py-space-sm bg-surface-container-low border-t border-surface-container flex items-center justify-between text-caption text-on-surface-variant">
<span>Showing 6 of 18 priority policies needing intervention</span>
<div className="flex items-center gap-2">
<button className="px-2.5 py-1 rounded bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container font-medium">Previous</button>
<span className="px-2 font-semibold text-primary">Page 1 of 3</span>
<button className="px-2.5 py-1 rounded bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container font-medium">Next</button>
</div>
</div>
</div>
{/*  SECTION 2: SELECTED CUSTOMER DOSSIER & WORKBENCH  */}
<div className="flex flex-col gap-space-md" id="customer-dossier-wrapper">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">badge</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Active Customer Inspection Dossier</h2>
</div>
<span className="text-caption text-on-surface-variant">Click any table row above to switch inspected policy</span>
</div>
{/*  Dossier Hero Surface  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg border-l-4 border-l-error">
{/*  Left: Customer Summary Entity  */}
<div className="flex items-start md:items-center gap-space-lg flex-1">
<div className="relative shrink-0">
<div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-md text-headline-md font-bold shadow-inner">
                  RS
                </div>
<span className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-0.5 rounded-full shadow">
<span className="material-symbols-outlined text-[20px] text-tertiary" style={{"fontVariationSettings": "'FILL' 1"}}>verified</span>
</span>
</div>
<div className="flex flex-col gap-space-2xs min-w-0">
<div className="flex items-center gap-space-sm flex-wrap">
<h1 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface tracking-tight truncate">Rahul Sharma</h1>
<span className="bg-surface-container-high text-primary font-label-code text-label-code px-space-sm py-0.5 rounded-full font-semibold">
                    Platinum Tier
                  </span>
<span className="bg-surface-container-low text-on-surface-variant font-caption text-caption px-space-sm py-0.5 rounded-full">
                    5 Years Tenure (Since Oct 2019)
                  </span>
</div>
<div className="flex items-center gap-space-md flex-wrap text-on-surface-variant font-body-sm text-body-sm mt-space-2xs">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">location_on</span> Bengaluru, KA
                  </span>
<span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">person</span> Age 42 • Salaried Tech Lead
                  </span>
<span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-outline">call</span> +91 98450 •••••
                  </span>
</div>
{/*  Key Policy Bar Details  */}
<div className="flex items-center gap-space-base flex-wrap font-caption text-caption mt-space-xs text-on-surface">
<div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-space-2xs rounded-lg">
<span className="material-symbols-outlined text-primary text-[16px]">health_and_safety</span>
<span className="font-semibold text-primary">Health Comprehensive Shield</span>
<span className="font-label-code text-label-code text-outline">#POL-1082</span>
</div>
<span className="text-on-surface-variant">Annual Premium: <strong className="text-on-surface font-semibold font-label-code text-label-code">₹28,500</strong> <span className="text-error font-medium text-[11px]">(+12% hike)</span></span>
<span className="text-on-surface-variant">Renewal Date: <strong className="text-error font-semibold font-label-code text-label-code">Oct 28, 2025</strong></span>
</div>
</div>
</div>
{/*  Right: Risk Score Gauge & Action CTAs Strip  */}
<div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-space-lg lg:border-l lg:pl-space-lg lg:border-surface-container shrink-0">
{/*  Risk Gauge Mini Dial  */}
<div className="flex items-center gap-space-md bg-error-container/40 p-space-sm px-space-md rounded-xl">
<div className="relative w-14 h-14 flex items-center justify-center">
<svg className="w-full h-full -rotate-90 transform" viewbox="0 0 36 36">
<path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
<path className="text-error" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="78, 100" strokeLinecap="round" strokeWidth="3.5"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="font-metric-stat text-label-code font-bold text-on-error-container leading-none">78</span>
</div>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-error">warning</span>
<span className="font-headline-sm text-label-code text-on-error-container uppercase tracking-wider font-bold">HIGH RISK</span>
</div>
<span className="font-caption text-[11px] text-on-error-container/80">Velocity Index: +24% (14d)</span>
</div>
</div>
{/*  Quick Action Buttons  */}
<div className="flex flex-wrap items-center gap-space-xs">
<button className="h-10 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95"  title="Direct WhatsApp / Call Contact">
<span className="material-symbols-outlined text-[18px] text-tertiary">chat</span>
<span>WhatsApp / Call</span>
</button>
<button className="h-10 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95" >
<span className="material-symbols-outlined text-[18px] text-primary">schedule_send</span>
<span>Send Smart Ping</span>
</button>
<button className="h-10 px-space-md rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95" >
<span className="material-symbols-outlined text-[18px]">percent</span>
<span>Apply 12% Loyalty</span>
</button>
<button className="h-10 px-space-md rounded-xl bg-tertiary text-on-tertiary hover:bg-tertiary-container font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95" >
<span className="material-symbols-outlined text-[18px]">task_alt</span>
<span>Mark Renewed</span>
</button>
</div>
</div>
</div>
{/*  2-Column Responsive Split Architecture (Left: ~38%, Right: ~62%)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
{/*  LEFT COLUMN: Explainable Risk Attribution & AI Prescriptive Strategy (~38%)  */}
<div className="lg:col-span-5 flex flex-col gap-space-lg">
{/*  Card 1: Explainable Risk Diagnostics  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-base">
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-[22px]">analytics</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Explainable Risk Diagnostics</h2>
</div>
<span className="font-label-code text-label-code text-error bg-error-container/50 px-space-xs py-space-2xs rounded-lg font-bold">
                    Lapse Hazard: 78%
                  </span>
</div>
{/*  Overall Probability Bar Visual  */}
<div className="flex flex-col gap-space-2xs bg-surface-container-low p-space-md rounded-xl">
<div className="flex justify-between items-center text-on-surface font-caption text-caption">
<span>Predictive Model Ensemble (XGBoost + ChurnFormer)</span>
<span className="font-label-code text-label-code font-bold text-error">78.4% LAPSE RISK</span>
</div>
<div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
<div className="h-full bg-gradient-to-r from-secondary to-error rounded-full transition-all duration-700" style={{"width": "78%"}}></div>
</div>
<div className="flex justify-between text-[11px] text-on-surface-variant font-caption">
<span>Benchmark baseline: 21%</span>
<span className="text-error font-medium">Deviation: +57% above median</span>
</div>
</div>
{/*  Factor Attribution Stack  */}
<div className="flex flex-col gap-space-sm">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">Key Attribution Point Breakdown</span>
{/*  Factor 1: Late Payments  */}
<div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-sm border-l-2 border-l-error">
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-error text-[18px] mt-0.5">event_repeat</span>
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-semibold">3 Late Payments in Last 12 Mos</span>
<span className="font-caption text-caption text-on-surface-variant">Delayed across Q2 &amp; Q3 renewals (settled post-grace period)</span>
</div>
</div>
<div className="text-right shrink-0">
<span className="font-label-code text-label-code font-bold text-error">+25 pts</span>
<div className="font-caption text-[10px] text-error font-semibold uppercase">Severe</div>
</div>
</div>
{/*  Factor 2: Claim Rejection Grievance  */}
<div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-sm border-l-2 border-l-error">
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-error text-[18px] mt-0.5">report_problem</span>
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-semibold">Claim Rejection Grievance #CLM-901</span>
<span className="font-caption text-caption text-on-surface-variant">₹42,000 claim denied under pre-existing clause. Grievance escalated.</span>
</div>
</div>
<div className="text-right shrink-0">
<span className="font-label-code text-label-code font-bold text-error">+20 pts</span>
<div className="font-caption text-[10px] text-error font-semibold uppercase">High Hazard</div>
</div>
</div>
{/*  Factor 3: Price Hike  */}
<div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-sm border-l-2 border-l-secondary">
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">trending_up</span>
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-semibold">Premium Price Hike (+12%)</span>
<span className="font-caption text-caption text-on-surface-variant">Revised from ₹25,450 to ₹28,500 due to age cohort transition (42 yrs)</span>
</div>
</div>
<div className="text-right shrink-0">
<span className="font-label-code text-label-code font-bold text-secondary">+15 pts</span>
<div className="font-caption text-[10px] text-secondary font-semibold uppercase">Moderate</div>
</div>
</div>
{/*  Factor 4: Portal Inactivity  */}
<div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-sm border-l-2 border-l-outline">
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-outline text-[18px] mt-0.5">phonelink_erase</span>
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-semibold">Portal Inactivity &gt; 90 Days</span>
<span className="font-caption text-caption text-on-surface-variant">Zero member portal logins or mobile wellness syncs in Q3 cycle</span>
</div>
</div>
<div className="text-right shrink-0">
<span className="font-label-code text-label-code font-bold text-outline">+18 pts</span>
<div className="font-caption text-[10px] text-outline font-semibold uppercase">Moderate</div>
</div>
</div>
</div>
</div>
{/*  Card 2: AI Prescribed Intervention Strategy  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-base relative overflow-hidden">
<div className="absolute -right-8 -top-8 w-36 h-36 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[22px]">smart_toy</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">AI Prescribed Strategy</h2>
</div>
<span className="bg-primary/10 text-primary font-caption text-caption font-semibold px-space-xs py-space-2xs rounded-lg">
                    Engine: RetentionGPT-v4
                  </span>
</div>
{/*  Strategy Highlight Box  */}
<div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm border-l-4 border-l-primary">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Recommended Package Formulation</span>
<span className="bg-tertiary/15 text-tertiary font-label-code text-caption px-space-xs py-0.5 rounded font-bold">Best ROI</span>
</div>
<div className="flex flex-col gap-space-xs text-on-surface font-body-sm text-body-sm">
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
<span><strong>12% Loyalty Retention Discount:</strong> Revert annual premium from ₹28,500 back to <span className="font-label-code font-bold text-primary">₹25,080</span>.</span>
</div>
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
<span><strong>Compensatory Goodwill Add-on:</strong> Free Comprehensive Family Health Checkup Voucher (Valued at ₹3,500).</span>
</div>
<div className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
<span><strong>Ombudsman Priority Review:</strong> Expedite Grievance #CLM-901 reconciliation note via underwriting head.</span>
</div>
</div>
</div>
{/*  Channel & Success Projection Metric  */}
<div className="grid grid-cols-2 gap-space-sm bg-surface-container-high/40 p-space-md rounded-xl">
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant">Prescribed Outreach Channel</span>
<span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined text-primary text-[16px]">support_agent</span>
                      Senior Voice Specialist
                    </span>
<span className="text-[11px] text-outline">High-touch human empathy required</span>
</div>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant">Retention Uplift Simulation</span>
<div className="flex items-center gap-space-xs mt-0.5">
<span className="font-metric-stat text-body-lg text-outline line-through">45%</span>
<span className="material-symbols-outlined text-[16px] text-tertiary">arrow_forward</span>
<span className="font-metric-stat text-headline-sm text-tertiary font-bold">79%</span>
</div>
<span className="text-[11px] text-tertiary font-semibold">+34% probability recovery</span>
</div>
</div>
{/*  Intervention Action Protocol CTA Buttons  */}
<div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
<button className="flex-1 h-10 px-space-md rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-all shadow-sm active:scale-95" >
<span className="material-symbols-outlined text-[18px]">send</span>
<span>Deploy Offer to Queue</span>
</button>
<button className="flex-1 h-10 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-all shadow-sm active:scale-95" >
<span className="material-symbols-outlined text-[18px] text-primary">phone_in_talk</span>
<span>Execute Call Protocol</span>
</button>
</div>
</div>
</div>
{/*  RIGHT COLUMN: Chronological Timeline, Ledger, and Policy Claims Intelligence (~62%)  */}
<div className="lg:col-span-7 flex flex-col gap-space-lg">
{/*  Tabbed Container  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
{/*  Navigation Tabs Bar  */}
<div className="flex items-center gap-space-xs px-space-lg pt-space-md bg-surface-container-low border-b border-surface-container overflow-x-auto">
<button className="pb-space-sm px-space-md font-headline-sm text-body-md font-semibold text-primary border-b-2 border-primary transition-all flex items-center gap-space-xs whitespace-nowrap" id="tab-timeline" >
<span className="material-symbols-outlined text-[18px]">history</span>
                    Chronological Activity Timeline
                  </button>
<button className="pb-space-sm px-space-md font-body-md text-body-md font-normal text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-space-xs whitespace-nowrap" id="tab-ledger" >
<span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    Payment Ledger &amp; Invoices
                  </button>
<button className="pb-space-sm px-space-md font-body-md text-body-md font-normal text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-space-xs whitespace-nowrap" id="tab-claims" >
<span className="material-symbols-outlined text-[18px]">medical_services</span>
                    Claims History (2)
                  </button>
<button className="pb-space-sm px-space-md font-body-md text-body-md font-normal text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-space-xs whitespace-nowrap" id="tab-documents" >
<span className="material-symbols-outlined text-[18px]">description</span>
                    Policy Docs
                  </button>
</div>
{/*  TAB CONTENT 1: Chronological 5-Year Activity Timeline (Active)  */}
<div className="p-space-lg flex flex-col gap-space-lg" id="content-timeline">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-headline-sm text-body-md text-on-surface font-semibold">5-Year Lifecycle Audit Stream</span>
<span className="font-caption text-caption text-on-surface-variant">Real-time touchpoints, telemetry events, and settlement logs</span>
</div>
<div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
<span className="material-symbols-outlined text-[16px] text-tertiary">sync</span>
<span>Live Event Stream</span>
</div>
</div>
{/*  Timeline Vertical Track  */}
<div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
{/*  Timeline Item 1 (Oct 25, 2025)  */}
<div className="relative group">
<div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
<div className="bg-surface-container-low/70 p-space-md rounded-xl hover:bg-surface-container transition-all">
<div className="flex items-center justify-between flex-wrap gap-1">
<span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">outgoing_mail</span>
                            Renewal Reminder Sent via WhatsApp
                          </span>
<span className="font-label-code text-caption text-on-surface-variant">Oct 25, 2025 • 10:14 AM</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Automated 3-day renewal notification ping dispatched. Gateway status: <strong className="text-on-surface">Delivered, Unopened</strong>. Link not clicked.
                        </p>
<div className="flex items-center gap-2 mt-2">
<span className="font-label-code text-[11px] bg-surface-container-highest px-2 py-0.5 rounded text-on-surface">WA-MSG-8812</span>
<span className="font-caption text-[11px] text-outline">Trigger: Auto-Campaign #3D-EXP</span>
</div>
</div>
</div>
{/*  Timeline Item 2 (Oct 20, 2025)  */}
<div className="relative group">
<div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
<div className="bg-surface-container-low/70 p-space-md rounded-xl hover:bg-surface-container transition-all">
<div className="flex items-center justify-between flex-wrap gap-1">
<span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">receipt</span>
                            Year 6 Renewal Notice Generated
                          </span>
<span className="font-label-code text-caption text-on-surface-variant">Oct 20, 2025 • 09:00 AM</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Revised premium notice published: ₹28,500 (inclusive of GST). Underwriting flagged age band change (bracket 40–45). Notice emailed to registered address.
                        </p>
</div>
</div>
{/*  Timeline Item 3 (Aug 14, 2025)  */}
<div className="relative group">
<div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-error ring-4 ring-surface-container-lowest animate-pulse"></div>
<div className="bg-error-container/20 p-space-md rounded-xl hover:bg-error-container/30 transition-all border-l-2 border-l-error">
<div className="flex items-center justify-between flex-wrap gap-1">
<span className="font-headline-sm text-body-md text-error font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-error text-[18px]">cancel</span>
                            Hospitalization Claim #CLM-901 Rejected
                          </span>
<span className="font-label-code text-caption text-on-error-container">Aug 14, 2025 • 04:30 PM</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-1">
                          ₹42,000 claim for spouse hospitalization (Manipal Hospital) denied by TPA under "Pre-existing Condition Exclusion Clause 4.2". Customer raised formal dispute via support desk on Aug 16.
                        </p>
<div className="flex items-center gap-space-sm mt-2">
<span className="bg-error text-on-error font-caption text-[11px] font-semibold px-2 py-0.5 rounded">Grievance Active</span>
<span className="font-caption text-caption text-on-surface-variant">Assigned Officer: Underwriting Ombudsman (Escalation Level 2)</span>
</div>
</div>
</div>
{/*  Timeline Item 4 (Mar 10, 2025)  */}
<div className="relative group">
<div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
<div className="bg-surface-container-low/70 p-space-md rounded-xl hover:bg-surface-container transition-all">
<div className="flex items-center justify-between flex-wrap gap-1">
<span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-secondary text-[18px]">warning_amber</span>
                            Quarterly Installment Delayed (18 Days Grace Exceeded)
                          </span>
<span className="font-label-code text-caption text-on-surface-variant">Mar 10, 2025 • 06:12 PM</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Installment payment was delayed by 18 days beyond the statutory grace period. Policy was in temporary lapsed status before reinstatement payment was settled.
                        </p>
</div>
</div>
{/*  Timeline Item 5 (Oct 28, 2024)  */}
<div className="relative group">
<div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-tertiary ring-4 ring-surface-container-lowest"></div>
<div className="bg-surface-container-low/70 p-space-md rounded-xl hover:bg-surface-container transition-all">
<div className="flex items-center justify-between flex-wrap gap-1">
<span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                            Year 4 Policy Renewed On-Time
                          </span>
<span className="font-label-code text-caption text-on-surface-variant">Oct 28, 2024 • 11:20 AM</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Net premium of ₹25,450 paid seamlessly via UPI AutoPay. 15% Cumulative No-Claim Bonus credited to base sum insured.
                        </p>
</div>
</div>
{/*  Timeline Item 6 (Oct 28, 2019)  */}
<div className="relative group">
<div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
<div className="bg-surface-container-low/70 p-space-md rounded-xl hover:bg-surface-container transition-all">
<div className="flex items-center justify-between flex-wrap gap-1">
<span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">flag</span>
                            Policy Inception (#POL-1082)
                          </span>
<span className="font-label-code text-caption text-on-surface-variant">Oct 28, 2019</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Health Comprehensive Shield originated with base sum insured ₹10,00,000. Customer acquired via Bengaluru corporate direct campaign.
                        </p>
</div>
</div>
</div>
</div>
{/*  TAB CONTENT 2: Payment Ledger  */}
<div className="p-space-lg hidden flex-col gap-space-md" id="content-ledger">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Payment Invoices &amp; Settlements</span>
<button className="font-caption text-caption text-primary hover:underline">Download All Statements</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption">
<th className="py-space-sm px-space-md rounded-l-lg">Cycle</th>
<th className="py-space-sm px-space-md">Invoice #</th>
<th className="py-space-sm px-space-md">Amount</th>
<th className="py-space-sm px-space-md">Method</th>
<th className="py-space-sm px-space-md">Payment Date</th>
<th className="py-space-sm px-space-md rounded-r-lg">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container text-on-surface">
<tr className="hover:bg-surface-container-low/50">
<td className="py-space-sm px-space-md font-semibold">2024 - 2025</td>
<td className="py-space-sm px-space-md font-label-code text-label-code">INV-9902</td>
<td className="py-space-sm px-space-md font-label-code font-bold">₹25,450</td>
<td className="py-space-sm px-space-md">UPI AutoPay</td>
<td className="py-space-sm px-space-md">Oct 28, 2024</td>
<td className="py-space-sm px-space-md"><span className="bg-tertiary/15 text-tertiary px-2 py-0.5 rounded font-caption text-[11px] font-bold">Paid</span></td>
</tr>
<tr className="hover:bg-surface-container-low/50">
<td className="py-space-sm px-space-md font-semibold">2023 - 2024</td>
<td className="py-space-sm px-space-md font-label-code text-label-code">INV-7412</td>
<td className="py-space-sm px-space-md font-label-code font-bold">₹23,200</td>
<td className="py-space-sm px-space-md">NetBanking</td>
<td className="py-space-sm px-space-md">Oct 27, 2023</td>
<td className="py-space-sm px-space-md"><span className="bg-tertiary/15 text-tertiary px-2 py-0.5 rounded font-caption text-[11px] font-bold">Paid</span></td>
</tr>
<tr className="hover:bg-surface-container-low/50">
<td className="py-space-sm px-space-md font-semibold">2022 - 2023</td>
<td className="py-space-sm px-space-md font-label-code text-label-code">INV-5510</td>
<td className="py-space-sm px-space-md font-label-code font-bold">₹21,800</td>
<td className="py-space-sm px-space-md">Credit Card</td>
<td className="py-space-sm px-space-md">Nov 04, 2022 (Late)</td>
<td className="py-space-sm px-space-md"><span className="bg-secondary/15 text-secondary px-2 py-0.5 rounded font-caption text-[11px] font-bold">Late Paid</span></td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  TAB CONTENT 3: Claims History  */}
<div className="p-space-lg hidden flex-col gap-space-md" id="content-claims">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Claims Registered Under #POL-1082</span>
<div className="p-space-md rounded-xl bg-error-container/20 border-l-4 border-l-error flex flex-col gap-space-xs">
<div className="flex justify-between items-center">
<span className="font-headline-sm text-body-md text-error font-bold">Claim #CLM-901 • ₹42,000</span>
<span className="bg-error text-on-error font-caption text-[11px] px-2 py-0.5 rounded font-bold">Rejected &amp; In Dispute</span>
</div>
<span className="font-caption text-caption text-on-surface">Hospital: Manipal Hospital, Bengaluru • Specialty: Gastroenterology</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Rejection Basis: Clause 4.2 (Alleged pre-existing condition non-disclosure). Customer presented historical diagnosis records proving acute onset.</p>
<div className="mt-space-xs flex items-center justify-between text-caption font-caption">
<span className="text-error font-semibold">Ombudsman Desk SLA: 48 Hours Remaining</span>
<button className="bg-surface-container-lowest px-space-sm py-1 rounded text-primary font-semibold hover:bg-surface-container" >Review Dossier</button>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex justify-between items-center">
<span className="font-headline-sm text-body-md text-on-surface font-semibold">Claim #CLM-418 • ₹18,500</span>
<span className="bg-tertiary/15 text-tertiary font-caption text-[11px] px-2 py-0.5 rounded font-bold">Settled (Dec 2021)</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Hospital: Apollo Cradle, Bengaluru • Daycare Procedure</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Cashless settlement honored within 2 hours. Zero customer friction recorded.</p>
</div>
</div>
{/*  TAB CONTENT 4: Policy Documents  */}
<div className="p-space-lg hidden flex-col gap-space-sm" id="content-documents">
<span className="font-headline-sm text-body-md font-semibold text-on-surface">Digitized Policy Assets</span>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-xs">
<div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[24px]">picture_as_pdf</span>
<div className="flex flex-col">
<span className="font-body-sm font-semibold text-on-surface">Policy Schedule 2024-25.pdf</span>
<span className="font-caption text-outline">1.8 MB • Signed</span>
</div>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary">download</button>
</div>
<div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[24px]">picture_as_pdf</span>
<div className="flex flex-col">
<span className="font-body-sm font-semibold text-on-surface">Claim Grievance Filing #901.pdf</span>
<span className="font-caption text-outline">840 KB • Ombudsman Copy</span>
</div>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary">download</button>
</div>
</div>
</div>
</div>
{/*  Payment Reliability & Claims Summary Cards  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
{/*  Metric 1: Reliability Index  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Payment Reliability</span>
<span className="material-symbols-outlined text-secondary text-[20px]">credit_score</span>
</div>
<div className="my-space-xs">
<div className="font-metric-stat text-headline-md text-on-surface font-bold">82%</div>
<span className="font-caption text-caption text-on-surface-variant">14 On-time / 3 Delayed</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width": "82%"}}></div>
</div>
</div>
{/*  Metric 2: Lifetime Value  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Lifetime Value (LTV)</span>
<span className="material-symbols-outlined text-primary text-[20px]">payments</span>
</div>
<div className="my-space-xs">
<div className="font-metric-stat text-headline-md text-primary font-bold">₹1,42,000</div>
<span className="font-caption text-caption text-on-surface-variant">Paid across 5 full years</span>
</div>
<div className="flex items-center gap-1 font-caption text-[11px] text-tertiary">
<span className="material-symbols-outlined text-[14px]">star</span>
<span>Top 15% Portfolio Quartile</span>
</div>
</div>
{/*  Metric 3: Outstanding Dispute  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border-l-4 border-l-error">
<div className="flex items-center justify-between">
<span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">Dispute Status</span>
<span className="material-symbols-outlined text-error text-[20px]">gavel</span>
</div>
<div className="my-space-xs">
<div className="font-body-md text-body-md font-bold text-error">#CLM-901 Under Review</div>
<span className="font-caption text-caption text-on-surface-variant">Ombudsman desk review pending</span>
</div>
<span className="font-label-code text-[11px] text-error font-semibold">Escalated 6 days ago</span>
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
