import React from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function PortfolioRenewalsDesktop() {
  return (
    <DesktopLayout activePath="/portfolio-renewals">
      <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full">
{/*  Interactive Top Control Bar  */}
<section className="w-full px-space-xl py-space-lg flex flex-col gap-space-md">
<div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-space-base bg-surface-container-lowest p-space-base rounded-xl shadow-sm">
{/*  Search Input  */}
<div className="relative flex-1 min-w-[320px]">
<span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
<input className="w-full h-10 pl-10 pr-space-base rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all placeholder:text-outline" placeholder="Search policyholder, policy ID (e.g. POL-1082)..." type="text"/>
</div>
{/*  Quick Action Filter Hub  */}
<div className="flex flex-wrap items-center gap-space-sm">
<button className="h-10 px-space-md rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold flex items-center gap-space-xs hover:bg-surface-container-high transition-colors" type="button">
<span className="material-symbols-outlined text-[16px] text-primary">event</span>
          Next 7 Days
        </button>
<div className="relative">
<button className="h-10 px-space-md rounded-xl bg-surface-container-low text-on-surface font-caption text-caption flex items-center gap-space-xs hover:bg-surface-container transition-colors" type="button">
<span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
<span>Product: All</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
</div>
<div className="relative">
<button className="h-10 px-space-md rounded-xl bg-surface-container-low text-on-surface font-caption text-caption flex items-center gap-space-xs hover:bg-surface-container transition-colors" type="button">
<span className="inline-block w-2 h-2 rounded-full bg-error"></span>
<span>Risk: High/Med/Low</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
</div>
<div className="relative">
<button className="h-10 px-space-md rounded-xl bg-surface-container-low text-on-surface font-caption text-caption flex items-center gap-space-xs hover:bg-surface-container transition-colors" type="button">
<span className="material-symbols-outlined text-[16px] text-secondary">payments</span>
<span>Premium Range</span>
<span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
</button>
</div>
{/*  View Switcher  */}
<div className="flex items-center bg-surface-container p-space-2xs rounded-xl shadow-inner">
<button className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-primary font-caption text-caption font-semibold shadow-sm flex items-center gap-space-2xs" type="button">
<span className="material-symbols-outlined text-[16px]">calendar_view_month</span>
            Month
          </button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant font-caption text-caption hover:text-on-surface flex items-center gap-space-2xs transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
            Week
          </button>
<button className="px-space-md py-1.5 rounded-lg text-on-surface-variant font-caption text-caption hover:text-on-surface flex items-center gap-space-2xs transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
            List
          </button>
</div>
{/*  Export Action  */}
<button className="h-10 px-space-md rounded-xl bg-primary text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-md hover:bg-primary-container active:scale-[0.98] transition-all" type="button">
<span className="material-symbols-outlined text-[16px]">download</span>
          Export CSV
        </button>
</div>
</div>
</section>
{/*  Split Grid: Calendar & Scheduled Side Panel  */}
<section className="w-full px-space-xl pb-space-xl grid grid-cols-12 gap-space-lg items-start">
{/*  Left Calendar Section (65%)  */}
<div className="col-span-12 xl:col-span-8 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
{/*  Calendar Header  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-md">
<div>
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Schedule Grid</span>
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-space-sm">
              October 2025
              <span className="font-label-code text-caption font-semibold text-primary bg-surface-container px-space-sm py-0.5 rounded-full">35 Renewals Queued</span>
</h2>
</div>
</div>
{/*  Calendar Navigation Controls  */}
<div className="flex items-center gap-space-xs">
<div className="flex items-center bg-surface-container-low rounded-xl p-space-2xs">
<button className="p-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors" title="Previous Month" type="button">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="px-space-sm py-space-2xs font-caption text-caption font-semibold text-on-surface hover:bg-surface-container rounded-lg transition-colors" type="button">
              Today
            </button>
<button className="p-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors" title="Next Month" type="button">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
{/*  Color Coding Legend Indicator  */}
<div className="hidden sm:flex items-center gap-space-sm pl-space-md">
<span className="flex items-center gap-1 font-caption text-caption text-on-surface-variant">
<span className="w-2.5 h-2.5 rounded-full bg-error"></span> High Risk
            </span>
<span className="flex items-center gap-1 font-caption text-caption text-on-surface-variant">
<span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Med
            </span>
<span className="flex items-center gap-1 font-caption text-caption text-on-surface-variant">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span> Safe
            </span>
</div>
</div>
</div>
{/*  Days of Week Bar  */}
<div className="grid grid-cols-7 text-center font-caption text-caption text-on-surface-variant font-semibold py-space-xs bg-surface-container-low rounded-lg">
<div>SUN</div>
<div>MON</div>
<div>TUE</div>
<div>WED</div>
<div>THU</div>
<div>FRI</div>
<div>SAT</div>
</div>
{/*  Calendar 5-Week Matrix (Oct 2025 starts Wednesday)  */}
<div className="grid grid-cols-7 gap-space-2xs">
{/*  Week 1: Sep 28-30 (Previous month bleed)  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
<span className="font-label-code text-caption text-on-surface-variant">28</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
<span className="font-label-code text-caption text-on-surface-variant">29</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
<span className="font-label-code text-caption text-on-surface-variant">30</span>
</div>
{/*  Oct 1  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-on-surface font-semibold">1</span>
<span className="font-label-code text-[10px] text-tertiary bg-tertiary-container/10 px-1 rounded">₹42k</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
{/*  Oct 2  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">2</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
</div>
</div>
{/*  Oct 3  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-on-surface font-semibold">3</span>
<span className="font-label-code text-[10px] text-error bg-error-container/20 px-1 rounded">₹89k</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
</div>
</div>
{/*  Oct 4  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">4</span>
</div>
{/*  Week 2: Oct 5 - 11  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">5</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">6</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-on-surface font-semibold">7</span>
<span className="font-label-code text-[10px] text-error bg-error-container/20 px-1 rounded">₹110k</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="w-2 h-2 rounded-full bg-error"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">8</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">9</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">10</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">11</span>
</div>
{/*  Week 3: Oct 12 - 18  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">12</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">13</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">14</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">15</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">16</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">17</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">18</span>
</div>
{/*  Week 4: Oct 19 - 25  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">19</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">20</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">21</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">22</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">23</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">24</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">25</span>
</div>
{/*  Week 5: Oct 26 - Nov 1  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">26</span>
</div>
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">27</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
{/*  Oct 28 - HIGHLIGHTED ACTIVE CELL (5 Renewals)  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-variant relative shadow-md flex flex-col justify-between cursor-pointer transition-transform hover:-translate-y-0.5">
<div className="flex items-center justify-between">
<span className="font-label-code text-body-sm font-bold text-primary flex items-center gap-1">
              28
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
</span>
<span className="font-label-code text-[11px] font-bold text-on-primary bg-primary px-1.5 py-0.5 rounded-full shadow-sm">5 DUE</span>
</div>
<div>
<span className="font-caption text-[11px] text-on-surface-variant font-medium block truncate">₹1,24,900</span>
<div className="flex items-center gap-1 mt-1">
<span className="w-2.5 h-2.5 rounded-full bg-error" title="3 High Risk"></span>
<span className="w-2.5 h-2.5 rounded-full bg-error"></span>
<span className="w-2.5 h-2.5 rounded-full bg-error"></span>
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
</div>
{/*  Oct 29  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">29</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
{/*  Oct 30  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<span className="font-label-code text-caption text-on-surface font-semibold">30</span>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
</div>
</div>
{/*  Oct 31  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between cursor-pointer">
<div className="flex items-center justify-between">
<span className="font-label-code text-caption text-on-surface font-semibold">31</span>
<span className="font-label-code text-[10px] text-error bg-error-container/20 px-1 rounded">₹48k</span>
</div>
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
</div>
</div>
{/*  Nov 1 (Bleed)  */}
<div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
<span className="font-label-code text-caption text-on-surface-variant">1</span>
</div>
</div>
</div>
{/*  Right Side Panel: Scheduled Renewals for Selected Date (35%)  */}
<div className="col-span-12 xl:col-span-4 flex flex-col gap-space-md">
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
{/*  Panel Header  */}
<div className="flex items-center justify-between">
<div>
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">event_upcoming</span>
<span className="font-caption text-caption text-primary font-bold uppercase tracking-wider">Scheduled Target</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Oct 28, 2025</h3>
</div>
<span className="font-label-code text-label-code font-semibold px-space-sm py-1 rounded-full bg-error-container text-on-error-container shadow-xs">
            3 High Risk
          </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Showing 3 priority interventions out of 5 scheduled renewals requiring retention actions today.
        </p>
{/*  Detailed Policy Cards List  */}
<div className="flex flex-col gap-space-sm">
{/*  Card 1: Rahul Sharma  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-sm shadow-xs group cursor-pointer">
<div className="flex items-start justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm font-bold">
                  RS
                </div>
<div>
<h4 className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Rahul Sharma</h4>
<span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-tertiary">health_and_safety</span>
                    Health Shield Gold • POL-1082
                  </span>
</div>
</div>
<div className="text-right">
<span className="font-metric-stat text-body-lg text-on-surface block">₹28,500</span>
<span className="font-caption text-caption text-on-surface-variant">Annual Premium</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs bg-surface-container-lowest/80 p-space-sm rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-error/10 text-error">
<span className="material-symbols-outlined text-[14px]">local_fire_department</span>
</span>
<span className="font-caption text-caption text-error font-semibold">Lapse Index</span>
<span className="font-label-code text-label-code font-bold text-error">78/100</span>
</div>
<button className="px-space-sm py-1 bg-primary text-on-primary rounded-lg font-caption text-caption font-semibold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[14px]">send</span>
                Trigger Offer
              </button>
</div>
</div>
{/*  Card 2: Rajesh Khanna  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-sm shadow-xs group cursor-pointer">
<div className="flex items-start justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-headline-sm font-bold">
                  RK
                </div>
<div>
<h4 className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Rajesh Khanna</h4>
<span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">directions_car</span>
                    Motor Drive+ Pro • POL-1205
                  </span>
</div>
</div>
<div className="text-right">
<span className="font-metric-stat text-body-lg text-on-surface block">₹22,000</span>
<span className="font-caption text-caption text-on-surface-variant">Annual Premium</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs bg-surface-container-lowest/80 p-space-sm rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-error/10 text-error">
<span className="material-symbols-outlined text-[14px]">warning</span>
</span>
<span className="font-caption text-caption text-error font-semibold">Lapse Index</span>
<span className="font-label-code text-label-code font-bold text-error">85/100</span>
</div>
<button className="px-space-sm py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container rounded-lg font-caption text-caption font-semibold shadow-xs transition-all flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[14px]">call</span>
                Call Agent
              </button>
</div>
</div>
{/*  Card 3: Priya Patel  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-sm shadow-xs group cursor-pointer">
<div className="flex items-start justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-headline-sm font-bold">
                  PP
                </div>
<div>
<h4 className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">Priya Patel</h4>
<span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">electric_car</span>
                    Motor Comprehensive • POL-1104
                  </span>
</div>
</div>
<div className="text-right">
<span className="font-metric-stat text-body-lg text-on-surface block">₹18,400</span>
<span className="font-caption text-caption text-on-surface-variant">Annual Premium</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs bg-surface-container-lowest/80 p-space-sm rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-error/10 text-error">
<span className="material-symbols-outlined text-[14px]">crisis_alert</span>
</span>
<span className="font-caption text-caption text-error font-semibold">Lapse Index</span>
<span className="font-label-code text-label-code font-bold text-error">82/100</span>
</div>
<button className="px-space-sm py-1 bg-primary text-on-primary rounded-lg font-caption text-caption font-semibold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[14px]">high_res</span>
                Apply Discount
              </button>
</div>
</div>
</div>
<button className="w-full py-space-sm bg-surface-container text-on-surface font-caption text-caption font-semibold rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1" type="button">
<span>View All 5 Schedule Items</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/*  Quick Date Analytical Summary  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
</div>
<div>
<span className="font-caption text-caption text-on-surface-variant">Oct 28 Projected Premium</span>
<span className="font-headline-sm text-headline-sm text-on-surface block">₹1,24,900</span>
</div>
</div>
<div className="text-right">
<span className="font-caption text-caption text-error font-medium">₹68,900 at High Risk</span>
<span className="font-label-code text-caption text-on-surface-variant block">55.1% Exposure</span>
</div>
</div>
</div>
</section>
{/*  Bottom Section: Comprehensive Filterable Master Policy Table  */}
<section className="w-full px-space-xl pb-space-2xl">
<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
{/*  Ledger Header & Controls  */}
<div className="flex flex-wrap items-center justify-between gap-space-base">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Master Policy Retention Ledger</h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing <strong className="text-on-surface">5</strong> of <strong className="text-on-surface">200</strong> active underwritten renewals across regional books
          </span>
</div>
<div className="flex items-center gap-space-sm">
<div className="flex items-center bg-surface-container-low px-space-sm py-1 rounded-xl">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant mr-1">tune</span>
<span className="font-caption text-caption text-on-surface font-medium">Sort by: Risk Score (Descending)</span>
</div>
<button className="h-9 px-space-md rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold flex items-center gap-space-2xs hover:bg-surface-container-high transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">filter_alt</span>
            Filters (3)
          </button>
</div>
</div>
{/*  Table Structure  */}
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low font-caption text-caption text-on-surface-variant uppercase tracking-wider">
<th className="py-space-sm px-space-md rounded-l-lg font-semibold">Policy ID</th>
<th className="py-space-sm px-space-md font-semibold">Customer Name</th>
<th className="py-space-sm px-space-md font-semibold">Product</th>
<th className="py-space-sm px-space-md font-semibold">Annual Premium</th>
<th className="py-space-sm px-space-md font-semibold">Renewal Target</th>
<th className="py-space-sm px-space-md font-semibold">Tenure</th>
<th className="py-space-sm px-space-md font-semibold text-center">Claims</th>
<th className="py-space-sm px-space-md font-semibold">Risk Score</th>
<th className="py-space-sm px-space-md font-semibold">Recommended Action</th>
<th className="py-space-sm px-space-md rounded-r-lg font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
{/*  Row 1: High Risk POL-1205  */}
<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer shadow-xs">
<td className="py-space-md px-space-md">
<span className="font-label-code text-label-code font-bold text-primary group-hover:underline">POL-1205</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<img className="w-8 h-8 rounded-full object-cover shadow-xs" data-alt="Professional studio portrait of Rajesh Khanna, middle-aged Indian executive with a slight smile and neat business attire against an editorial clean slate studio backdrop." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqC-_YMwNdYQe6U37KxkNoZrnvPNzykUSJzKfyHAL23aSEYV2wVwYmFGY7N0xpnFyfjYTKmoFYDj0xSZED4XXARSa9ZuFGVXmf1nBMoJtdcnOmTt1kYLHNKUdp9JPHcr2l6MklNrA7pmKjufhna5GluBGpyq9bEqXJGLVAyQr3-CcxSLMba69YjinSuS8Aj6B0jFKruAuqtHA_ZbRSPKw4as1_BRU1zltzgsIbgVZhKDL-zeBZ4uUhhQ"/>
<div>
<span className="font-headline-sm text-body-md text-on-surface font-semibold block leading-tight">Rajesh Khanna</span>
<span className="font-caption text-caption text-on-surface-variant">rajesh.k@enterprise.in</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface font-medium bg-surface-container px-space-sm py-1 rounded-md">Motor Drive+</span>
</td>
<td className="py-space-md px-space-md">
<span className="font-metric-stat text-body-md text-on-surface font-semibold">₹22,000</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-error">event</span>
<span className="font-label-code text-caption font-semibold text-error">Oct 28, 2025</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface">2 Years</span>
</td>
<td className="py-space-md px-space-md text-center">
<span className="font-label-code text-caption text-on-surface bg-surface-container px-2 py-0.5 rounded-full">2</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-xs">
<div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-error" style={{"width": "85%"}}></div>
</div>
<span className="font-label-code text-label-code font-bold text-error">85</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-error bg-error-container/20 px-space-sm py-1 rounded-md font-semibold flex items-center gap-1 w-max">
<span className="material-symbols-outlined text-[14px]">priority_high</span>
                  Urgent Loyalty Call
                </span>
</td>
<td className="py-space-md px-space-md text-right">
<button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
{/*  Row 2: High Risk POL-1104  */}
<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer shadow-xs">
<td className="py-space-md px-space-md">
<span className="font-label-code text-label-code font-bold text-primary group-hover:underline">POL-1104</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<img className="w-8 h-8 rounded-full object-cover shadow-xs" data-alt="Portrait of Priya Patel, young female tech professional with glasses in modern architectural office natural lighting, calm confident expression." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDczWCOpRLxxH5wjkJcjVELoeXT_xs0MgQk8fnqqMG6JLjEAAJ8DyD0N7Bh2R8ssd1KVZqmPTLK4a21FOk4h7lzqR9fATCCnthhfEbBBh0hslHZwbYdLZGsxApqFyiP9R-O5v3z5sF4N_QWy9xcYnXncGHTtGqR0nrQ7OrrKlnd7SI9V0V7S3NP51dQRfuZy5hkzKrG50_TZfRYODQzmCmDbWl_CrbrnGyFJ0I7IazXzxtGOA3IkFCOeA"/>
<div>
<span className="font-headline-sm text-body-md text-on-surface font-semibold block leading-tight">Priya Patel</span>
<span className="font-caption text-caption text-on-surface-variant">priya.patel@novatech.co</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface font-medium bg-surface-container px-space-sm py-1 rounded-md">Motor EV Shield</span>
</td>
<td className="py-space-md px-space-md">
<span className="font-metric-stat text-body-md text-on-surface font-semibold">₹18,400</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-error">event</span>
<span className="font-label-code text-caption font-semibold text-error">Oct 28, 2025</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface">1 Year</span>
</td>
<td className="py-space-md px-space-md text-center">
<span className="font-label-code text-caption text-on-surface bg-surface-container px-2 py-0.5 rounded-full">1</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-xs">
<div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-error" style={{"width": "82%"}}></div>
</div>
<span className="font-label-code text-label-code font-bold text-error">82</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-error bg-error-container/20 px-space-sm py-1 rounded-md font-semibold flex items-center gap-1 w-max">
<span className="material-symbols-outlined text-[14px]">percent</span>
                  Send 10% Bundle Discount
                </span>
</td>
<td className="py-space-md px-space-md text-right">
<button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
{/*  Row 3: High Risk POL-1082  */}
<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer shadow-xs">
<td className="py-space-md px-space-md">
<span className="font-label-code text-label-code font-bold text-primary group-hover:underline">POL-1082</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<img className="w-8 h-8 rounded-full object-cover shadow-xs" data-alt="Portrait of Rahul Sharma, Indian senior doctor in clean modern lighting with warm welcoming corporate attire." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUg1Z1YFwBp2Vczw8cEy9sR4DaOYiiPKDXuKm1VvboNCFD7kvTK8CC9WyXD81mMiCENUrGnZOaMFX4xzSoNIRd1n7dbFn-qq-GaH_I0XrHd0f2qatCfko7uJdVQ3rqObigZkKGSgi0MRV3JFUtKp16hLrcmrBorxjg33bIZEb0YFf0OHSI6lD69piXa80cgMpOumJIGtA97KOjDLdfhQPhtzceBS7hszdVDP8RQPeckkw8s_2SqS2tGA"/>
<div>
<span className="font-headline-sm text-body-md text-on-surface font-semibold block leading-tight">Rahul Sharma</span>
<span className="font-caption text-caption text-on-surface-variant">dr.rahul@medicare.org</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface font-medium bg-surface-container px-space-sm py-1 rounded-md">Health Shield</span>
</td>
<td className="py-space-md px-space-md">
<span className="font-metric-stat text-body-md text-on-surface font-semibold">₹28,500</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-error">event</span>
<span className="font-label-code text-caption font-semibold text-error">Oct 28, 2025</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface">4 Years</span>
</td>
<td className="py-space-md px-space-md text-center">
<span className="font-label-code text-caption text-on-surface bg-surface-container px-2 py-0.5 rounded-full">0</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-xs">
<div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-error" style={{"width": "78%"}}></div>
</div>
<span className="font-label-code text-label-code font-bold text-error">78</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-primary bg-surface-container px-space-sm py-1 rounded-md font-semibold flex items-center gap-1 w-max">
<span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  AI Tele-Underwriting Review
                </span>
</td>
<td className="py-space-md px-space-md text-right">
<button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
{/*  Row 4: Med Risk POL-0988  */}
<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer shadow-xs">
<td className="py-space-md px-space-md">
<span className="font-label-code text-label-code font-bold text-primary group-hover:underline">POL-0988</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-headline-sm font-semibold text-[13px]">
                    AN
                  </div>
<div>
<span className="font-headline-sm text-body-md text-on-surface font-semibold block leading-tight">Ananya Nair</span>
<span className="font-caption text-caption text-on-surface-variant">ananya.n@solardynamics.com</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface font-medium bg-surface-container px-space-sm py-1 rounded-md">Home Armor</span>
</td>
<td className="py-space-md px-space-md">
<span className="font-metric-stat text-body-md text-on-surface font-semibold">₹15,200</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-amber-500">event</span>
<span className="font-label-code text-caption font-semibold text-amber-500">Oct 29, 2025</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface">3 Years</span>
</td>
<td className="py-space-md px-space-md text-center">
<span className="font-label-code text-caption text-on-surface bg-surface-container px-2 py-0.5 rounded-full">0</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-xs">
<div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-amber-500" style={{"width": "54%"}}></div>
</div>
<span className="font-label-code text-label-code font-bold text-amber-500">54</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-amber-600 bg-amber-100/60 px-space-sm py-1 rounded-md font-semibold flex items-center gap-1 w-max">
<span className="material-symbols-outlined text-[14px]">mail</span>
                  Auto-WhatsApp Reminder
                </span>
</td>
<td className="py-space-md px-space-md text-right">
<button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
{/*  Row 5: Low Risk POL-1450  */}
<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer shadow-xs">
<td className="py-space-md px-space-md">
<span className="font-label-code text-label-code font-bold text-primary group-hover:underline">POL-1450</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-headline-sm font-semibold text-[13px]">
                    VM
                  </div>
<div>
<span className="font-headline-sm text-body-md text-on-surface font-semibold block leading-tight">Vikram Malhotra</span>
<span className="font-caption text-caption text-on-surface-variant">v.malhotra@capitalsys.in</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface font-medium bg-surface-container px-space-sm py-1 rounded-md">Term Life 360</span>
</td>
<td className="py-space-md px-space-md">
<span className="font-metric-stat text-body-md text-on-surface font-semibold">₹41,000</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-tertiary">event</span>
<span className="font-label-code text-caption font-semibold text-tertiary">Oct 30, 2025</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-on-surface">6 Years</span>
</td>
<td className="py-space-md px-space-md text-center">
<span className="font-label-code text-caption text-on-surface bg-surface-container px-2 py-0.5 rounded-full">0</span>
</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-xs">
<div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-tertiary" style={{"width": "14%"}}></div>
</div>
<span className="font-label-code text-label-code font-bold text-tertiary">14</span>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="font-caption text-caption text-tertiary bg-tertiary-fixed-dim/20 px-space-sm py-1 rounded-md font-semibold flex items-center gap-1 w-max">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Auto-Debit Scheduled
                </span>
</td>
<td className="py-space-md px-space-md text-right">
<button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination Footer  */}
<div className="flex flex-wrap items-center justify-between gap-space-md pt-space-md">
<span className="font-caption text-caption text-on-surface-variant">
          Showing 1 to 5 of 200 entries
        </span>
<div className="flex items-center gap-space-xs">
<button className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-caption text-caption hover:bg-surface-container disabled:opacity-50 transition-colors" disabled="" type="button">
            Previous
          </button>
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-caption text-caption font-semibold shadow-sm" type="button">
            1
          </button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors" type="button">
            2
          </button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors" type="button">
            3
          </button>
<span className="px-space-xs text-outline font-label-code">...</span>
<button className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors" type="button">
            20
          </button>
<button className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors" type="button">
            Next
          </button>
</div>
</div>
</div>
</section>
</div></main>
    </DesktopLayout>
  );
}
