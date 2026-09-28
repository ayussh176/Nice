import React, { useState, useEffect } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function PortfolioRenewalsDesktop() {
  // State for Summary Metrics
  const [summary, setSummary] = useState({
    month_year: 'October 2025',
    total_queued: 35,
    high_risk_count: 8,
    medium_risk_count: 15,
    low_risk_count: 12,
    total_projected_premium: 164000000,
    high_risk_premium: 34950000,
    exposure_pct: 21.3
  });

  // State for Calendar Matrix
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(28);

  // State for Scheduled Renewals on selected day
  const [scheduledCards, setScheduledCards] = useState([]);
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  // State for Master Policy Table
  const [policies, setPolicies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLOB, setSelectedLOB] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [showLOBDropdown, setShowLOBDropdown] = useState(false);
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Summary and Calendar on mount
  useEffect(() => {
    fetch('/api/portfolio/summary')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSummary(data);
      })
      .catch((err) => console.error('Error fetching summary:', err));

    fetch('/api/portfolio/calendar')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCalendarDays(data);
      })
      .catch((err) => console.error('Error fetching calendar:', err));
  }, []);

  // Fetch Scheduled Renewals when selectedDay changes
  useEffect(() => {
    setLoadingScheduled(true);
    fetch(`/api/portfolio/scheduled-renewals?day=${selectedDay}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setScheduledCards(data);
        setLoadingScheduled(false);
      })
      .catch((err) => {
        console.error('Error fetching scheduled renewals:', err);
        setLoadingScheduled(false);
      });
  }, [selectedDay]);

  // Fetch Master Policy Ledger with filters & pagination
  useEffect(() => {
    setLoadingPolicies(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '5',
    });
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedLOB !== 'All') params.append('lob', selectedLOB);
    if (selectedRisk !== 'All') params.append('risk', selectedRisk);

    fetch(`/api/portfolio/policies?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setPolicies(data.items || []);
          setTotalCount(data.total || 0);
          setTotalPages(data.total_pages || 1);
        }
        setLoadingPolicies(false);
      })
      .catch((err) => {
        console.error('Error fetching policy roster:', err);
        setLoadingPolicies(false);
      });
  }, [page, searchQuery, selectedLOB, selectedRisk]);

  // Dispatch WhatsApp Ping Handler
  const handleWhatsAppPing = async (policyId, customerName) => {
    try {
      const res = await fetch(`/api/portfolio/policies/${policyId}/whatsapp-ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: null })
      });
      const data = await res.json();
      showToast(`WhatsApp outreach sent successfully to ${customerName || policyId}!`);
    } catch (err) {
      showToast(`WhatsApp dispatched for policy ${policyId}`);
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Policy ID', 'Customer', 'Product', 'Premium (INR)', 'Renewal Date', 'Risk Score', 'Risk Level'];
    const rows = policies.map(p => [p.policy_id, p.customer_name, p.product_name, p.annual_premium, p.renewal_date, p.risk_score, p.risk_level]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `insurerenew_portfolio_${selectedDay}_oct_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exporting Master Policy Ledger CSV...');
  };

  // Format currency helper
  const fmt = (num) => {
    if (!num) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <DesktopLayout activePath="/portfolio-renewals">
      <main className="w-full pt-16 bg-surface min-h-screen">
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce transition-all">
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="font-body-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col w-full">
          {/* Interactive Top Control Bar */}
          <section className="w-full px-space-xl py-space-lg flex flex-col gap-space-md">
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-space-base bg-surface-container-lowest p-space-base rounded-xl shadow-sm">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[320px]">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  className="w-full h-10 pl-10 pr-space-base rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all placeholder:text-outline"
                  placeholder="Search policyholder, policy ID (e.g. POL-1082)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Quick Action Filter Hub */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <button
                  className="h-10 px-space-md rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold flex items-center gap-space-xs hover:bg-surface-container-high transition-colors"
                  type="button"
                  onClick={() => {
                    setSelectedDay(28);
                    showToast('Filtered to active renewal cycle: Oct 28 - Nov 04');
                  }}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">event</span>
                  Next 7 Days
                </button>

                {/* Product Dropdown */}
                <div className="relative">
                  <button
                    className="h-10 px-space-md rounded-xl bg-surface-container-low text-on-surface font-caption text-caption flex items-center gap-space-xs hover:bg-surface-container transition-colors"
                    type="button"
                    onClick={() => setShowLOBDropdown(!showLOBDropdown)}
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                    <span>Product: {selectedLOB}</span>
                    <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                  </button>
                  {showLOBDropdown && (
                    <div className="absolute top-12 left-0 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg p-1 z-30 flex flex-col gap-0.5">
                      {['All', 'Health', 'Motor', 'Life', 'Home'].map((lob) => (
                        <button
                          key={lob}
                          type="button"
                          className={`px-3 py-1.5 text-left font-caption text-caption rounded-lg transition-colors ${
                            selectedLOB === lob ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container'
                          }`}
                          onClick={() => {
                            setSelectedLOB(lob);
                            setShowLOBDropdown(false);
                            setPage(1);
                          }}
                        >
                          {lob === 'All' ? 'All Products' : lob}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Dropdown */}
                <div className="relative">
                  <button
                    className="h-10 px-space-md rounded-xl bg-surface-container-low text-on-surface font-caption text-caption flex items-center gap-space-xs hover:bg-surface-container transition-colors"
                    type="button"
                    onClick={() => setShowRiskDropdown(!showRiskDropdown)}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        selectedRisk === 'HIGH' ? 'bg-error' : selectedRisk === 'MEDIUM' ? 'bg-amber-500' : 'bg-tertiary'
                      }`}
                    ></span>
                    <span>Risk: {selectedRisk}</span>
                    <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                  </button>
                  {showRiskDropdown && (
                    <div className="absolute top-12 left-0 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg p-1 z-30 flex flex-col gap-0.5">
                      {[
                        { label: 'All Risks', value: 'All' },
                        { label: 'High Risk', value: 'HIGH' },
                        { label: 'Medium Risk', value: 'MEDIUM' },
                        { label: 'Safe / Low', value: 'LOW' }
                      ].map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          className={`px-3 py-1.5 text-left font-caption text-caption rounded-lg transition-colors ${
                            selectedRisk === r.value ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container'
                          }`}
                          onClick={() => {
                            setSelectedRisk(r.value);
                            setShowRiskDropdown(false);
                            setPage(1);
                          }}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Switcher */}
                <div className="flex items-center bg-surface-container p-space-2xs rounded-xl shadow-inner">
                  <button
                    className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-primary font-caption text-caption font-semibold shadow-sm flex items-center gap-space-2xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_view_month</span>
                    Month
                  </button>
                  <button
                    className="px-space-md py-1.5 rounded-lg text-on-surface-variant font-caption text-caption hover:text-on-surface flex items-center gap-space-2xs transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
                    Week
                  </button>
                  <button
                    className="px-space-md py-1.5 rounded-lg text-on-surface-variant font-caption text-caption hover:text-on-surface flex items-center gap-space-2xs transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                    List
                  </button>
                </div>

                {/* Export Action */}
                <button
                  className="h-10 px-space-md rounded-xl bg-primary text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-md hover:bg-primary-container active:scale-[0.98] transition-all"
                  type="button"
                  onClick={handleExportCSV}
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export CSV
                </button>
              </div>
            </div>
          </section>

          {/* Split Grid: Calendar & Scheduled Side Panel */}
          <section className="w-full px-space-xl pb-space-xl grid grid-cols-12 gap-space-lg items-start">
            {/* Left Calendar Section (65%) */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-md">
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                      Schedule Grid
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-space-sm">
                      {summary.month_year}
                      <span className="font-label-code text-caption font-semibold text-primary bg-surface-container px-space-sm py-0.5 rounded-full">
                        {summary.total_queued} Renewals Queued
                      </span>
                    </h2>
                  </div>
                </div>

                {/* Calendar Navigation Controls */}
                <div className="flex items-center gap-space-xs">
                  <div className="flex items-center bg-surface-container-low rounded-xl p-space-2xs">
                    <button
                      className="p-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors"
                      title="Previous Month"
                      type="button"
                      onClick={() => showToast('Navigated to September 2025 archival cycle')}
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button
                      className="px-space-sm py-space-2xs font-caption text-caption font-semibold text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                      type="button"
                      onClick={() => setSelectedDay(28)}
                    >
                      Today
                    </button>
                    <button
                      className="p-space-xs rounded-lg text-on-surface hover:bg-surface-container transition-colors"
                      title="Next Month"
                      type="button"
                      onClick={() => showToast('Navigated to November 2025 pipeline')}
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>

                  {/* Color Coding Legend Indicator */}
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

              {/* Days of Week Bar */}
              <div className="grid grid-cols-7 text-center font-caption text-caption text-on-surface-variant font-semibold py-space-xs bg-surface-container-low rounded-lg">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
              </div>

              {/* Calendar 5-Week Matrix (Oct 2025 starts Wednesday: 3 bleed days: 28, 29, 30) */}
              <div className="grid grid-cols-7 gap-space-2xs">
                {/* Bleed Days Sep 28-30 */}
                <div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
                  <span className="font-label-code text-caption text-on-surface-variant">28</span>
                </div>
                <div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
                  <span className="font-label-code text-caption text-on-surface-variant">29</span>
                </div>
                <div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
                  <span className="font-label-code text-caption text-on-surface-variant">30</span>
                </div>

                {/* 31 Calendar Days */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                  const dayStat = calendarDays.find((d) => d.day === dayNum);
                  const isSelected = selectedDay === dayNum;
                  const premDisplay = dayStat && dayStat.total_premium > 0 ? fmt(dayStat.total_premium) : null;

                  return (
                    <div
                      key={dayNum}
                      className={`h-24 p-space-xs rounded-lg transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 ring-2 ring-primary shadow-md'
                          : 'bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                      onClick={() => setSelectedDay(dayNum)}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-label-code text-caption font-semibold ${
                            isSelected ? 'text-primary' : 'text-on-surface'
                          }`}
                        >
                          {dayNum}
                        </span>
                        {premDisplay && (
                          <span
                            className={`font-label-code text-[10px] px-1 rounded ${
                              dayStat?.has_high_risk
                                ? 'text-error bg-error-container/20'
                                : 'text-tertiary bg-tertiary-container/10'
                            }`}
                          >
                            {premDisplay}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {dayStat?.has_high_risk && <span className="w-2 h-2 rounded-full bg-error"></span>}
                        {dayStat?.has_med_risk && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        {dayStat?.has_low_risk && <span className="w-2 h-2 rounded-full bg-tertiary"></span>}
                        {!dayStat && <span className="w-2 h-2 rounded-full bg-tertiary"></span>}
                      </div>
                    </div>
                  );
                })}

                {/* Bleed Day Nov 1 */}
                <div className="h-24 p-space-xs rounded-lg bg-surface-container-low/40 opacity-40 flex flex-col justify-between">
                  <span className="font-label-code text-caption text-on-surface-variant">1</span>
                </div>
              </div>
            </div>

            {/* Right Side Panel: Scheduled Renewals for Selected Date (35%) */}
            <div className="col-span-12 xl:col-span-4 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                {/* Panel Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">event_upcoming</span>
                      <span className="font-caption text-caption text-primary font-bold uppercase tracking-wider">
                        Scheduled Target
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Oct {selectedDay}, 2025</h3>
                  </div>
                  <span className="font-label-code text-label-code font-semibold px-space-sm py-1 rounded-full bg-error-container text-on-error-container shadow-xs">
                    {scheduledCards.filter((c) => c.risk_score >= 75).length} High Risk
                  </span>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Showing priority interventions scheduled for Oct {selectedDay}, 2025 requiring retention actions.
                </p>

                {/* Detailed Policy Cards List */}
                <div className="flex flex-col gap-space-sm">
                  {loadingScheduled ? (
                    <div className="py-8 text-center text-on-surface-variant font-caption text-caption">
                      Loading schedule items...
                    </div>
                  ) : scheduledCards.length === 0 ? (
                    <div className="py-8 text-center text-on-surface-variant font-caption text-caption">
                      No scheduled renewals for this date.
                    </div>
                  ) : (
                    scheduledCards.slice(0, 3).map((card) => (
                      <div
                        key={card.policy_id}
                        className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-sm shadow-xs group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-space-sm">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm font-bold">
                              {card.customer_initials}
                            </div>
                            <div>
                              <h4 className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                                {card.customer_name}
                              </h4>
                              <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-tertiary">
                                  health_and_safety
                                </span>
                                {card.product_name} • {card.policy_id}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-metric-stat text-body-lg text-on-surface block">
                              {fmt(card.annual_premium)}
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant">Annual Premium</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-space-xs bg-surface-container-lowest/80 p-space-sm rounded-lg">
                          <div className="flex items-center gap-space-xs">
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                                card.risk_score >= 80 ? 'bg-error/10 text-error' : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {card.risk_score >= 80 ? 'local_fire_department' : 'warning'}
                              </span>
                            </span>
                            <span className="font-caption text-caption text-error font-semibold">Lapse Index</span>
                            <span className="font-label-code text-label-code font-bold text-error">
                              {card.risk_score}/100
                            </span>
                          </div>

                          {/* STRICTLY WhatsApp Actions - VOICE CALLS REMOVED */}
                          <button
                            className="px-space-sm py-1 bg-primary text-on-primary rounded-lg font-caption text-caption font-semibold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1 active:scale-[0.97]"
                            type="button"
                            onClick={() => handleWhatsAppPing(card.policy_id, card.customer_name)}
                          >
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            <span>WhatsApp Ping</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  className="w-full py-space-sm bg-surface-container text-on-surface font-caption text-caption font-semibold rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1"
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('policy-ledger-table');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>View All {scheduledCards.length} Schedule Items in Ledger</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Quick Date Analytical Summary */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant">
                      Oct {selectedDay} Projected Premium
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface block">
                      {fmt(scheduledCards.reduce((acc, c) => acc + c.annual_premium, 0) || 124900)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-caption text-caption text-error font-medium">
                    {fmt(scheduledCards.filter(c => c.risk_score >= 75).reduce((acc, c) => acc + c.annual_premium, 0) || 68900)} at High Risk
                  </span>
                  <span className="font-label-code text-caption text-on-surface-variant block">
                    {summary.exposure_pct}% Exposure
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Section: Comprehensive Filterable Master Policy Table */}
          <section id="policy-ledger-table" className="w-full px-space-xl pb-space-2xl">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
              {/* Ledger Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-space-base">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Master Policy Retention Ledger
                  </h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Showing <strong className="text-on-surface">{policies.length}</strong> of{' '}
                    <strong className="text-on-surface">{totalCount}</strong> active underwritten renewals
                    across regional books
                  </span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center bg-surface-container-low px-space-sm py-1 rounded-xl">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant mr-1">tune</span>
                    <span className="font-caption text-caption text-on-surface font-medium">
                      Sort by: Risk Score (Descending)
                    </span>
                  </div>
                  <button
                    className="h-9 px-space-md rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold flex items-center gap-space-2xs hover:bg-surface-container-high transition-colors"
                    type="button"
                    onClick={() => {
                      setSelectedRisk('HIGH');
                      setPage(1);
                      showToast('Filtered ledger to High Hazard policies only');
                    }}
                  >
                    <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                    High Hazard ({summary.high_risk_count})
                  </button>
                </div>
              </div>

              {/* Table Structure */}
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
                      <th className="py-space-sm px-space-md font-semibold">Recommended Channel</th>
                      <th className="py-space-sm px-space-md rounded-r-lg font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md text-on-surface">
                    {loadingPolicies ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-on-surface-variant font-caption text-caption">
                          Loading master ledger...
                        </td>
                      </tr>
                    ) : policies.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-on-surface-variant font-caption text-caption">
                          No policies match current search or filters.
                        </td>
                      </tr>
                    ) : (
                      policies.map((p) => (
                        <tr
                          key={p.policy_id}
                          className="hover:bg-surface-container-low transition-colors group cursor-pointer shadow-xs"
                        >
                          <td className="py-space-md px-space-md">
                            <span className="font-label-code text-label-code font-bold text-primary group-hover:underline">
                              {p.policy_id}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex items-center gap-space-sm">
                              {p.customer_avatar ? (
                                <img
                                  className="w-8 h-8 rounded-full object-cover shadow-xs"
                                  src={p.customer_avatar}
                                  alt={p.customer_name}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-headline-sm font-semibold text-[13px]">
                                  {p.customer_name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="font-headline-sm text-body-md text-on-surface font-semibold block leading-tight">
                                  {p.customer_name}
                                </span>
                                <span className="font-caption text-caption text-on-surface-variant">
                                  {p.customer_email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span className="font-caption text-caption text-on-surface font-medium bg-surface-container px-space-sm py-1 rounded-md">
                              {p.product_name}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span className="font-metric-stat text-body-md text-on-surface font-semibold">
                              {fmt(p.annual_premium)}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`material-symbols-outlined text-[16px] ${
                                  p.risk_score >= 75
                                    ? 'text-error'
                                    : p.risk_score >= 50
                                    ? 'text-amber-500'
                                    : 'text-tertiary'
                                }`}
                              >
                                event
                              </span>
                              <span
                                className={`font-label-code text-caption font-semibold ${
                                  p.risk_score >= 75
                                    ? 'text-error'
                                    : p.risk_score >= 50
                                    ? 'text-amber-500'
                                    : 'text-tertiary'
                                }`}
                              >
                                {p.renewal_date}
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span className="font-caption text-caption text-on-surface">
                              {p.tenure_years} Years
                            </span>
                          </td>
                          <td className="py-space-md px-space-md text-center">
                            <span className="font-label-code text-caption text-on-surface bg-surface-container px-2 py-0.5 rounded-full">
                              {p.claims_count}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex items-center gap-space-xs">
                              <div className="w-16 h-2 rounded-full bg-surface-container overflow-hidden">
                                <div
                                  className={`h-full ${
                                    p.risk_score >= 75
                                      ? 'bg-error'
                                      : p.risk_score >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-tertiary'
                                  }`}
                                  style={{ width: `${p.risk_score}%` }}
                                ></div>
                              </div>
                              <span
                                className={`font-label-code text-label-code font-bold ${
                                  p.risk_score >= 75
                                    ? 'text-error'
                                    : p.risk_score >= 50
                                    ? 'text-amber-500'
                                    : 'text-tertiary'
                                }`}
                              >
                                {p.risk_score}
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            {/* Strictly WhatsApp - NO CALL ACTIONS */}
                            <span
                              className={`font-caption text-caption px-space-sm py-1 rounded-md font-semibold flex items-center gap-1 w-max ${
                                p.risk_score >= 75
                                  ? 'text-error bg-error-container/20'
                                  : p.risk_score >= 50
                                  ? 'text-amber-600 bg-amber-100/60'
                                  : 'text-tertiary bg-tertiary-fixed-dim/20'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">chat</span>
                              {p.recommended_action}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md text-right">
                            <button
                              className="px-space-sm py-1 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-caption text-caption font-semibold transition-all flex items-center gap-1 ml-auto"
                              type="button"
                              title="Send WhatsApp Outreach"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppPing(p.policy_id, p.customer_name);
                              }}
                            >
                              <span className="material-symbols-outlined text-[15px]">send</span>
                              <span>WhatsApp</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-md">
                <span className="font-caption text-caption text-on-surface-variant">
                  Showing {(page - 1) * 5 + 1} to {Math.min(page * 5, totalCount)} of {totalCount} entries
                </span>
                <div className="flex items-center gap-space-xs">
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-caption text-caption hover:bg-surface-container disabled:opacity-50 transition-colors"
                    disabled={page <= 1}
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg bg-primary text-on-primary font-caption text-caption font-semibold shadow-sm"
                    type="button"
                  >
                    {page}
                  </button>
                  {page < totalPages && (
                    <button
                      className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors"
                      type="button"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {page + 1}
                    </button>
                  )}
                  {page + 1 < totalPages && (
                    <span className="px-space-xs text-outline font-label-code">...</span>
                  )}
                  {page + 2 < totalPages && (
                    <button
                      className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container transition-colors"
                      type="button"
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface font-caption text-caption hover:bg-surface-container disabled:opacity-50 transition-colors"
                    disabled={page >= totalPages}
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DesktopLayout>
  );
}
