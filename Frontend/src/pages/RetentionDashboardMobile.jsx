import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RetentionDashboardMobile() {
  React.useEffect(() => {
    // Menu drawer toggle
    const menuBtn = document.querySelector('button[aria-label="menu"]') || document.querySelector('button');
    const drawer = document.getElementById('nav-drawer');
    const backdrop = document.getElementById('drawer-backdrop');

    const openDrawer = () => {
      if (drawer) drawer.classList.remove('-translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
    };

    const closeDrawer = () => {
      if (drawer) drawer.classList.add('-translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
    };

    if (backdrop) backdrop.onclick = closeDrawer;

    // Attach to menu button
    const buttons = document.querySelectorAll('button');
    buttons.forEach(b => {
      if (b.innerHTML.includes('menu')) {
        b.onclick = openDrawer;
      }
      if (b.innerHTML.includes('close')) {
        b.onclick = closeDrawer;
      }
    });

    // Action drawer / intervention modal
    const actionDrawer = document.getElementById('action-drawer');
    const drawerContent = document.getElementById('drawer-content');
    const closeActionModal = () => {
      if (drawerContent) drawerContent.classList.add('translate-y-full');
      setTimeout(() => {
        if (actionDrawer) actionDrawer.classList.add('hidden');
      }, 300);
    };

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) modalCloseBtn.onclick = closeActionModal;
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) modalBackdrop.onclick = closeActionModal;
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md flex flex-col min-h-screen relative antialiased max-w-md mx-auto shadow-2xl border-x border-outline-variant/20">
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe"><div className="h-14 px-gutter flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0"><button className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors -ml-space-xs"  type="button"><span className="material-symbols-outlined text-[24px]">menu</span></button><div className="flex items-center gap-space-xs min-w-0"><img alt="InsureRenew Brand Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1U2Y1HNTOBfBfO7gWUxzsSaSwOc5znWAnxv-hcx2DcXjj9OdBLrUo0nTsbK3B0YLmep7onr1PGaIbbD-xOdGiUuYa_jydxZ3UY1RcCtD1Icpu8yspGT394kwIeezsUt8E91FOSdb7xuVyh5JypBl7ShVOVMk5UNuXUYfCPwkPHjE7kZ5IqZsgd738I-jYhmW5RbbZhIHj2g8u19a7yMv49brfC6Y96QN9uVMqGPG_Jcz3DrCdlHq7V6S660"/><div className="flex flex-col min-w-0"><span className="font-headline-sm text-headline-sm text-primary tracking-tight truncate leading-none">InsureRenew</span><span className="font-caption text-caption text-on-surface-variant truncate uppercase tracking-wider">Overview</span></div></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 relative flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" type="button"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error font-caption text-[10px] leading-4 text-center font-bold">5</span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden transition-opacity" id="drawer-backdrop" ></div><aside className="fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-surface-container-lowest shadow-[0_20px_25px_-5px_rgba(15,23,42,0.12)] -translate-x-full transition-transform duration-300 ease-in-out flex flex-col" id="nav-drawer"><div className="h-14 px-gutter flex items-center justify-between bg-surface-container-low pt-safe"><div className="flex items-center gap-space-xs"><img alt="InsureRenew Brand Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U2Y1HNTOBfBfO7gWUxzsSaSwOc5znWAnxv-hcx2DcXjj9OdBLrUo0nTsbK3B0YLmep7onr1PGaIbbD-xOdGiUuYa_jydxZ3UY1RcCtD1Icpu8yspGT394kwIeezsUt8E91FOSdb7xuVyh5JypBl7ShVOVMk5UNuXUYfCPwkPHjE7kZ5IqZsgd738I-jYhmW5RbbZhIHj2g8u19a7yMv49brfC6Y96QN9uVMqGPG_Jcz3DrCdlHq7V6S660"/><span className="font-headline-sm text-headline-sm text-primary">InsureRenew</span></div><button className="w-11 h-11 flex items-center justify-center text-on-surface-variant"  type="button"><span className="material-symbols-outlined text-[22px]">close</span></button></div><div className="px-gutter py-space-sm bg-surface-container-high/40 flex items-center justify-between"><span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Retention Workspace</span><span className="font-label-code text-label-code text-primary bg-secondary-container px-space-xs py-0.5 rounded-full font-bold">v2.4 Live</span></div><div className="flex-1 overflow-y-auto px-gutter py-space-md space-y-space-xs"><div className="font-caption text-caption text-outline uppercase tracking-wider px-space-xs py-space-2xs">Core Workspaces</div><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="overview" href="#"><span className="material-symbols-outlined text-[20px] text-primary">space_dashboard</span><span className="font-body-md text-body-md font-medium">Overview</span></a><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="portfolio" href="#"><span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span><span className="font-body-md text-body-md font-medium">Portfolio Renewals</span></a><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="lapse-risk" href="#"><span className="material-symbols-outlined text-[20px] text-primary">warning</span><span className="font-body-md text-body-md font-medium">Lapse Risk Scoring</span></a><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="offers" href="#"><span className="material-symbols-outlined text-[20px] text-primary">local_offer</span><span className="font-body-md text-body-md font-medium">Offers &amp; Retention</span></a><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="reminders" href="#"><span className="material-symbols-outlined text-[20px] text-primary">forward_to_inbox</span><span className="font-body-md text-body-md font-medium">Smart Reminders</span></a><div className="font-caption text-caption text-outline uppercase tracking-wider px-space-xs pt-space-md pb-space-2xs">Specialized Audits</div><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="customer-details" href="#"><span className="material-symbols-outlined text-[20px] text-secondary">account_box</span><span className="font-body-md text-body-md font-medium">Customer Dossier</span></a><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="retention-workbench" href="#"><span className="material-symbols-outlined text-[20px] text-secondary">tune</span><span className="font-body-md text-body-md font-medium">Retention Workbench</span></a><a className="flex items-center gap-space-md px-space-md py-space-sm rounded-xl text-on-surface hover:bg-surface-container-low transition-colors" data-path="outreach-composer" href="#"><span className="material-symbols-outlined text-[20px] text-secondary">edit_note</span><span className="font-body-md text-body-md font-medium">Outreach Composer</span></a></div><div className="p-gutter bg-surface-container-lowest pb-safe"><div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between"><div className="flex items-center gap-space-sm min-w-0"><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div className="min-w-0"><div className="font-body-sm text-body-sm font-semibold truncate text-on-surface">Sarah Underwriter</div><div className="font-caption text-caption text-on-surface-variant truncate">sarah.u@insurerenew.io</div></div></div><button className="w-9 h-9 flex items-center justify-center text-outline hover:text-error transition-colors" type="button"><span className="material-symbols-outlined text-[18px]">logout</span></button></div></div></aside><main className="flex-1 flex flex-col relative w-full pt-14 pb-20 bg-surface"><div className="flex flex-col w-full pb-10">
{/*  Interactive Toast Notification System  */}
<div className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] w-11/12 max-w-sm pointer-events-none flex flex-col gap-2 transition-all duration-300" id="toast-container"></div>
{/*  Interactive Quick Demo Flow Banner  */}
<section className="p-gutter">
<div className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-container p-space-md text-on-primary shadow-md">
<div className="flex items-center justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-tertiary-fixed" style={{"fontVariationSettings": "'FILL' 1"}}>bolt</span>
<span className="font-headline-sm text-[13px] uppercase tracking-wider font-semibold">Demo Sandbox Guided Journey</span>
</div>
<span className="font-label-code text-[11px] bg-surface-container-lowest/20 px-2 py-0.5 rounded-full backdrop-blur-sm">4-Step Sprint</span>
</div>
<p className="font-body-sm text-[12px] opacity-90 leading-tight mb-space-sm">
        Simulate an AI-driven lapse save: Identify critical risk, review dossier, generate personalized retention offer, and dispatch multichannel reminder.
      </p>
{/*  Stepper Badges  */}
<div className="grid grid-cols-4 gap-1.5 pt-space-2xs text-center font-caption text-[10px]">
<button className="flex flex-col items-center p-1.5 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 transition-all text-on-primary" >
<span className="w-4 h-4 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold flex items-center justify-center mb-1">1</span>
<span className="truncate w-full font-medium">1. High Risk</span>
</button>
<button className="flex flex-col items-center p-1.5 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 transition-all text-on-primary" >
<span className="w-4 h-4 rounded-full bg-surface-container-lowest text-primary font-bold flex items-center justify-center mb-1">2</span>
<span className="truncate w-full font-medium">2. Dossier</span>
</button>
<button className="flex flex-col items-center p-1.5 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 transition-all text-on-primary" >
<span className="w-4 h-4 rounded-full bg-surface-container-lowest text-primary font-bold flex items-center justify-center mb-1">3</span>
<span className="truncate w-full font-medium">3. Rule Offer</span>
</button>
<button className="flex flex-col items-center p-1.5 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 transition-all text-on-primary" >
<span className="w-4 h-4 rounded-full bg-surface-container-lowest text-primary font-bold flex items-center justify-center mb-1">4</span>
<span className="truncate w-full font-medium">4. Dispatch</span>
</button>
</div>
</div>
</section>
{/*  Metric Pulse Header  */}
<section className="px-gutter mb-space-sm flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<div className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></div>
<h1 className="font-headline-sm text-headline-sm text-on-surface">Retention Radar</h1>
<span className="font-label-code text-caption text-primary bg-secondary-container px-2 py-0.5 rounded-full font-semibold">200 Audited</span>
</div>
<div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant font-caption text-caption">
<span className="material-symbols-outlined text-[14px]">sync</span>
<span>Live Sync</span>
</div>
</section>
{/*  Primary Metric Summary Cards Bento Grid  */}
<section className="px-gutter grid grid-cols-2 gap-space-sm mb-space-lg">
{/*  Total Active  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-caption text-caption uppercase tracking-wider">Total Portfolio</span>
<span className="material-symbols-outlined text-[18px] text-primary">policy</span>
</div>
<div>
<div className="font-metric-stat text-metric-stat text-on-surface tracking-tight font-bold">200</div>
<div className="font-caption text-caption text-tertiary flex items-center gap-0.5 mt-0.5">
<span className="material-symbols-outlined text-[13px]">trending_up</span>
<span>99.4% active sync</span>
</div>
</div>
</div>
{/*  Premium at Risk (Critical)  */}
<div className="bg-error-container p-space-md rounded-full shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-error-container mb-space-xs">
<span className="font-caption text-caption uppercase tracking-wider font-semibold">Premium at Risk</span>
<span className="material-symbols-outlined text-[18px] text-error">dangerous</span>
</div>
<div>
<div className="font-metric-stat text-metric-stat text-error tracking-tight font-bold">₹4,52,000</div>
<div className="font-caption text-caption text-on-error-container opacity-80 mt-0.5">
          18 critical accounts
        </div>
</div>
</div>
{/*  Renewals Due This Month  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-caption text-caption uppercase tracking-wider">Due This Month</span>
<span className="material-symbols-outlined text-[18px] text-primary-container">calendar_clock</span>
</div>
<div>
<div className="font-metric-stat text-metric-stat text-on-surface tracking-tight font-bold">35</div>
<div className="font-caption text-caption text-on-surface-variant mt-0.5">
          17.5% of annual book
        </div>
</div>
</div>
{/*  Renewal Retention Ratio  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-caption text-caption uppercase tracking-wider">Renewal Rate</span>
<span className="material-symbols-outlined text-[18px] text-tertiary">verified</span>
</div>
<div>
<div className="font-metric-stat text-metric-stat text-tertiary tracking-tight font-bold">87.4%</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-0.5 mt-0.5">
<span>Target: 90.0%</span>
</div>
</div>
</div>
{/*  Dynamic Customers Contacted Counter (Updates on Action)  */}
<div className="bg-surface-container-high/60 p-space-md rounded-full shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-caption text-caption uppercase tracking-wider">Outreach Sent</span>
<span className="material-symbols-outlined text-[18px] text-primary">mark_chat_read</span>
</div>
<div>
<div className="flex items-baseline gap-1">
<span className="font-metric-stat text-metric-stat text-primary tracking-tight font-bold transition-all duration-300" id="contacted-counter">14</span>
<span className="font-caption text-caption text-on-surface-variant">/ 35 due</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1.5 overflow-hidden">
<div className="bg-primary h-1.5 rounded-full transition-all duration-500" id="contacted-progress" style={{"width": "40%"}}></div>
</div>
</div>
</div>
{/*  Lapsed Counter  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-caption text-caption uppercase tracking-wider">Lapsed MTD</span>
<span className="material-symbols-outlined text-[18px] text-outline">history_toggle_off</span>
</div>
<div>
<div className="font-metric-stat text-metric-stat text-outline tracking-tight font-bold">12</div>
<div className="font-caption text-caption text-error flex items-center gap-0.5 mt-0.5">
<span>₹1.42L loss avoided: 73%</span>
</div>
</div>
</div>
</section>
{/*  Priority Action Urgency Cards  */}
<section className="px-gutter mb-space-lg">
<div className="flex items-center justify-between mb-space-sm">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Intervention Queue</h2>
<span className="font-caption text-caption text-on-surface-variant">Ranked by Lapse Hazard</span>
</div>
<div className="space-y-space-sm">
{/*  Urgent 7 Days  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm relative overflow-hidden">
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
<div className="pl-space-xs flex items-start justify-between gap-space-sm">
<div className="space-y-1 min-w-0">
<div className="flex items-center gap-1.5">
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[11px] font-bold inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[12px] text-error">priority_high</span>
                CRITICAL • 7 DAYS
              </span>
<span className="font-caption text-caption text-error font-semibold">5 Policies</span>
</div>
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">
              ₹1,84,000 Premium Expiring Next 7 Days
            </div>
<p className="font-caption text-caption text-on-surface-variant leading-relaxed">
              3 customers flagged payment rejection friction; 2 active claims under dispute.
            </p>
</div>
<button className="shrink-0 h-10 px-3 bg-error text-on-error rounded-full font-body-sm text-[12px] font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-transform" >
<span>Review Now</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
{/*  Medium Priority 14 Days  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm relative overflow-hidden">
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-container"></div>
<div className="pl-space-xs flex items-start justify-between gap-space-sm">
<div className="space-y-1 min-w-0">
<div className="flex items-center gap-1.5">
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-code text-[11px] font-semibold inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]">schedule</span>
                ELEVATED RISK • 14 DAYS
              </span>
<span className="font-caption text-caption text-on-surface-variant font-medium">12 Policies</span>
</div>
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">
              ₹1,92,000 Scheduled For Early Outreach
            </div>
<p className="font-caption text-caption text-on-surface-variant leading-relaxed">
              Automated smart email scheduled. Tele-underwriter follow-up queued for 4 VIPs.
            </p>
</div>
<button className="shrink-0 h-10 px-3 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-full font-body-sm text-[12px] font-medium flex items-center gap-1 active:scale-95 transition-all" >
<span>Queue Batch</span>
</button>
</div>
</div>
{/*  Stable Renewals  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm relative overflow-hidden">
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary"></div>
<div className="pl-space-xs flex items-center justify-between gap-space-sm">
<div className="space-y-0.5 min-w-0">
<div className="flex items-center gap-1.5">
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-code text-[11px] font-semibold inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[12px] text-tertiary">verified_user</span>
                AUTO-RENEW READY
              </span>
<span className="font-caption text-caption text-tertiary font-semibold">18 Policies</span>
</div>
<div className="font-body-sm text-body-sm text-on-surface-variant truncate">
              ₹76,000 on Auto-Debit mandates (94% predicted conversion)
            </div>
</div>
<span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
</div>
</div>
</div>
</section>
{/*  Visual Analytics & Dynamic Distributions  */}
<section className="px-gutter mb-space-lg space-y-space-md">
{/*  Risk Distribution Doughnut & Ratio breakdown  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm">
<div className="flex items-center justify-between mb-space-sm">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Portfolio Risk Segments</h3>
<p className="font-caption text-caption text-on-surface-variant">Predictive machine-learning hazard tiers</p>
</div>
<span className="material-symbols-outlined text-outline text-[20px]">pie_chart</span>
</div>
<div className="flex items-center justify-around py-space-xs">
{/*  SVG Doughnut Chart  */}
<div className="relative w-28 h-28 flex items-center justify-center">
<svg className="w-28 h-28 transform -rotate-90" viewbox="0 0 36 36">
{/*  Background circle  */}
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5eeff" strokeWidth="4.5"></path>
{/*  Low Risk: 66% stroke-dasharray (green: #007d55)  */}
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#007d55" stroke-dasharray="66, 100" strokeWidth="4.5"></path>
{/*  Medium Risk: 25% (yellow: #eab308 offset 66)  */}
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" stroke-dasharray="25, 100" stroke-dashoffset="-66" strokeWidth="4.5"></path>
{/*  High Risk: 9% (error: #ba1a1a offset 91)  */}
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ba1a1a" stroke-dasharray="9, 100" stroke-dashoffset="-91" strokeWidth="4.5"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="font-metric-stat text-[16px] text-on-surface font-bold leading-none">200</span>
<span className="font-caption text-[10px] text-on-surface-variant uppercase mt-0.5">Policies</span>
</div>
</div>
{/*  Legend & Quantities  */}
<div className="space-y-space-xs font-body-sm text-[12px]">
<div className="flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
<span className="text-on-surface font-medium">Low Risk</span>
</div>
<span className="font-label-code text-on-surface font-semibold">132 (66%)</span>
</div>
<div className="flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
<span className="text-on-surface font-medium">Medium Risk</span>
</div>
<span className="font-label-code text-on-surface font-semibold">50 (25%)</span>
</div>
<div className="flex items-center justify-between gap-space-sm">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-error"></span>
<span className="text-error font-semibold">High Risk</span>
</div>
<span className="font-label-code text-error font-bold">18 (9%)</span>
</div>
</div>
</div>
</div>
{/*  Product Line Risk Exposure Breakdown  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm">
<div className="flex items-center justify-between mb-space-sm">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Premium at Risk by Line</h3>
<p className="font-caption text-caption text-on-surface-variant">Top vulnerable underwriting lines (Total: ₹4.52L)</p>
</div>
<span className="material-symbols-outlined text-outline text-[20px]">bar_chart</span>
</div>
<div className="space-y-space-sm">
{/*  Motor  */}
<div>
<div className="flex items-center justify-between text-body-sm font-caption mb-1">
<span className="text-on-surface font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">directions_car</span>
              Motor Comprehensive
            </span>
<span className="font-label-code text-on-surface font-semibold">₹1,80,000 (40%)</span>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-primary h-2.5 rounded-full" style={{"width": "40%"}}></div>
</div>
</div>
{/*  Health  */}
<div>
<div className="flex items-center justify-between text-body-sm font-caption mb-1">
<span className="text-on-surface font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-error">local_hospital</span>
              Health Mediclaim
            </span>
<span className="font-label-code text-error font-semibold">₹1,60,000 (35%)</span>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-error h-2.5 rounded-full" style={{"width": "35%"}}></div>
</div>
</div>
{/*  Life  */}
<div>
<div className="flex items-center justify-between text-body-sm font-caption mb-1">
<span className="text-on-surface font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-tertiary">shield</span>
              Life Term Shield
            </span>
<span className="font-label-code text-on-surface font-semibold">₹75,000 (17%)</span>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-2.5 rounded-full" style={{"width": "17%"}}></div>
</div>
</div>
{/*  Home  */}
<div>
<div className="flex items-center justify-between text-body-sm font-caption mb-1">
<span className="text-on-surface font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">home</span>
              Home &amp; Assets
            </span>
<span className="font-label-code text-on-surface font-semibold">₹37,000 (8%)</span>
</div>
<div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
<div className="bg-secondary h-2.5 rounded-full" style={{"width": "8%"}}></div>
</div>
</div>
</div>
</div>
{/*  Monthly Velocity SVG Sparkline Graphic  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm">
<div className="flex items-center justify-between mb-space-xs">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Renewal Trajectory</h3>
<p className="font-caption text-caption text-on-surface-variant">Last 6 Months: Saved vs Lapsed Dynamics</p>
</div>
<div className="flex items-center gap-2 font-caption text-[11px]">
<span className="flex items-center gap-1 text-tertiary"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Saved</span>
<span className="flex items-center gap-1 text-error"><span className="w-2 h-2 rounded-full bg-error"></span> Lapsed</span>
</div>
</div>
{/*  Inline SVG Trend Visualization  */}
<div className="w-full pt-space-xs">
<svg className="w-full h-20 overflow-visible" viewbox="0 0 320 85">
{/*  Subtle Grid Lines  */}
<line stroke="#e5eeff" stroke-dasharray="3,3" strokeWidth="1" x1="10" x2="310" y1="15" y2="15"></line>
<line stroke="#e5eeff" stroke-dasharray="3,3" strokeWidth="1" x1="10" x2="310" y1="45" y2="45"></line>
<line stroke="#e5eeff" stroke-dasharray="3,3" strokeWidth="1" x1="10" x2="310" y1="75" y2="75"></line>
{/*  Area Gradient Definition  */}
<defs>
<lineargradient id="savedGradient" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#007d55" stop-opacity="0.25"></stop>
<stop offset="100%" stop-color="#007d55" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
{/*  Saved Area and Path  */}
<polygon fill="url(#savedGradient)" points="10,65 60,52 110,48 160,35 210,25 260,20 310,12 310,80 10,80"></polygon>
<polyline fill="none" points="10,65 60,52 110,48 160,35 210,25 260,20 310,12" stroke="#007d55" strokeLinecap="round" strokeWidth="2.5"></polyline>
{/*  Lapsed Trend Path  */}
<polyline fill="none" points="10,40 60,42 110,50 160,58 210,62 260,68 310,72" stroke="#ba1a1a" stroke-dasharray="4,2" strokeWidth="2"></polyline>
{/*  Data Points on Saved Line  */}
<circle cx="210" cy="25" fill="#007d55" r="3.5"></circle>
<circle cx="260" cy="20" fill="#007d55" r="3.5"></circle>
<circle cx="310" cy="12" fill="#ffffff" r="4.5" stroke="#007d55" strokeWidth="2.5"></circle>
</svg>
<div className="flex justify-between items-center text-on-surface-variant font-label-code text-[10px] pt-1">
<span>NOV</span>
<span>DEC</span>
<span>JAN</span>
<span>FEB</span>
<span>MAR</span>
<span>APR</span>
<span className="font-bold text-primary">MAY (NOW)</span>
</div>
</div>
</div>
</section>
{/*  Live Critical High-Risk Policy Alert Cards  */}
<section className="px-gutter mb-space-lg" id="high-risk-section">
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-[22px]">emergency_home</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">High-Risk Interventions</h2>
</div>
<span className="font-caption text-caption text-error font-bold">18 Need Action</span>
</div>
<div className="space-y-space-sm" id="policy-cards-list">
{/*  Policy Card 1: Rahul Sharma  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm relative overflow-hidden transition-all duration-300" id="card-rahul">
<div className="flex items-start justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-sm min-w-0">
{/*  User Avatar Placeholder with detailed prompt  */}
<div className="relative shrink-0">
<img className="w-11 h-11 rounded-full object-cover shadow-sm" data-alt="Portrait photograph of a 38 year old Indian male executive in crisp formal navy blue shirt, soft studio lighting with warm friendly gaze on neutral corporate background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_5zhXd8lScNO1VnRtVJIuYgP5ZvWxId-rD2ofGmW13hoEGsJBchMr3D9z73hvzngdUC58i27LUCwE0_8QFi0DDDA_Q4d7POnE_SmVD-dZjJSXshWkb5IDg0S7mabwPobfGg3_jOXKFkN-A3lcSAJ9rJNDnqp1jcbqMQuAjQ3shCzzLdjt0lA8IgQRxZLFIfsb80rGYvR5kawhdU8tGAfLAnyIizFYHagdknNbszdqbD_VVweYNecQOQ"/>
<span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-error flex items-center justify-center text-on-error font-bold text-[9px]">!</span>
</div>
<div className="min-w-0">
<div className="font-body-md font-semibold text-on-surface truncate">Rahul Sharma</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span>POL-7842-H</span> • <span>Mediclaim Pro</span>
</div>
</div>
</div>
{/*  Risk Gauge Pill  */}
<div className="text-right shrink-0">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[13px] text-error">local_fire_department</span>
              78 / 100 Risk
            </span>
<div className="font-caption text-caption text-error font-semibold mt-0.5">Renews in 3 days</div>
</div>
</div>
{/*  Risk Factor Highlights  */}
<div className="bg-surface-container-low p-space-xs rounded-xl mb-space-sm text-on-surface-variant font-caption text-[11px] space-y-1">
<div className="flex items-center gap-1.5 text-error font-medium">
<span className="material-symbols-outlined text-[14px]">cancel</span>
<span>Trigger: Recent claim rejected (₹42,000 dental) + 3 late premium notices</span>
</div>
<div className="flex items-center justify-between text-on-surface">
<span>Annual Premium: <strong className="font-label-code text-on-surface font-semibold">₹28,500</strong></span>
<span className="text-tertiary font-semibold">LTV Value: ₹1.4L</span>
</div>
</div>
{/*  Card Action Toolbar  */}
<div className="flex items-center gap-space-xs">
<button className="flex-1 h-10 px-3 bg-primary text-on-primary rounded-full font-body-sm text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm" >
<span className="material-symbols-outlined text-[16px]">support_agent</span>
<span>Retain Policy</span>
</button>
<button className="h-10 px-3 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-full font-body-sm text-[12px] font-medium flex items-center gap-1 active:scale-95 transition-colors" >
<span className="material-symbols-outlined text-[16px] text-primary">send</span>
<span>Nudge</span>
</button>
</div>
</div>
{/*  Policy Card 2: Priya Patel  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm relative overflow-hidden transition-all duration-300" id="card-priya">
<div className="flex items-start justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-sm min-w-0">
{/*  User Avatar Placeholder with detailed prompt  */}
<div className="relative shrink-0">
<img className="w-11 h-11 rounded-full object-cover shadow-sm" data-alt="Portrait photography of an Indian businesswoman in modern business casual attire smiling confidently in a modern bright corporate office background with warm daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvJXc5uxADu3o7Xd4J_L0HkzaQLhIE0-lLsjup1fjghzaUI9vfh8CPVoBfYseefXUF0S11OH1guIc6xuxJh6TRbQYjJScZ4p1RN2mxHHatyGN9dLcG_S-4T1IFP59toqOKV_69FB_RlFeaJaVPBYcmOvQeqG1aOpYRsHs-lBqTft7We3Kfxs33HWOlB0U9UzvDmWApFIlBPSGymr7SOwNWv6s77mbAT68PFDN_MiCuWXdYjlsKN7JgCw"/>
<span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-error flex items-center justify-center text-on-error font-bold text-[9px]">!</span>
</div>
<div className="min-w-0">
<div className="font-body-md font-semibold text-on-surface truncate">Priya Patel</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span>POL-4190-M</span> • <span>Motor Comprehensive</span>
</div>
</div>
</div>
{/*  Risk Gauge Pill  */}
<div className="text-right shrink-0">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[13px] text-error">warning</span>
              82 / 100 Risk
            </span>
<div className="font-caption text-caption text-error font-semibold mt-0.5">Renews in 5 days</div>
</div>
</div>
{/*  Risk Factor Highlights  */}
<div className="bg-surface-container-low p-space-xs rounded-xl mb-space-sm text-on-surface-variant font-caption text-[11px] space-y-1">
<div className="flex items-center gap-1.5 text-error font-medium">
<span className="material-symbols-outlined text-[14px]">price_change</span>
<span>Trigger: Competitor portal quotation requested + Zero auto-pay mandate</span>
</div>
<div className="flex items-center justify-between text-on-surface">
<span>Annual Premium: <strong className="font-label-code text-on-surface font-semibold">₹18,400</strong></span>
<span className="text-tertiary font-semibold">Zero-Dep Tier 1</span>
</div>
</div>
{/*  Card Action Toolbar  */}
<div className="flex items-center gap-space-xs">
<button className="flex-1 h-10 px-3 bg-primary text-on-primary rounded-full font-body-sm text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm" >
<span className="material-symbols-outlined text-[16px]">support_agent</span>
<span>Retain Policy</span>
</button>
<button className="h-10 px-3 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-full font-body-sm text-[12px] font-medium flex items-center gap-1 active:scale-95 transition-colors" >
<span className="material-symbols-outlined text-[16px] text-primary">send</span>
<span>Nudge</span>
</button>
</div>
</div>
{/*  Policy Card 3: Amit Verma  */}
<div className="bg-surface-container-lowest p-space-md rounded-full shadow-sm relative overflow-hidden transition-all duration-300" id="card-amit">
<div className="flex items-start justify-between gap-space-xs mb-space-xs">
<div className="flex items-center gap-space-sm min-w-0">
{/*  User Avatar Placeholder with detailed prompt  */}
<div className="relative shrink-0">
<img className="w-11 h-11 rounded-full object-cover shadow-sm" data-alt="Close up photographic headshot of a mature 45 year old South Asian man with mild spectacles and refined grey flecked hair, professional calm demeanor, clear blue tinted indoor lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlqWN6tyOXVmKQCUSL36--iiHEb458e22PXCESQrFARnAO3VznQh-6E_aPkn1Lh7bm13HtS8vwyIe-dqkD4E-Rqg6fX0-A56ZhM6flsJrafOVLTBD8roKZzYzXjY3wgexWBNBYyneLHU7euWTeAkgckrgaHYCDBDB_cw2cV6PMSuaRqH2YwgqXeF8g2HvOADyOezrM3Tt9PyfH2k-u2E3lg3j8KCHPRbpXesidsb1ZptxhstTpnR5mtA"/>
<span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-error flex items-center justify-center text-on-error font-bold text-[9px]">!</span>
</div>
<div className="min-w-0">
<div className="font-body-md font-semibold text-on-surface truncate">Amit Verma</div>
<div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span>POL-9921-L</span> • <span>Life Term Shield</span>
</div>
</div>
</div>
{/*  Risk Gauge Pill  */}
<div className="text-right shrink-0">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
<span className="material-symbols-outlined text-[13px] text-error">trending_down</span>
              74 / 100 Risk
            </span>
<div className="font-caption text-caption text-error font-semibold mt-0.5">Renews in 6 days</div>
</div>
</div>
{/*  Risk Factor Highlights  */}
<div className="bg-surface-container-low p-space-xs rounded-xl mb-space-sm text-on-surface-variant font-caption text-[11px] space-y-1">
<div className="flex items-center gap-1.5 text-error font-medium">
<span className="material-symbols-outlined text-[14px]">forward_to_inbox</span>
<span>Trigger: Bounced email reminder &amp; updated phone number required</span>
</div>
<div className="flex items-center justify-between text-on-surface">
<span>Annual Premium: <strong className="font-label-code text-on-surface font-semibold">₹45,000</strong></span>
<span className="text-primary font-semibold">High Net Worth</span>
</div>
</div>
{/*  Card Action Toolbar  */}
<div className="flex items-center gap-space-xs">
<button className="flex-1 h-10 px-3 bg-primary text-on-primary rounded-full font-body-sm text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm" >
<span className="material-symbols-outlined text-[16px]">support_agent</span>
<span>Retain Policy</span>
</button>
<button className="h-10 px-3 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-full font-body-sm text-[12px] font-medium flex items-center gap-1 active:scale-95 transition-colors" >
<span className="material-symbols-outlined text-[16px] text-primary">send</span>
<span>Nudge</span>
</button>
</div>
</div>
</div>
</section>
{/*  Interactive Retention Drawer / Modal  */}
<div className="fixed inset-0 z-[60] bg-inverse-surface/40 backdrop-blur-sm hidden flex flex-col justify-end transition-opacity duration-300" id="action-drawer">
<div className="bg-surface-container-lowest rounded-t-[1.5rem] p-gutter max-h-[751px] overflow-y-auto space-y-space-md shadow-2xl transition-transform duration-300 transform translate-y-full" id="drawer-content">
{/*  Handle  */}
<div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto -mt-1 mb-2"></div>
{/*  Drawer Header  */}
<div className="flex items-start justify-between">
<div>
<span className="font-caption text-caption text-primary uppercase tracking-wider font-semibold">Intelligent Retention Workbench</span>
<h3 className="font-headline-md text-headline-md text-on-surface" id="modal-policy-holder">Policy Holder Name</h3>
<p className="font-label-code text-caption text-on-surface-variant" id="modal-policy-num">POL-0000-X</p>
</div>
<button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface" >
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
{/*  Live Diagnosis Grid  */}
<div className="grid grid-cols-2 gap-space-xs">
<div className="bg-surface-container-low p-space-sm rounded-xl">
<span className="font-caption text-[11px] text-on-surface-variant block">Policy Type</span>
<span className="font-body-sm text-[13px] font-semibold text-on-surface" id="modal-product">Health Shield</span>
</div>
<div className="bg-surface-container-low p-space-sm rounded-xl">
<span className="font-caption text-[11px] text-on-surface-variant block">Annual Value</span>
<span className="font-label-code text-[13px] font-bold text-primary" id="modal-premium">₹28,500</span>
</div>
<div className="bg-error-container/40 p-space-sm rounded-xl col-span-2">
<span className="font-caption text-[11px] text-error font-semibold block">Identified Churn Catalyst</span>
<span className="font-body-sm text-[12px] text-on-error-container" id="modal-reason">Unresolved Claim Grievance</span>
</div>
</div>
{/*  Recommended AI Retention Offer  */}
<div className="bg-secondary-container/40 p-space-md rounded-xl space-y-2">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
<span className="font-headline-sm text-[13px] text-on-surface font-semibold">Algorithm Recommended Counter-Offer</span>
</div>
<p className="font-body-sm text-body-sm text-on-secondary-container leading-relaxed" id="modal-recommendation">
          Generating strategy...
        </p>
<div className="flex items-center gap-2 pt-1">
<span className="font-caption text-caption text-tertiary flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
            91% Historical Acceptance
          </span>
</div>
</div>
{/*  Direct Action Buttons  */}
<div className="space-y-space-xs pt-space-xs">
<button className="w-full h-11 bg-primary text-on-primary rounded-full font-body-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform" >
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Apply Offer &amp; Send WhatsApp Link</span>
</button>
<button className="w-full h-11 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-full font-body-md text-body-md font-medium flex items-center justify-center gap-2 transition-colors" >
<span className="material-symbols-outlined text-[18px] text-tertiary">call</span>
<span>Initiate Agent Direct Outreach</span>
</button>
</div>
</div>
</div>
{/*  Client-Side Local Interactivity Script  */}

</div></main><nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]" data-active-classes="text-primary font-semibold"><div className="h-16 px-space-xs grid grid-cols-5 items-center"><a aria-current="page" className="flex flex-col items-center justify-center h-full transition-colors group text-primary font-semibold" data-path="overview" href="#"><span className="material-symbols-outlined text-[22px] group-hover:scale-105 transition-transform">space_dashboard</span><span className="font-caption text-[11px] leading-tight mt-0.5 truncate max-w-full px-0.5">Overview</span></a><a className="flex flex-col items-center justify-center h-full text-on-surface-variant hover:text-primary transition-colors group" data-path="portfolio" href="#"><span className="material-symbols-outlined text-[22px] group-hover:scale-105 transition-transform">calendar_month</span><span className="font-caption text-[11px] leading-tight mt-0.5 truncate max-w-full px-0.5">Portfolio</span></a><a className="flex flex-col items-center justify-center h-full text-on-surface-variant hover:text-primary transition-colors group" data-path="lapse-risk" href="#"><span className="material-symbols-outlined text-[22px] group-hover:scale-105 transition-transform">warning</span><span className="font-caption text-[11px] leading-tight mt-0.5 truncate max-w-full px-0.5">Lapse Risk</span></a><a className="flex flex-col items-center justify-center h-full text-on-surface-variant hover:text-primary transition-colors group" data-path="offers" href="#"><span className="material-symbols-outlined text-[22px] group-hover:scale-105 transition-transform">local_offer</span><span className="font-caption text-[11px] leading-tight mt-0.5 truncate max-w-full px-0.5">Offers</span></a><a className="flex flex-col items-center justify-center h-full text-on-surface-variant hover:text-primary transition-colors group" data-path="reminders" href="#"><span className="material-symbols-outlined text-[22px] group-hover:scale-105 transition-transform">forward_to_inbox</span><span className="font-caption text-[11px] leading-tight mt-0.5 truncate max-w-full px-0.5">Reminders</span></a></div></nav>
    </div>
  );
}
