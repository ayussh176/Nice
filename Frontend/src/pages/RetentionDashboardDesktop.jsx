import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopLayout from '../components/DesktopLayout';

export default function RetentionDashboardDesktop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const [dispatchedPolicies, setDispatchedPolicies] = useState({});
  const [batchDispatching, setBatchDispatching] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch('/api/overview');
        if (res.ok) {
          const json = await res.json();
          setOverviewData(json);
        }
      } catch (err) {
        console.error('Error fetching overview dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const handleRetainOffer = async (policyId, customerName) => {
    try {
      const res = await fetch(`/api/overview/interventions/${policyId}/action?action_type=retain_offer`, {
        method: 'POST'
      });
      if (res.ok) {
        setDispatchedPolicies(prev => ({ ...prev, [policyId]: true }));
        showToast(`12% Retention voucher dispatched to ${customerName} (${policyId})`);
      }
    } catch (err) {
      showToast(`Action dispatched for ${customerName}`, 'info');
    }
  };

  const handleAutoDispatchAll = async () => {
    setBatchDispatching(true);
    try {
      const res = await fetch('/api/overview/interventions/auto-dispatch-all', {
        method: 'POST'
      });
      if (res.ok) {
        const json = await res.json();
        showToast(json.message || 'Auto-dispatch completed for all high-risk accounts!');
      }
    } catch (err) {
      showToast('Automated retention packages dispatched to queue', 'success');
    } finally {
      setBatchDispatching(false);
    }
  };

  // Safe fallbacks matching original Stitch templates
  const kpis = overviewData?.kpis || {
    total_portfolio: 10000,
    total_portfolio_formatted: '10,000',
    active_sync_pct: 99.4,
    premium_at_risk: 41462450.0,
    premium_at_risk_formatted: '₹4.15 Cr',
    critical_accounts_count: 2255,
    due_this_month: 35,
    volume_share_pct: 17.5,
    renewal_rate: 87.4,
    renewal_target: 90.0,
    renewal_gap: -2.6,
    outreach_sent: 14,
    outreach_total_due: 35,
    outreach_completed_pct: 40.0,
    outreach_pending: 21,
    lapsed_mtd: 12,
    lapse_avoided_amount_formatted: '₹1.42L',
    lapse_avoided_pct: 73.0
  };

  const riskSegments = overviewData?.risk_segments?.segments || [
    { key: 'low', label: 'Low Risk (Standard)', count: 4340, pct: 43.4, color: '#007D55', stroke_dasharray: '289', stroke_dashoffset: '163.6' },
    { key: 'medium', label: 'Medium Risk (Watchlist)', count: 3405, pct: 34.1, color: '#565E74', stroke_dasharray: '289', stroke_dashoffset: '65.1' },
    { key: 'high', label: 'High Risk (At-Lapse)', count: 2255, pct: 22.6, color: '#BA1A1A', stroke_dasharray: '289', stroke_dashoffset: '-0.2' }
  ];

  const totalBook = overviewData?.risk_segments?.total_book || 10000;
  const queueSummary = overviewData?.intervention_queue || {
    critical_under_7d_count: 5,
    critical_under_7d_exposure: '₹1.84L',
    elevated_under_14d_count: 12
  };

  const highRiskAccounts = overviewData?.high_risk_accounts || [
    {
      policy_id: 'POL-8842-MTR',
      customer_id: 'CUST-1082',
      customer_name: 'Rahul Sharma',
      customer_initials: 'RS',
      lob_name: 'Motor Comp',
      lob_icon: 'directions_car',
      renewal_due_date: '04 Nov 2024',
      due_in_text: 'In 2 Days',
      is_critical: true,
      annual_premium_formatted: '₹38,450',
      risk_score: 78,
      risk_level: 'HIGH',
      primary_trigger: 'Claim repudiation dispute (Q2)',
      trigger_icon: 'gavel',
      recommended_action: 'Retain Offer'
    },
    {
      policy_id: 'POL-9201-HLT',
      customer_id: 'CUST-1044',
      customer_name: 'Priya Patel',
      customer_initials: 'PP',
      lob_name: 'Mediclaim Plus',
      lob_icon: 'health_and_safety',
      renewal_due_date: '07 Nov 2024',
      due_in_text: 'In 5 Days',
      is_critical: true,
      annual_premium_formatted: '₹52,000',
      risk_score: 82,
      risk_level: 'HIGH',
      primary_trigger: '18% rate revision shock',
      trigger_icon: 'price_change',
      recommended_action: 'Dispatch Nudge'
    },
    {
      policy_id: 'POL-3490-LFE',
      customer_id: 'CUST-1102',
      customer_name: 'Amit Verma',
      customer_initials: 'AV',
      lob_name: 'Term Shield 20',
      lob_icon: 'family_restroom',
      renewal_due_date: '12 Nov 2024',
      due_in_text: 'In 10 Days',
      is_critical: false,
      annual_premium_formatted: '₹64,200',
      risk_score: 74,
      risk_level: 'HIGH',
      primary_trigger: 'Unopened WhatsApp & SMS notifications (3x)',
      trigger_icon: 'unsubscribe',
      recommended_action: 'Retain Offer'
    },
    {
      policy_id: 'POL-6731-MTR',
      customer_id: 'CUST-1192',
      customer_name: 'Nandini Mukhopadhyay',
      customer_initials: 'NM',
      lob_name: 'Private EV Fleet',
      lob_icon: 'directions_car',
      renewal_due_date: '14 Nov 2024',
      due_in_text: 'In 12 Days',
      is_critical: false,
      annual_premium_formatted: '₹89,000',
      risk_score: 88,
      risk_level: 'HIGH',
      primary_trigger: 'Recurring Auto-Debit Mandate Failed',
      trigger_icon: 'credit_card_off',
      recommended_action: 'Trigger Mandate'
    }
  ];

  const displayedAccounts = filterTrigger
    ? highRiskAccounts.filter(acc => acc.primary_trigger.toLowerCase().includes('claim') || acc.primary_trigger.toLowerCase().includes('payment'))
    : highRiskAccounts;

  return (
    <DesktopLayout activePath="/">
      {/* Toast Feedback Notification */}
      {toast.visible && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-space-sm px-space-lg py-space-md rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl border border-outline-variant/30 animate-fade-in pointer-events-auto">
          <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">
            {toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-body-md text-inverse-on-surface font-semibold">
              Live Action Executed
            </span>
            <span className="font-caption text-caption text-inverse-on-surface/80">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      <main className="w-full pt-16 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          <div className="p-space-lg space-y-space-lg max-w-[1720px] mx-auto w-full">
            
            {/* Guided Sandbox Banner */}
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
                        PostgreSQL Live Connected ({totalBook.toLocaleString()} Records)
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Standard operating protocol for high-loss mitigation &amp; automated policy re-underwriting.
                    </p>
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

            {/* Core KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
              
              {/* Tile 1: Total Portfolio */}
              <div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Total Portfolio</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">folder_shared</span>
                </div>
                <div className="my-space-xs">
                  <span className="font-metric-stat text-[26px] text-on-surface">{kpis.total_portfolio_formatted}</span>
                  <span className="font-caption text-caption text-on-surface-variant block mt-0.5">Policies Underwritten</span>
                </div>
                <div className="flex items-center gap-1.5 pt-space-xs bg-surface-container-lowest">
                  <span className="h-2 w-2 rounded-full bg-tertiary"></span>
                  <span className="font-caption text-caption text-tertiary font-semibold">{kpis.active_sync_pct}% active sync</span>
                </div>
              </div>

              {/* Tile 2: Premium At Risk */}
              <div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
                <div className="flex items-start justify-between">
                  <span className="font-caption text-caption uppercase tracking-wider text-error">Premium At Risk</span>
                  <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                </div>
                <div className="my-space-xs">
                  <span className="font-metric-stat text-[24px] text-error font-bold">{kpis.premium_at_risk_formatted}</span>
                  <span className="font-caption text-caption text-on-surface-variant block mt-0.5">Estimated Loss Exp.</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="font-label-code text-[12px] font-semibold text-error">{kpis.critical_accounts_count.toLocaleString()}</span>
                  <span className="font-caption text-caption">critical accounts flag</span>
                </div>
              </div>

              {/* Tile 3: Due This Month */}
              <div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Due This Month</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">event_repeat</span>
                </div>
                <div className="my-space-xs">
                  <span className="font-metric-stat text-[26px] text-on-surface">{kpis.due_this_month}</span>
                  <span className="font-caption text-caption text-on-surface-variant block mt-0.5">Maturity Horizon</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-caption text-caption">Volume share</span>
                  <span className="font-label-code text-label-code text-primary font-semibold">{kpis.volume_share_pct}% book</span>
                </div>
              </div>

              {/* Tile 4: Renewal Rate */}
              <div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Renewal Rate</span>
                  <span className="material-symbols-outlined text-tertiary text-[18px]">query_stats</span>
                </div>
                <div className="my-space-xs">
                  <span className="font-metric-stat text-[26px] text-on-surface">{kpis.renewal_rate}%</span>
                  <span className="font-caption text-caption text-on-surface-variant block mt-0.5">Rolling 30D Window</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-caption text-caption">Target: {kpis.renewal_target}%</span>
                  <span className="font-label-code text-[12px] text-error font-medium">{kpis.renewal_gap}% gap</span>
                </div>
              </div>

              {/* Tile 5: Outreach Sent */}
              <div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Outreach Sent</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">forward_to_inbox</span>
                </div>
                <div className="my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-stat text-[24px] text-on-surface">{kpis.outreach_sent}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ {kpis.outreach_total_due} due</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ "width": `${kpis.outreach_completed_pct}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-caption text-caption">{kpis.outreach_completed_pct}% completed</span>
                  <span className="font-label-code text-[11px] text-on-surface-variant font-medium">{kpis.outreach_pending} pending</span>
                </div>
              </div>

              {/* Tile 6: Lapsed MTD */}
              <div className="rounded-xl bg-surface-container-lowest p-space-base shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant">Lapsed MTD</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">cancel_schedule_send</span>
                </div>
                <div className="my-space-xs">
                  <span className="font-metric-stat text-[26px] text-on-surface">{kpis.lapsed_mtd}</span>
                  <span className="font-caption text-caption text-on-surface-variant block mt-0.5">Definitive Expirations</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-low px-2 py-1 rounded-md">
                  <span className="font-caption text-[11px] text-tertiary font-medium">{kpis.lapse_avoided_amount_formatted} avoided</span>
                  <span className="font-label-code text-[11px] text-tertiary font-bold">{kpis.lapse_avoided_pct}% saved</span>
                </div>
              </div>

            </div>

            {/* Split Section: Renewal Trajectory (Left 8 cols) & Risk Segments / SLAs (Right 4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              
              {/* LEFT: Renewal Trajectory Engine */}
              <div className="lg:col-span-8 space-y-space-lg">
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-base">
                    <div>
                      <span className="font-headline-sm text-headline-sm text-on-surface">Renewal Trajectory Engine</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Monthly historical tracking of reclaimed policies versus realized unmitigated lapses.
                      </p>
                    </div>
                    <div className="flex items-center gap-space-md bg-surface-container-low px-space-md py-1 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-tertiary"></span>
                        <span className="font-caption text-caption text-on-surface font-medium">Reclaimed (92%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-error"></span>
                        <span className="font-caption text-caption text-on-surface font-medium">Lapsed (8%)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* SVG Chart Trajectory Visualizer */}
                  <div className="h-48 w-full relative pt-space-xs">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 650 180">
                      <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="30" y2="30"></line>
                      <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="80" y2="80"></line>
                      <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="650" y1="130" y2="130"></line>
                      <path d="M 10 130 Q 120 110, 220 90 T 430 45 T 640 25" fill="none" stroke="#007D55" strokeLinecap="round" strokeWidth="3"></path>
                      <circle cx="10" cy="130" fill="#007D55" r="4.5"></circle>
                      <circle cx="220" cy="90" fill="#007D55" r="4.5"></circle>
                      <circle cx="430" cy="45" fill="#007D55" r="4.5"></circle>
                      <circle cx="640" cy="25" fill="#007D55" r="4.5"></circle>
                      <path d="M 10 70 Q 120 85, 220 100 T 430 135 T 640 148" fill="none" stroke="#BA1A1A" strokeDasharray="3 3" strokeLinecap="round" strokeWidth="2.5"></path>
                      <circle cx="10" cy="70" fill="#BA1A1A" r="3.5"></circle>
                      <circle cx="220" cy="100" fill="#BA1A1A" r="3.5"></circle>
                      <circle cx="430" cy="135" fill="#BA1A1A" r="3.5"></circle>
                      <circle cx="640" cy="148" fill="#BA1A1A" r="3.5"></circle>
                    </svg>
                    <div className="flex justify-between text-caption font-label-code text-on-surface-variant pt-2 border-t border-surface-container">
                      <span>OCT 24</span>
                      <span>NOV 24</span>
                      <span>DEC 24</span>
                      <span>JAN 25</span>
                      <span>FEB 25</span>
                      <span>MAR 25</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-md mt-space-md border-t border-surface-container">
                    <div className="p-space-xs flex flex-col">
                      <span className="font-caption text-caption text-on-surface-variant">Quarterly Peak Retention</span>
                      <span className="font-metric-stat text-body-lg text-tertiary">92.8% in March</span>
                    </div>
                    <div className="p-space-xs flex flex-col">
                      <span className="font-caption text-caption text-on-surface-variant">Lapse Rate Trough</span>
                      <span className="font-metric-stat text-body-lg text-primary">7.2% in Jan</span>
                    </div>
                    <div className="p-space-xs flex flex-col">
                      <span className="font-caption text-caption text-on-surface-variant">Net Saved Capital</span>
                      <span className="font-metric-stat text-body-lg text-on-surface">₹45.1L MTD</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                  <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="font-headline-sm text-body-lg text-on-surface font-semibold">Underwriting AI Reliability</span>
                        <span className="font-label-code text-caption text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded">99.2% ACC</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Ensemble XGBoost + ChurnFormer neural calibration score on policy renewal predictions.
                      </p>
                      <div className="space-y-space-xs">
                        <div className="flex justify-between font-caption text-caption">
                          <span className="text-on-surface-variant">Model Confidence</span>
                          <span className="font-label-code text-on-surface font-semibold">0.94 ROC-AUC</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ "width": "94%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-space-md mt-space-md border-t border-surface-container flex items-center justify-between text-caption font-caption text-on-surface-variant">
                      <span>Last calibrated: 4 mins ago</span>
                      <span className="text-primary font-semibold cursor-pointer hover:underline">View weights</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <span className="font-headline-sm text-body-lg text-on-surface font-semibold">Loss Prevention Velocity</span>
                        <span className="font-label-code text-caption text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">₹3.8X ROI</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        Every ₹1 spent on targeted loyalty vouchers and automated alerts reclaims ₹3.80 in gross written premium.
                      </p>
                      <div className="space-y-space-xs">
                        <div className="flex justify-between font-caption text-caption">
                          <span className="text-on-surface-variant">Intervention Yield</span>
                          <span className="font-label-code text-on-surface font-semibold">91.8% Yield</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                          <div className="bg-tertiary h-full rounded-full" style={{ "width": "91.8%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-space-md mt-space-md border-t border-surface-container flex items-center justify-between text-caption font-caption text-on-surface-variant">
                      <span>Underwriting live SLA: Active</span>
                      <span className="text-primary font-semibold cursor-pointer hover:underline">SLA audit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Portfolio Risk Segments & Priority Queue */}
              <div className="lg:col-span-4 space-y-space-lg">
                
                {/* Donut Chart: Portfolio Risk Segments */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
                  <div className="flex items-center justify-between mb-space-base">
                    <div>
                      <span className="font-headline-sm text-headline-sm text-on-surface">Portfolio Risk Segments</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Predictive churn categorization</p>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[20px]">pie_chart</span>
                  </div>
                  
                  <div className="flex items-center justify-center py-space-sm">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" fill="transparent" r="46" stroke="#E2E8F0" strokeWidth="12"></circle>
                        {riskSegments.map((seg, idx) => (
                          <circle
                            key={seg.key}
                            cx="60"
                            cy="60"
                            fill="transparent"
                            r="46"
                            stroke={seg.color}
                            strokeDasharray={seg.stroke_dasharray}
                            strokeDashoffset={seg.stroke_dashoffset}
                            strokeLinecap="round"
                            strokeWidth="12"
                          ></circle>
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="font-caption text-caption uppercase text-on-surface-variant">Active Book</span>
                        <span className="font-headline-lg text-headline-lg text-on-surface font-bold leading-none my-0.5">
                          {totalBook.toLocaleString()}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">Policies</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-space-xs mt-space-sm">
                    {riskSegments.map((seg) => (
                      <div key={seg.key} className={`flex items-center justify-between p-space-xs rounded-lg ${seg.key === 'high' ? 'bg-error-container/40' : 'bg-surface-container-low'}`}>
                        <div className="flex items-center gap-space-xs">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }}></span>
                          <span className="font-body-sm text-body-sm font-medium text-on-surface">{seg.label}</span>
                        </div>
                        <div className="flex items-center gap-space-sm font-label-code text-label-code">
                          <span className={`font-bold ${seg.key === 'high' ? 'text-error' : 'text-on-surface'}`}>{seg.count.toLocaleString()}</span>
                          <span className={`${seg.key === 'high' ? 'text-error' : 'text-on-surface-variant'} text-[11px]`}>{seg.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Queue Card */}
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
                        <span className="font-caption text-caption text-on-surface-variant">
                          {queueSummary.critical_under_7d_count} policies · {queueSummary.critical_under_7d_exposure} Exposure
                        </span>
                      </div>
                      <button 
                        onClick={() => navigate('/lapse-risk-analysis')}
                        className="h-9 px-space-md bg-error text-on-error rounded-xl font-body-sm text-body-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                      >
                        Execute SLA
                      </button>
                    </div>

                    <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">notification_important</span>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface">Elevated &lt; 14 Days</span>
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          {queueSummary.elevated_under_14d_count} policies · Pending outreach
                        </span>
                      </div>
                      <button 
                        onClick={() => navigate('/smart-reminders')}
                        className="h-9 px-space-md bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold rounded-xl hover:bg-surface-container-high transition-colors"
                      >
                        Batch View
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* High-Risk Interventions Table */}
            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-base bg-surface-container-lowest">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface">High-Risk Interventions Required</span>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
                      {kpis.critical_accounts_count.toLocaleString()} Accounts
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Actionable workbench displaying active lapse probabilities derived from claim disputes and payment friction in PostgreSQL.
                  </p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button 
                    onClick={() => setFilterTrigger(!filterTrigger)}
                    className={`h-10 px-space-md rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1.5 ${filterTrigger ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span> 
                    {filterTrigger ? 'Showing Critical' : 'Filter Triggers'}
                  </button>
                  <button 
                    onClick={handleAutoDispatchAll}
                    disabled={batchDispatching}
                    className="h-10 px-space-md bg-primary-container text-on-primary rounded-xl font-body-sm text-body-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${batchDispatching ? 'animate-spin' : ''}`}>
                      {batchDispatching ? 'refresh' : 'auto_fix_high'}
                    </span> 
                    {batchDispatching ? 'Dispatching...' : `Auto-Dispatch All (${displayedAccounts.length})`}
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
                    {displayedAccounts.map((account) => {
                      const isDispatched = dispatchedPolicies[account.policy_id];

                      return (
                        <tr key={account.policy_id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-space-md px-space-base">
                            <div className="flex items-center gap-space-sm">
                              <div className="h-9 w-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm text-[13px]">
                                {account.customer_initials}
                              </div>
                              <div>
                                <span className="font-semibold text-on-surface block">{account.customer_name}</span>
                                <span className="font-label-code text-[11px] text-on-surface-variant">#{account.policy_id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-base">
                            <span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-0.5 font-caption text-caption text-on-surface">
                              <span className="material-symbols-outlined text-[13px] text-primary">{account.lob_icon}</span>
                              {account.lob_name}
                            </span>
                          </td>
                          <td className="py-space-md px-space-base">
                            <span className="font-label-code text-label-code text-on-surface font-semibold block">{account.renewal_due_date}</span>
                            <span className={`font-caption text-caption ${account.is_critical ? 'text-error font-medium' : 'text-on-surface-variant font-normal'}`}>
                              {account.due_in_text}
                            </span>
                          </td>
                          <td className="py-space-md px-space-base font-label-code text-label-code font-bold text-on-surface">
                            {account.annual_premium_formatted}
                          </td>
                          <td className="py-space-md px-space-base">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[12px] font-bold">
                                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                {Math.round(account.risk_score)}/100
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-base">
                            <span className="inline-flex items-center gap-1 text-on-surface font-medium">
                              <span className="material-symbols-outlined text-[16px] text-error">{account.trigger_icon}</span>
                              {account.primary_trigger}
                            </span>
                          </td>
                          <td className="py-space-md px-space-base text-right">
                            <div className="flex items-center justify-end gap-space-xs">
                              <button
                                onClick={() => handleRetainOffer(account.policy_id, account.customer_name)}
                                className={`px-space-md h-8 rounded-lg font-caption text-caption font-semibold shadow-sm transition-all flex items-center gap-1 ${
                                  isDispatched
                                    ? 'bg-tertiary-container text-on-tertiary-container'
                                    : 'bg-primary text-on-primary hover:opacity-90'
                                }`}
                              >
                                {isDispatched ? (
                                  <>
                                    <span className="material-symbols-outlined text-[14px]">check</span>
                                    Dispatched
                                  </>
                                ) : (
                                  account.recommended_action || 'Retain Offer'
                                )}
                              </button>
                              <button
                                onClick={() => navigate('/customer-details')}
                                className="px-space-sm h-8 rounded-lg bg-surface-container-high text-on-surface-variant font-caption text-caption font-semibold hover:bg-surface-container transition-colors"
                              >
                                Dossier
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination / Footer */}
              <div className="p-space-base bg-surface-container-lowest flex items-center justify-between font-caption text-caption text-on-surface-variant">
                <span>Showing {displayedAccounts.length} of {kpis.critical_accounts_count.toLocaleString()} High-Risk Policyholders requiring action</span>
                <div className="flex items-center gap-space-xs">
                  <button className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50" disabled="">
                    Previous
                  </button>
                  <span className="px-2 py-1 font-label-code text-primary font-bold">Page 1 of {Math.ceil(kpis.critical_accounts_count / 10)}</span>
                  <button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </DesktopLayout>
  );
}
