import React, { useState } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function SmartRemindersDesktop() {
  React.useEffect(() => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const queueCards = document.querySelectorAll('[data-priority]');

    filterTabs.forEach(tab => {
      tab.onclick = () => {
        filterTabs.forEach(t => {
          t.classList.remove('bg-primary', 'text-on-primary');
          t.classList.add('text-on-surface-variant', 'hover:bg-surface-container');
        });
        tab.classList.remove('text-on-surface-variant', 'hover:bg-surface-container');
        tab.classList.add('bg-primary', 'text-on-primary');

        const filterVal = tab.getAttribute('data-filter');
        queueCards.forEach(card => {
          if (filterVal === 'all') {
            card.style.display = 'block';
          } else if (filterVal === 'urgent' && card.getAttribute('data-priority') === 'urgent') {
            card.style.display = 'block';
          } else if (filterVal === 'high' && card.getAttribute('data-priority') === 'high') {
            card.style.display = 'block';
          } else if (filterVal === 'medium' && card.getAttribute('data-priority') === 'medium') {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });

    const channelBtns = document.querySelectorAll('.channel-btn');
    channelBtns.forEach(btn => {
      btn.onclick = () => {
        channelBtns.forEach(b => {
          b.classList.remove('bg-primary', 'text-on-primary', 'font-semibold');
          b.classList.add('text-on-surface-variant', 'hover:text-on-surface', 'font-medium');
        });
        btn.classList.add('bg-primary', 'text-on-primary', 'font-semibold');
        btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'font-medium');
      };
    });

    document.querySelectorAll('.mark-contacted-btn').forEach(btn => {
      btn.onclick = (e) => {
        const card = e.currentTarget.closest('[data-priority]');
        if (card) {
          card.style.transition = 'all 0.3s ease';
          card.style.opacity = '0.5';
          card.style.transform = 'translateX(6px)';
          e.currentTarget.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span> Contacted!';
          e.currentTarget.classList.remove('text-tertiary');
          e.currentTarget.classList.add('text-primary');
        }
      };
    });

    const confirmBtn = document.getElementById('dispatchConfirmBtn');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Dispatching...';
        confirmBtn.disabled = true;
        setTimeout(() => {
          confirmBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span> Dispatched Successfully!';
          confirmBtn.classList.remove('bg-primary');
          confirmBtn.classList.add('bg-tertiary');
          setTimeout(() => {
            confirmBtn.innerHTML = originalText;
            confirmBtn.classList.remove('bg-tertiary');
            confirmBtn.classList.add('bg-primary');
            confirmBtn.disabled = false;
          }, 2000);
        }, 700);
      };
    }

    const batchBtn = document.getElementById('batchDispatchBtn');
    if (batchBtn) {
      batchBtn.onclick = () => {
        batchBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Processing Queue...';
        setTimeout(() => {
          batchBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">done_all</span> 4 Urgent Reminders Sent!';
          setTimeout(() => {
            batchBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">bolt</span> Batch Dispatch All Urgent (4)';
          }, 2500);
        }, 1000);
      };
    }
  }, []);

  return (
    <DesktopLayout activePath="/smart-reminders">
      <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full">
<div className="w-full max-w-[1440px] mx-auto px-space-base md:px-margin-desktop py-space-lg flex flex-col gap-space-lg">
{/*  Breadcrumb & Top Command Bar  */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
<div className="flex flex-col gap-space-2xs">
<div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
<span>Campaign Operations</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary font-semibold">Smart Renewal Reminders</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span>Automated Outreach Hub</span>
</div>
<div className="flex items-center gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Smart Renewal Reminders &amp; Outreach Hub</h1>
<span className="inline-flex items-center gap-1 px-space-xs py-space-2xs bg-tertiary/10 text-tertiary rounded-full font-label-code text-body-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Real-Time Engine Active
          </span>
</div>
</div>
{/*  Quick Action Buttons  */}
<div className="flex items-center gap-space-sm">
<button className="h-10 px-space-md bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-xl font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" type="button">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span>
<span>Cadence Rules</span>
</button>
<button className="h-10 px-space-lg bg-primary hover:bg-primary-container text-on-primary rounded-xl font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" id="batchDispatchBtn" type="button">
<span className="material-symbols-outlined text-[18px]">bolt</span>
<span>Batch Dispatch All Urgent (4)</span>
</button>
</div>
</div>
{/*  Metrics & Cycle Progress Strip  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/*  Metric 1: Pending  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase text-on-surface-variant tracking-wider font-semibold">Pending Reminders</span>
<span className="p-space-2xs rounded-lg bg-primary/10 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">schedule</span>
</span>
</div>
<div className="mt-space-sm">
<div className="flex items-baseline gap-space-xs">
<span className="font-display text-display text-on-surface">24</span>
<span className="font-caption text-caption text-error font-medium">4 Critical &lt; 72h</span>
</div>
<div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
<span>₹18.4L premium at immediate risk</span>
</div>
</div>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
</div>
{/*  Metric 2: Completed Today  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase text-on-surface-variant tracking-wider font-semibold">Contacted Today</span>
<span className="p-space-2xs rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">check_circle</span>
</span>
</div>
<div className="mt-space-sm">
<div className="flex items-baseline justify-between">
<div className="flex items-baseline gap-space-xs">
<span className="font-display text-display text-on-surface">14</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">/ 38 planned</span>
</div>
<span className="font-label-code text-label-code font-semibold text-tertiary">37% Goal</span>
</div>
{/*  Tiny Bar Progress  */}
<div className="w-full bg-surface-container h-2 rounded-full mt-space-xs overflow-hidden">
<div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{"width": "37%"}}></div>
</div>
</div>
</div>
{/*  Metric 3: Response Rate  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase text-on-surface-variant tracking-wider font-semibold">Retention Conversion</span>
<span className="p-space-2xs rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">trending_up</span>
</span>
</div>
<div className="mt-space-sm">
<div className="flex items-baseline gap-space-xs">
<span className="font-display text-display text-on-surface">72%</span>
<span className="font-label-code text-label-code text-tertiary flex items-center">
<span className="material-symbols-outlined text-[14px]">arrow_upward</span>+4.2%
            </span>
</div>
<div className="mt-space-xs text-on-surface-variant font-caption text-caption">
<span>Vs. prior cycle (67.8% benchmark)</span>
</div>
</div>
</div>
{/*  Metric 4: AI Queue Velocity  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-start justify-between">
<span className="font-caption text-caption uppercase text-on-surface-variant tracking-wider font-semibold">Optimal Window Peak</span>
<span className="p-space-2xs rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">offline_bolt</span>
</span>
</div>
<div className="mt-space-sm">
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-lg text-headline-lg text-primary font-bold">4:00 - 6:00 PM</span>
</div>
<div className="mt-space-xs text-on-surface-variant font-caption text-caption">
<span>+28% propensity surge forecasted</span>
</div>
</div>
</div>
</div>
{/*  Filter Pills & Queue Meta Bar  */}
<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-xs rounded-xl shadow-sm">
<div className="flex flex-wrap items-center gap-space-xs">
<button className="filter-tab px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-body-sm font-semibold transition-colors flex items-center gap-1" data-filter="all">
<span>All</span>
<span className="bg-on-primary/20 text-on-primary px-1.5 py-0.5 rounded-full text-caption font-label-code">24</span>
</button>
<button className="filter-tab px-space-md py-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant font-body-sm font-medium transition-colors flex items-center gap-1" data-filter="urgent">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span>Urgent (&lt; 3d)</span>
<span className="bg-error-container text-on-error-container px-1.5 py-0.5 rounded-full text-caption font-label-code font-bold">4</span>
</button>
<button className="filter-tab px-space-md py-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant font-body-sm font-medium transition-colors flex items-center gap-1" data-filter="high">
<span>High Priority (&lt; 7d)</span>
<span className="bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full text-caption font-label-code">8</span>
</button>
<button className="filter-tab px-space-md py-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant font-body-sm font-medium transition-colors flex items-center gap-1" data-filter="medium">
<span>Medium (&lt; 14d)</span>
<span className="bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full text-caption font-label-code">7</span>
</button>
<button className="filter-tab px-space-md py-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant font-body-sm font-medium transition-colors flex items-center gap-1" data-filter="completed">
<span>Contacted</span>
<span className="bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded-full text-caption font-label-code font-semibold">14</span>
</button>
</div>
<div className="flex items-center gap-space-xs px-space-sm text-on-surface-variant font-caption text-caption justify-end">
<span className="material-symbols-outlined text-[16px]">sort</span>
<span>Ranked by ML Lapse Propensity</span>
</div>
</div>
{/*  Main Dual Workbench Grid  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/*  Left Column: Master Smart Outreach Queue (7 or 8 columns on desktop)  */}
<div className="xl:col-span-8 flex flex-col gap-space-md">
{/*  Queue Card 1: Rahul Sharma (URGENT)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md relative overflow-hidden" data-priority="urgent">
{/*  Persistent Left Severity Accent Strip  */}
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
<div className="pl-space-xs flex flex-col gap-space-sm">
{/*  Header Row  */}
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-display text-body-md font-bold">
                  RS
                </div>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Rahul Sharma</span>
<span className="font-label-code text-caption text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">#POL-1082</span>
<span className="px-space-xs py-space-2xs bg-error-container text-on-error-container rounded-full font-label-code text-caption font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">emergency_home</span>
                      Lapse Risk: 78/100
                    </span>
</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant mt-0.5">
<span className="font-medium text-on-surface">Health Shield Comprehensive</span>
<span>•</span>
<span>Annual Premium: <strong className="text-on-surface font-label-code">₹28,500</strong></span>
<span>•</span>
<span className="text-error font-semibold flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">timer</span>
                      Renews Oct 28 (in 3 days)
                    </span>
</div>
</div>
</div>
{/*  Channel & Velocity Pill  */}
<div className="flex flex-col items-end gap-1">
<div className="inline-flex items-center gap-1 px-space-sm py-1 bg-surface-container rounded-lg font-caption text-caption font-semibold text-primary">
<span className="material-symbols-outlined text-[15px]">call</span>
                  Prescribed: Direct Phone Call
                </div>
<span className="font-caption text-[11px] text-tertiary font-medium">Optimal Window: 4:00 PM – 6:00 PM (84% Conv.)</span>
</div>
</div>
{/*  Context Details & Recommendation Strip  */}
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm text-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant font-medium">Prescribed Retention Bundle:</span>
<span className="text-on-surface font-semibold">Loyalty Discount 12% + Free Comprehensive Annual Health Checkup</span>
</div>
</div>
<div className="text-on-surface-variant text-caption flex items-center gap-1 bg-surface-container-lowest px-space-xs py-1 rounded">
<span className="material-symbols-outlined text-[14px] text-error">warning</span>
<span>Friction: Prior Claim Delay (Resolved Oct 12)</span>
</div>
</div>
{/*  Action Controls Row  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">call</span>
<span>Initiate Priority Call</span>
</button>
<button className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm font-medium transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">event</span>
<span>Schedule Call</span>
</button>
</div>
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg font-caption text-caption transition-colors flex items-center gap-1" title="Snooze for 12 hours">
<span className="material-symbols-outlined text-[16px]">snooze</span>
<span>Snooze 12h</span>
</button>
<button className="h-9 px-space-sm text-tertiary hover:bg-tertiary/10 rounded-lg font-caption text-caption font-semibold transition-colors flex items-center gap-1 mark-contacted-btn">
<span className="material-symbols-outlined text-[18px]">done_all</span>
<span>Mark Contacted</span>
</button>
</div>
</div>
</div>
</div>
{/*  Queue Card 2: Sunita Rao (URGENT)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md relative overflow-hidden" data-priority="urgent">
{/*  Persistent Left Severity Accent Strip  */}
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
<div className="pl-space-xs flex flex-col gap-space-sm">
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-display text-body-md font-bold">
                  SR
                </div>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Sunita Rao</span>
<span className="font-label-code text-caption text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">#POL-1044 / #MC-88120</span>
<span className="px-space-xs py-space-2xs bg-error-container text-on-error-container rounded-full font-label-code text-caption font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">emergency_home</span>
                      Lapse Risk: 88/100
                    </span>
</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant mt-0.5">
<span className="font-medium text-on-surface">Motor Comprehensive (Mercedes C-Class)</span>
<span>•</span>
<span>Annual Premium: <strong className="text-on-surface font-label-code">₹42,500</strong></span>
<span>•</span>
<span className="text-error font-semibold flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">timer</span>
                      Renews in 5 days
                    </span>
</div>
</div>
</div>
{/*  Channel & Velocity Pill  */}
<div className="flex flex-col items-end gap-1">
<div className="inline-flex items-center gap-1 px-space-sm py-1 bg-tertiary/10 rounded-lg font-caption text-caption font-semibold text-tertiary">
<span className="material-symbols-outlined text-[15px]">chat</span>
                  Prescribed: WhatsApp Interactive Nudge
                </div>
<span className="font-caption text-[11px] text-tertiary font-medium">94% Open Probability • Instant Checkout Link</span>
</div>
</div>
{/*  Context Details Strip  */}
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm text-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-tertiary text-[20px]">payments</span>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant font-medium">Prescribed Retention Bundle:</span>
<span className="text-on-surface font-semibold">Installment Plan (3-part 0% interest split: ₹14,166/mo via auto-mandate)</span>
</div>
</div>
<div className="text-on-surface-variant text-caption flex items-center gap-1 bg-surface-container-lowest px-space-xs py-1 rounded">
<span className="material-symbols-outlined text-[14px] text-primary">touch_app</span>
<span>Prefers direct UPI / WhatsApp payment</span>
</div>
</div>
{/*  Action Controls Row  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-md bg-tertiary hover:bg-tertiary-container text-on-tertiary rounded-lg font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Send WhatsApp Nudge</span>
</button>
<button className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm font-medium transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">visibility</span>
<span>Preview Payload</span>
</button>
</div>
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg font-caption text-caption transition-colors flex items-center gap-1" title="Snooze reminder">
<span className="material-symbols-outlined text-[16px]">schedule</span>
<span>Snooze</span>
</button>
<button className="h-9 px-space-sm text-tertiary hover:bg-tertiary/10 rounded-lg font-caption text-caption font-semibold transition-colors flex items-center gap-1 mark-contacted-btn">
<span className="material-symbols-outlined text-[18px]">done_all</span>
<span>Mark Contacted</span>
</button>
</div>
</div>
</div>
</div>
{/*  Queue Card 3: Amit Verma (HIGH)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md relative overflow-hidden" data-priority="high">
{/*  Persistent Left Severity Accent Strip  */}
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
<div className="pl-space-xs flex flex-col gap-space-sm">
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-display text-body-md font-bold">
                  AV
                </div>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Amit Verma</span>
<span className="font-label-code text-caption text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">#POL-1102</span>
<span className="px-space-xs py-space-2xs bg-error-container text-on-error-container rounded-full font-label-code text-caption font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">warning</span>
                      Lapse Risk: 74/100
                    </span>
</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant mt-0.5">
<span className="font-medium text-on-surface">Term Life Shield (₹1.5 Cr Coverage)</span>
<span>•</span>
<span>Annual Premium: <strong className="text-on-surface font-label-code">₹64,200</strong></span>
<span>•</span>
<span className="text-error font-semibold flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">timer</span>
                      Renews in 6 days
                    </span>
</div>
</div>
</div>
{/*  Channel & Velocity Pill  */}
<div className="flex flex-col items-end gap-1">
<div className="inline-flex items-center gap-1 px-space-sm py-1 bg-surface-container rounded-lg font-caption text-caption font-semibold text-primary">
<span className="material-symbols-outlined text-[15px]">headset_mic</span>
                  Prescribed: Senior Advisor Call
                </div>
<span className="font-caption text-[11px] text-on-surface-variant font-medium">Unopened WhatsApp notifications • Afternoon preference</span>
</div>
</div>
{/*  Context Details Strip  */}
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm text-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">lock_clock</span>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant font-medium">Prescribed Retention Bundle:</span>
<span className="text-on-surface font-semibold">Premium Freeze &amp; Guaranteed Inflation Adjustment Rider Waiver</span>
</div>
</div>
<div className="text-on-surface-variant text-caption flex items-center gap-1 bg-surface-container-lowest px-space-xs py-1 rounded">
<span className="material-symbols-outlined text-[14px] text-on-surface-variant">person_check</span>
<span>Assigned: Senior Advisor Rajeev K.</span>
</div>
</div>
{/*  Action Controls Row  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">call</span>
<span>Connect Advisor</span>
</button>
<button className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm font-medium transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">sms</span>
<span>Send SMS Backup</span>
</button>
</div>
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-sm text-tertiary hover:bg-tertiary/10 rounded-lg font-caption text-caption font-semibold transition-colors flex items-center gap-1 mark-contacted-btn">
<span className="material-symbols-outlined text-[18px]">done_all</span>
<span>Mark Contacted</span>
</button>
</div>
</div>
</div>
</div>
{/*  Queue Card 4: Vikram Malhotra (MEDIUM)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md relative overflow-hidden" data-priority="medium">
{/*  Persistent Left Severity Accent Strip  */}
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>
<div className="pl-space-xs flex flex-col gap-space-sm">
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-display text-body-md font-bold">
                  VM
                </div>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Vikram Malhotra</span>
<span className="font-label-code text-caption text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">#POL-1192</span>
<span className="px-space-xs py-space-2xs bg-secondary-container text-on-secondary-container rounded-full font-label-code text-caption font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">shield</span>
                      Lapse Risk: 54/100
                    </span>
</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant mt-0.5">
<span className="font-medium text-on-surface">Family Floater Guard</span>
<span>•</span>
<span>Annual Premium: <strong className="text-on-surface font-label-code">₹31,000</strong></span>
<span>•</span>
<span className="text-on-surface-variant font-medium flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Renews in 12 days
                    </span>
</div>
</div>
</div>
{/*  Channel & Velocity Pill  */}
<div className="flex flex-col items-end gap-1">
<div className="inline-flex items-center gap-1 px-space-sm py-1 bg-surface-container rounded-lg font-caption text-caption font-semibold text-on-surface">
<span className="material-symbols-outlined text-[15px]">mail</span>
                  Prescribed: Automated Smart Email
                </div>
<span className="font-caption text-[11px] text-on-surface-variant font-medium">Interactive renewal statement with attached benefit audit</span>
</div>
</div>
{/*  Context Details Strip  */}
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm text-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">loyalty</span>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant font-medium">Prescribed Retention Bundle:</span>
<span className="text-on-surface font-semibold">Multi-Year Policy Lock (10% rebate on 2-year advance commitment)</span>
</div>
</div>
<div className="text-on-surface-variant text-caption flex items-center gap-1 bg-surface-container-lowest px-space-xs py-1 rounded">
<span className="material-symbols-outlined text-[14px] text-tertiary">mark_email_read</span>
<span>Last opened email: Yesterday</span>
</div>
</div>
{/*  Action Controls Row  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Send Smart Email</span>
</button>
<button className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm font-medium transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">drafts</span>
<span>Preview Template</span>
</button>
</div>
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-sm text-tertiary hover:bg-tertiary/10 rounded-lg font-caption text-caption font-semibold transition-colors flex items-center gap-1 mark-contacted-btn">
<span className="material-symbols-outlined text-[18px]">done_all</span>
<span>Mark Contacted</span>
</button>
</div>
</div>
</div>
</div>
{/*  Queue Card 5: Priya Patel (HIGH/URGENT)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all hover:shadow-md relative overflow-hidden" data-priority="high">
{/*  Persistent Left Severity Accent Strip  */}
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
<div className="pl-space-xs flex flex-col gap-space-sm">
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-display text-body-md font-bold">
                  PP
                </div>
<div>
<div className="flex items-center gap-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface">Priya Patel</span>
<span className="font-label-code text-caption text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">#POL-1104</span>
<span className="px-space-xs py-space-2xs bg-error-container text-on-error-container rounded-full font-label-code text-caption font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[13px]">emergency_home</span>
                      Lapse Risk: 82/100
                    </span>
</div>
<div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant mt-0.5">
<span className="font-medium text-on-surface">Motor EV Shield (Tata Nexon EV)</span>
<span>•</span>
<span>Annual Premium: <strong className="text-on-surface font-label-code">₹18,400</strong></span>
<span>•</span>
<span className="text-on-surface-variant font-medium flex items-center gap-0.5">
<span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Renews in 14 days
                    </span>
</div>
</div>
</div>
{/*  Channel & Velocity Pill  */}
<div className="flex flex-col items-end gap-1">
<div className="inline-flex items-center gap-1 px-space-sm py-1 bg-tertiary/10 rounded-lg font-caption text-caption font-semibold text-tertiary">
<span className="material-symbols-outlined text-[15px]">chat</span>
                  Prescribed: WhatsApp PayLink
                </div>
<span className="font-caption text-[11px] text-tertiary font-medium">High EV Telematics Engagement</span>
</div>
</div>
{/*  Context Details Strip  */}
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm text-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">car_repair</span>
<div className="flex flex-col">
<span className="font-caption text-caption text-on-surface-variant font-medium">Prescribed Retention Bundle:</span>
<span className="text-on-surface font-semibold">Free 24/7 EV Highway Roadside Assistance Bonus + Battery Health Certificate</span>
</div>
</div>
<div className="text-on-surface-variant text-caption flex items-center gap-1 bg-surface-container-lowest px-space-xs py-1 rounded">
<span className="material-symbols-outlined text-[14px] text-tertiary">check</span>
<span>Clean Driving Telematics (Score: 92)</span>
</div>
</div>
{/*  Action Controls Row  */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-md bg-tertiary hover:bg-tertiary-container text-on-tertiary rounded-lg font-body-sm font-semibold shadow-sm transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">send</span>
<span>Send WhatsApp</span>
</button>
<button className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm font-medium transition-all flex items-center gap-space-xs" >
<span className="material-symbols-outlined text-[16px]">receipt_long</span>
<span>Addon Details</span>
</button>
</div>
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-sm text-tertiary hover:bg-tertiary/10 rounded-lg font-caption text-caption font-semibold transition-colors flex items-center gap-1 mark-contacted-btn">
<span className="material-symbols-outlined text-[18px]">done_all</span>
<span>Mark Contacted</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/*  Right Column: Interactive Outreach Simulator & Analytics Dock (4 columns on desktop)  */}
<div className="xl:col-span-4 flex flex-col gap-space-md sticky top-20">
{/*  Interactive Dispatch / Simulation Workbench Card  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Outreach Dispatcher</h2>
</div>
<span className="font-label-code text-caption text-tertiary bg-tertiary/10 px-space-xs py-0.5 rounded font-semibold">Live Mode</span>
</div>
{/*  Channel Selection Tabs  */}
<div className="flex flex-col gap-space-2xs">
<label className="font-caption text-caption uppercase text-on-surface-variant font-semibold">Active Channel Carrier</label>
<div className="grid grid-cols-4 gap-1 p-1 bg-surface-container-low rounded-lg" id="channelSelector">
<button className="channel-btn py-1.5 px-1 rounded-md bg-primary text-on-primary font-caption text-caption font-semibold flex flex-col items-center justify-center gap-1 transition-all" data-channel="call" type="button">
<span className="material-symbols-outlined text-[16px]">call</span>
<span>Call</span>
</button>
<button className="channel-btn py-1.5 px-1 rounded-md text-on-surface-variant hover:text-on-surface font-caption text-caption font-medium flex flex-col items-center justify-center gap-1 transition-all" data-channel="whatsapp" type="button">
<span className="material-symbols-outlined text-[16px]">chat</span>
<span>WhatsApp</span>
</button>
<button className="channel-btn py-1.5 px-1 rounded-md text-on-surface-variant hover:text-on-surface font-caption text-caption font-medium flex flex-col items-center justify-center gap-1 transition-all" data-channel="email" type="button">
<span className="material-symbols-outlined text-[16px]">mail</span>
<span>Email</span>
</button>
<button className="channel-btn py-1.5 px-1 rounded-md text-on-surface-variant hover:text-on-surface font-caption text-caption font-medium flex flex-col items-center justify-center gap-1 transition-all" data-channel="sms" type="button">
<span className="material-symbols-outlined text-[16px]">sms</span>
<span>SMS</span>
</button>
</div>
</div>
{/*  Form Fields  */}
<div className="flex flex-col gap-space-xs">
<div>
<label className="font-caption text-caption text-on-surface-variant font-medium block mb-1">Target Policyholder</label>
<input className="w-full h-10 px-space-sm bg-surface-container-low text-on-surface rounded-lg font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20" id="targetCustomerInput" type="text" value="Rahul Sharma (#POL-1082)"/>
</div>
<div className="grid grid-cols-2 gap-space-xs">
<div>
<label className="font-caption text-caption text-on-surface-variant font-medium block mb-1">Execution Slot</label>
<div className="relative">
<select className="w-full h-10 pl-space-sm pr-8 bg-surface-container-low text-on-surface rounded-lg font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Today, 4:30 PM (Peak)</option>
<option>Immediate Dispatch</option>
<option>Tomorrow, 10:00 AM</option>
</select>
<span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
</div>
</div>
<div>
<label className="font-caption text-caption text-on-surface-variant font-medium block mb-1">Assigned Agent</label>
<div className="relative">
<select className="w-full h-10 pl-space-sm pr-8 bg-surface-container-low text-on-surface rounded-lg font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Elena Rostova</option>
<option>Rajeev K. (Sr.)</option>
<option>AI Voice Bot (v4)</option>
</select>
<span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
</div>
</div>
</div>
{/*  Pitch / Script Preview Box  */}
<div>
<div className="flex items-center justify-between mb-1">
<label className="font-caption text-caption text-on-surface-variant font-medium">Personalized Script / Payload</label>
<span className="font-caption text-[11px] text-primary cursor-pointer hover:underline" id="regenerateScriptBtn">Regenerate AI Pitch</span>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg font-body-sm text-on-surface flex flex-col gap-1 relative text-caption">
<span className="text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[14px]">psychology</span>
                  Personalized Context Inject:
                </span>
<p className="text-on-surface-variant text-caption leading-relaxed" id="scriptText">
                  "Hi Rahul, acknowledging our conversation regarding your recent claims resolution. As a valued 5-year patron, we have pre-approved an exclusive 12% Loyalty rate lock plus complimentary annual health scans. Can we finalize this now?"
                </p>
</div>
</div>
<button className="w-full h-10 mt-space-2xs bg-primary hover:bg-primary-container text-on-primary rounded-xl font-body-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-space-xs" id="dispatchConfirmBtn" type="button">
<span className="material-symbols-outlined text-[18px]">send</span>
<span>Confirm &amp; Dispatch Outreach</span>
</button>
</div>
</div>
{/*  Channel Performance & SLA Card  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Channel Retention Velocity</h3>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">analytics</span>
</div>
<div className="flex flex-col gap-space-sm">
{/*  Channel 1: WhatsApp  */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between text-caption font-medium">
<span className="flex items-center gap-1 text-on-surface font-semibold">
<span className="material-symbols-outlined text-tertiary text-[16px]">chat</span>
                  WhatsApp Conversational
                </span>
<span className="font-label-code text-tertiary font-bold">91% Open • 42% Retained</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{"width": "88%"}}></div>
</div>
<span className="font-caption text-[11px] text-on-surface-variant">Avg payment speed: 2h 14m via instant checkout UPI</span>
</div>
{/*  Channel 2: Phone  */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between text-caption font-medium">
<span className="flex items-center gap-1 text-on-surface font-semibold">
<span className="material-symbols-outlined text-primary text-[16px]">call</span>
                  Advisor Direct Phone
                </span>
<span className="font-label-code text-primary font-bold">68% Retained (4.2m avg)</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{"width": "68%"}}></div>
</div>
<span className="font-caption text-[11px] text-on-surface-variant">Highest renewal lock for &gt;₹50k premium tiers</span>
</div>
{/*  Channel 3: Email  */}
<div className="flex flex-col gap-1">
<div className="flex items-center justify-between text-caption font-medium">
<span className="flex items-center gap-1 text-on-surface font-semibold">
<span className="material-symbols-outlined text-secondary text-[16px]">mail</span>
                  Smart Email Audit
                </span>
<span className="font-label-code text-on-surface font-bold">48% Open • 22% CTR</span>
</div>
<div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{"width": "48%"}}></div>
</div>
<span className="font-caption text-[11px] text-on-surface-variant">Best for multi-year floater lock policy statements</span>
</div>
</div>
</div>
{/*  AI Tip & Live Status Notice  */}
<div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs relative overflow-hidden">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined text-[18px]">lightbulb</span>
<span className="font-caption text-caption font-bold uppercase tracking-wider">AI Retention Signal</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">
            High-risk policyholders contacted between <strong className="text-primary font-semibold">4:00 PM – 6:00 PM</strong> have demonstrated a <strong className="text-tertiary font-semibold">28% higher renewal rate</strong> this cycle.
          </p>
<div className="mt-space-2xs pt-space-xs flex items-center justify-between font-caption text-caption text-on-surface-variant">
<span>14 of 38 planned completed</span>
<span className="font-label-code text-primary font-semibold">Live Sync 14:02:18</span>
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
