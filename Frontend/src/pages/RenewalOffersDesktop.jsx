import React, { useState } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function RenewalOffersDesktop() {
  React.useEffect(() => {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastCloseBtn = document.getElementById('toastCloseBtn');
    let toastTimeout;

    function showToast(title, message) {
      if (!toast) return;
      clearTimeout(toastTimeout);
      if (toastTitle) toastTitle.textContent = title;
      if (toastMessage) toastMessage.textContent = message;
      toast.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
      toast.classList.add('translate-y-0', 'opacity-100');

      toastTimeout = setTimeout(() => {
        hideToast();
      }, 4500);
    }

    function hideToast() {
      if (!toast) return;
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
    }

    if (toastCloseBtn) {
      toastCloseBtn.onclick = hideToast;
    }

    document.querySelectorAll('.btn-accept').forEach(btn => {
      btn.onclick = function() {
        const name = this.getAttribute('data-name') || 'Customer';
        const offer = this.getAttribute('data-offer') || 'Prescribed Counter-Offer';
        
        this.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span> Dispatched';
        this.classList.remove('bg-primary-container');
        this.classList.add('bg-tertiary-container');
        this.disabled = true;

        showToast('Offer Applied', "Offer '" + offer + "' successfully dispatched to " + name + " via WhatsApp.");
      };
    });

    document.querySelectorAll('.btn-decline').forEach(btn => {
      btn.onclick = function() {
        const card = this.closest('.policy-card');
        if (card) {
          card.style.opacity = '0.4';
          showToast('Offer Declined', 'Policy marked for manual retention review in underwriting inbox.');
        }
      };
    });

    const batchBtn = document.getElementById('batchAcceptBtn');
    if (batchBtn) {
      batchBtn.onclick = function() {
        showToast('Batch Processing Triggered', 'Dispatched 200 tailored retention offers across active WhatsApp and SMS connectors.');
        document.querySelectorAll('.btn-accept').forEach(b => {
          b.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span> Dispatched';
          b.classList.remove('bg-primary-container');
          b.classList.add('bg-tertiary-container');
          b.disabled = true;
        });
      };
    }

    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.policy-card');

    pills.forEach(pill => {
      pill.onclick = function() {
        pills.forEach(p => {
          p.classList.remove('bg-primary', 'text-on-primary');
          p.classList.add('bg-surface-container', 'text-on-surface');
        });
        this.classList.remove('bg-surface-container', 'text-on-surface');
        this.classList.add('bg-primary', 'text-on-primary');

        const cat = this.getAttribute('data-category');
        cards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });

    const timer = setTimeout(() => {
      showToast('Offer Applied', 'Loyalty Discount dispatched to Rahul Sharma via WhatsApp');
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(toastTimeout);
    };
  }, []);

  return (
    <DesktopLayout activePath="/renewal-offers">
      <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full">
<div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg w-full max-w-7xl mx-auto">
{/*  Top Retention Engine Operational Header  */}
<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg relative overflow-hidden">
<div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md z-10">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-caption text-caption text-primary font-semibold tracking-wider uppercase">Algorithmic Underwriting Node</span>
<span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-code text-caption font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Smart Retention Active
            </span>
<span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-code text-caption">
<span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
              99.4% Match Accuracy
            </span>
<span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-code text-caption">
<span className="material-symbols-outlined text-[14px] text-primary">rule</span>
              6 Active Rules
            </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Smart Retention Recommendation Engine</h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Real-time heuristic evaluation paired with predictive tenure models. Automated counter-offers target high-lapse segments prior to scheduled renewal drop-offs.
          </p>
</div>
<div className="flex items-center gap-space-sm self-start lg:self-center shrink-0">
<button className="h-10 px-space-lg rounded-xl bg-primary-container text-on-primary font-body-md font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all" id="batchAcceptBtn" type="button">
<span className="material-symbols-outlined text-[18px]">done_all</span>
<span>Batch Accept (200)</span>
</button>
<button className="h-10 px-space-md rounded-xl bg-surface-container text-on-surface font-body-md flex items-center gap-space-xs hover:bg-surface-container-high transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">tune</span>
<span className="hidden sm:inline">Engine Config</span>
</button>
</div>
</div>
{/*  Filter Bar  */}
<div className="flex items-center justify-between gap-space-md pt-space-xs flex-wrap">
<div className="flex items-center gap-space-xs overflow-x-auto pb-1 max-w-full">
<button className="filter-pill px-space-md py-1.5 rounded-full bg-primary text-on-primary font-caption text-caption font-semibold flex items-center gap-1.5 shrink-0 shadow-sm" data-category="all">
<span>All Offers</span>
<span className="bg-primary-fixed text-on-primary-fixed px-1.5 py-0.2 rounded-full font-label-code text-[10px]">200</span>
</button>
<button className="filter-pill px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-caption text-caption hover:bg-surface-container-high shrink-0 transition-colors" data-category="loyalty">
<span>Loyalty Discount</span>
<span className="bg-surface-container-highest text-on-surface-variant px-1.5 py-0.2 rounded-full font-label-code text-[10px]">68</span>
</button>
<button className="filter-pill px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-caption text-caption hover:bg-surface-container-high shrink-0 transition-colors" data-category="installment">
<span>Installment Plan</span>
<span className="bg-surface-container-highest text-on-surface-variant px-1.5 py-0.2 rounded-full font-label-code text-[10px]">45</span>
</button>
<button className="filter-pill px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-caption text-caption hover:bg-surface-container-high shrink-0 transition-colors" data-category="ncb">
<span>NCB Booster</span>
<span className="bg-surface-container-highest text-on-surface-variant px-1.5 py-0.2 rounded-full font-label-code text-[10px]">52</span>
</button>
<button className="filter-pill px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-caption text-caption hover:bg-surface-container-high shrink-0 transition-colors" data-category="coverage">
<span>Coverage Adjustment</span>
<span className="bg-surface-container-highest text-on-surface-variant px-1.5 py-0.2 rounded-full font-label-code text-[10px]">35</span>
</button>
</div>
<div className="flex items-center gap-space-sm text-on-surface-variant font-caption text-caption">
<span className="material-symbols-outlined text-[16px]">sync</span>
<span>Last automated sync: <span className="font-label-code text-on-surface font-medium">3m ago</span></span>
</div>
</div>
</section>
{/*  Visual Rule Automation Logic Matrix  */}
<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
<div className="flex items-center justify-between flex-wrap gap-space-xs">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Heuristic Rule Matrix</h2>
</div>
<div className="flex items-center gap-space-xs font-label-code text-caption text-on-surface-variant">
<span>Execution Latency: <strong className="text-tertiary-container">14ms</strong></span>
<span className="inline-block w-1 h-1 rounded-full bg-outline"></span>
<span>Intervention Threshold: ≥ 40 Risk Score</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/*  Rule 1  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-primary font-semibold">RULE-01</span>
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[10px] font-semibold">High Risk</span>
</div>
<div className="flex flex-col gap-1 mt-1">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Trigger Condition</span>
<p className="font-body-sm text-body-sm text-on-surface font-medium">Risk Score &gt; 70 &amp; Tenure ≥ 5 yrs</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
<span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
            </span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Loyalty Discount: 12% off + Free Health Checkup</span>
</div>
</div>
{/*  Rule 2  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-primary font-semibold">RULE-02</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-code text-[10px] font-semibold">Friction Point</span>
</div>
<div className="flex flex-col gap-1 mt-1">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Trigger Condition</span>
<p className="font-body-sm text-body-sm text-on-surface font-medium">≥ 2 Late Payments + Cash Friction</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
<span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
            </span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Installment Plan: 3-Part 0% Interest Split</span>
</div>
</div>
{/*  Rule 3  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-primary font-semibold">RULE-03</span>
<span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-code text-[10px] font-semibold">Retention Boost</span>
</div>
<div className="flex flex-col gap-1 mt-1">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Trigger Condition</span>
<p className="font-body-sm text-body-sm text-on-surface font-medium">Zero Claims Recorded + Low Risk</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
<span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
            </span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold">NCB Protection Booster (50% Shield)</span>
</div>
</div>
{/*  Rule 4  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-primary font-semibold">RULE-04</span>
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[10px] font-semibold">Rate Sensitivity</span>
</div>
<div className="flex flex-col gap-1 mt-1">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Trigger Condition</span>
<p className="font-body-sm text-body-sm text-on-surface font-medium">Premium Shock (&gt; 15% annual hike)</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
<span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
            </span>
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Rider Optimization (-8% Premium Net)</span>
</div>
</div>
</div>
</section>
{/*  Policy Intervention Ledger / Offer Cards Grid  */}
<section className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Prescribed Interventions</h2>
<p className="font-caption text-caption text-on-surface-variant">Recommended actions requiring underwriter validation or automated queue dispatch</p>
</div>
<div className="flex items-center gap-space-xs">
<span className="font-caption text-caption text-on-surface-variant">Showing <strong className="text-on-surface font-label-code">4</strong> critical priorities</span>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
{/*  Offer Card 1: Rahul Sharma  */}
<div className="policy-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-lg flex flex-col justify-between gap-space-md" data-category="loyalty">
<div className="flex flex-col gap-space-md">
{/*  Header Row  */}
<div className="flex items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-[24px]">health_and_safety</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Rahul Sharma</h3>
<span className="font-label-code text-caption px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface-variant">#HS-90412</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Health Shield Comprehensive • 5 Yrs Tenure</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-error-container text-on-error-container shrink-0">
<span className="material-symbols-outlined text-[16px] text-error">warning</span>
<span className="font-label-code text-caption font-semibold">Risk: 78</span>
</div>
</div>
{/*  AI Recommendation Highlight Banner  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
<span className="font-caption text-caption text-primary font-semibold uppercase">AI Recommended Offer</span>
</div>
<span className="font-label-code text-[11px] text-on-surface-variant font-medium">Rule-01 Applied</span>
</div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Loyalty Discount: 12% off + Free Family Health Checkup</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Addresses price sensitivity while leveraging strong 5-year relationship record.</p>
</div>
{/*  Retention Projection Progress Comparison  */}
<div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between font-caption text-caption">
<span className="text-on-surface-variant">Base Retention Probability</span>
<span className="font-label-code text-on-surface font-semibold">45%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
<div className="bg-outline h-full" style={{"width": "45%"}}></div>
</div>
<div className="flex items-center justify-between font-caption text-caption pt-1">
<span className="text-tertiary-container font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> Projected with Offer
                </span>
<div className="flex items-center gap-space-xs">
<span className="font-metric-stat text-body-md text-tertiary-container font-bold">79%</span>
<span className="font-label-code text-caption px-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">+34% Boost</span>
</div>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden flex">
<div className="bg-tertiary-container h-full" style={{"width": "79%"}}></div>
</div>
</div>
</div>
{/*  Actions  */}
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="btn-decline px-space-md h-9 rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Decline
            </button>
<button className="btn-change px-space-md h-9 rounded-xl bg-surface-container text-primary font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Change Offer
            </button>
<button className="btn-accept px-space-lg h-9 rounded-xl bg-primary-container text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all" data-name="Rahul Sharma" data-offer="Loyalty Discount (12% off + Free Checkup)" type="button">
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Accept Offer</span>
</button>
</div>
</div>
{/*  Offer Card 2: Sunita Rao  */}
<div className="policy-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-lg flex flex-col justify-between gap-space-md" data-category="installment">
<div className="flex flex-col gap-space-md">
{/*  Header Row  */}
<div className="flex items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-[24px]">directions_car</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Sunita Rao</h3>
<span className="font-label-code text-caption px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface-variant">#MC-88120</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Motor Comprehensive • 4 Late Payments</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-error-container text-on-error-container shrink-0">
<span className="material-symbols-outlined text-[16px] text-error">warning</span>
<span className="font-label-code text-caption font-semibold">Risk: 88</span>
</div>
</div>
{/*  AI Recommendation Highlight Banner  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
<span className="font-caption text-caption text-primary font-semibold uppercase">AI Recommended Offer</span>
</div>
<span className="font-label-code text-[11px] text-on-surface-variant font-medium">Rule-02 Applied</span>
</div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Installment Payment: 3-Part Zero-Interest Split</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Smooths out short-term liquidity bottlenecks with automated e-mandate scheduling.</p>
</div>
{/*  Retention Projection Progress Comparison  */}
<div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between font-caption text-caption">
<span className="text-on-surface-variant">Base Retention Probability</span>
<span className="font-label-code text-on-surface font-semibold">32%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
<div className="bg-outline h-full" style={{"width": "32%"}}></div>
</div>
<div className="flex items-center justify-between font-caption text-caption pt-1">
<span className="text-tertiary-container font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> Projected with Offer
                </span>
<div className="flex items-center gap-space-xs">
<span className="font-metric-stat text-body-md text-tertiary-container font-bold">73%</span>
<span className="font-label-code text-caption px-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">+41% Boost</span>
</div>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden flex">
<div className="bg-tertiary-container h-full" style={{"width": "73%"}}></div>
</div>
</div>
</div>
{/*  Actions  */}
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="btn-decline px-space-md h-9 rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Decline
            </button>
<button className="btn-change px-space-md h-9 rounded-xl bg-surface-container text-primary font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Change Offer
            </button>
<button className="btn-accept px-space-lg h-9 rounded-xl bg-primary-container text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all" data-name="Sunita Rao" data-offer="3-Part Zero-Interest Split" type="button">
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Accept Offer</span>
</button>
</div>
</div>
{/*  Offer Card 3: Dr. Arvind Joshi  */}
<div className="policy-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-lg flex flex-col justify-between gap-space-md" data-category="ncb">
<div className="flex flex-col gap-space-md">
{/*  Header Row  */}
<div className="flex items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-[24px]">verified</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dr. Arvind Joshi</h3>
<span className="font-label-code text-caption px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface-variant">#HS-11204</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Health Super Policy • 0 Claims Recorded</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant shrink-0">
<span className="material-symbols-outlined text-[16px] text-tertiary">shield</span>
<span className="font-label-code text-caption font-semibold">Risk: 22 Low</span>
</div>
</div>
{/*  AI Recommendation Highlight Banner  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
<span className="font-caption text-caption text-primary font-semibold uppercase">AI Recommended Offer</span>
</div>
<span className="font-label-code text-[11px] text-on-surface-variant font-medium">Rule-03 Applied</span>
</div>
<p className="font-body-md text-body-md text-on-surface font-semibold">No-Claim Bonus Protection (NCB Booster 50%)</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Shields accumulated NCB discount tier from forfeiture in minor diagnostic incidents.</p>
</div>
{/*  Retention Projection Progress Comparison  */}
<div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between font-caption text-caption">
<span className="text-on-surface-variant">Base Retention Probability</span>
<span className="font-label-code text-on-surface font-semibold">78%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
<div className="bg-outline h-full" style={{"width": "78%"}}></div>
</div>
<div className="flex items-center justify-between font-caption text-caption pt-1">
<span className="text-tertiary-container font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> Projected with Offer
                </span>
<div className="flex items-center gap-space-xs">
<span className="font-metric-stat text-body-md text-tertiary-container font-bold">96%</span>
<span className="font-label-code text-caption px-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">+18% Boost</span>
</div>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden flex">
<div className="bg-tertiary-container h-full" style={{"width": "96%"}}></div>
</div>
</div>
</div>
{/*  Actions  */}
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="btn-decline px-space-md h-9 rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Decline
            </button>
<button className="btn-change px-space-md h-9 rounded-xl bg-surface-container text-primary font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Change Offer
            </button>
<button className="btn-accept px-space-lg h-9 rounded-xl bg-primary-container text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all" data-name="Dr. Arvind Joshi" data-offer="NCB Booster (50%)" type="button">
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Accept Offer</span>
</button>
</div>
</div>
{/*  Offer Card 4: Deepa Nair  */}
<div className="policy-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-lg flex flex-col justify-between gap-space-md" data-category="coverage">
<div className="flex flex-col gap-space-md">
{/*  Header Row  */}
<div className="flex items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-[24px]">favorite</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Deepa Nair</h3>
<span className="font-label-code text-caption px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface-variant">#TL-77390</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">Term Life Secure • +18% Rate Hike Triggered</span>
</div>
</div>
<div className="flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-error-container text-on-error-container shrink-0">
<span className="material-symbols-outlined text-[16px] text-error">warning</span>
<span className="font-label-code text-caption font-semibold">Risk: 65</span>
</div>
</div>
{/*  AI Recommendation Highlight Banner  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
<span className="font-caption text-caption text-primary font-semibold uppercase">AI Recommended Offer</span>
</div>
<span className="font-label-code text-[11px] text-on-surface-variant font-medium">Rule-04 Applied</span>
</div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Premium Reduction: Adjust Rider Coverage (-8% Net)</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Removes redundant accidental dismemberment rider, countering premium shock.</p>
</div>
{/*  Retention Projection Progress Comparison  */}
<div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between font-caption text-caption">
<span className="text-on-surface-variant">Base Retention Probability</span>
<span className="font-label-code text-on-surface font-semibold">51%</span>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
<div className="bg-outline h-full" style={{"width": "51%"}}></div>
</div>
<div className="flex items-center justify-between font-caption text-caption pt-1">
<span className="text-tertiary-container font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> Projected with Offer
                </span>
<div className="flex items-center gap-space-xs">
<span className="font-metric-stat text-body-md text-tertiary-container font-bold">80%</span>
<span className="font-label-code text-caption px-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">+29% Boost</span>
</div>
</div>
<div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden flex">
<div className="bg-tertiary-container h-full" style={{"width": "80%"}}></div>
</div>
</div>
</div>
{/*  Actions  */}
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="btn-decline px-space-md h-9 rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Decline
            </button>
<button className="btn-change px-space-md h-9 rounded-xl bg-surface-container text-primary font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors" type="button">
              Change Offer
            </button>
<button className="btn-accept px-space-lg h-9 rounded-xl bg-primary-container text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all" data-name="Deepa Nair" data-offer="Rider Adjustment (-8%)" type="button">
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Accept Offer</span>
</button>
</div>
</div>
</div>
</section>
{/*  Audit Trace & Queue Status Metric Sub-Bar  */}
<section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
<div className="flex items-center gap-space-md flex-wrap">
<span className="flex items-center gap-1 font-caption text-caption">
<span className="material-symbols-outlined text-[16px] text-tertiary-container">verified</span>
          Multi-Agent Consensus: <strong>Active</strong>
</span>
<span className="flex items-center gap-1 font-caption text-caption">
<span className="material-symbols-outlined text-[16px] text-primary">forward_to_inbox</span>
          Omnichannel Delivery: <strong>WhatsApp / SMS / App Push</strong>
</span>
</div>
<div className="flex items-center gap-space-sm">
<span className="font-caption text-caption text-on-surface-variant">Auto-dispatch queue: <strong className="text-on-surface font-label-code">196 pending</strong></span>
<button className="text-primary font-caption text-caption font-semibold hover:underline" type="button">View Pipeline Log →</button>
</div>
</section>
</div>
{/*  Live Simulation Toast Notification  */}
<aside className="fixed bottom-6 right-6 z-50 transform translate-y-32 opacity-0 transition-all duration-300 pointer-events-none" id="toastNotification">
<div className="bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-xl flex items-center gap-space-md max-w-md pointer-events-auto">
<div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-tertiary text-[18px]">send</span>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm text-inverse-on-surface font-semibold" id="toastTitle">Offer Dispatched</span>
<span className="font-caption text-caption text-inverse-on-surface/80" id="toastMessage">Offer Applied: Loyalty Discount dispatched to Rahul Sharma via WhatsApp</span>
</div>
<button className="ml-auto text-inverse-on-surface/60 hover:text-inverse-on-surface p-1" id="toastCloseBtn" type="button">
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</aside>
</div>
</main>
    </DesktopLayout>
  );
}
