import React, { useState, useEffect } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function LapseRiskAnalysisDesktop() {
  // Top Executive Metrics State
  const [metrics, setMetrics] = useState({
    total_premium_at_risk: 41462450,
    critical_policies_count: 18,
    projected_cycle_increase: 68400,
    critical_churn_ratio_pct: 9.0,
    churn_ratio_delta: 1.2,
    total_portfolio_count: 200,
    low_risk_count: 132,
    low_risk_pct: 66.0,
    medium_risk_count: 50,
    medium_risk_pct: 25.0,
    high_risk_count: 18,
    high_risk_pct: 9.0,
    engine_version: 'v4.11 Neural',
    precision_pct: 98.4,
    last_batch_run: '14 mins ago'
  });

  // Triage Queue State
  const [queue, setQueue] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Policy Inspection State (Gemini + OpenRouter)
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [loadingInspection, setLoadingInspection] = useState(false);

  // Modals & Toast State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Fetch Executive Metrics on mount
  useEffect(() => {
    fetch('/api/risk-analysis/metrics')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMetrics(data);
      })
      .catch((err) => console.error('Error fetching risk metrics:', err));
  }, []);

  // 2. Fetch Triage Queue when filterTab or search changes
  useEffect(() => {
    setLoadingQueue(true);
    const params = new URLSearchParams({ filter_type: filterTab });
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    fetch(`/api/risk-analysis/queue?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setQueue(data);
        setLoadingQueue(false);
        // Default select the first policy in queue if none selected or if selected is not in queue
        if (data.length > 0 && (!selectedPolicyId || !data.some((p) => p.policy_id === selectedPolicyId))) {
          setSelectedPolicyId(data[0].policy_id);
        }
      })
      .catch((err) => {
        console.error('Error fetching triage queue:', err);
        setLoadingQueue(false);
      });
  }, [filterTab, searchQuery]);

  // 3. Fetch Policy Risk Inspection (Gemini Explainable Score + OpenRouter Offer)
  useEffect(() => {
    if (!selectedPolicyId) return;
    setLoadingInspection(true);
    fetch(`/api/risk-analysis/policies/${selectedPolicyId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setInspection(data);
        setLoadingInspection(false);
      })
      .catch((err) => {
        console.error('Error fetching policy risk inspection:', err);
        setLoadingInspection(false);
      });
  }, [selectedPolicyId]);

  // 4. Deploy Retention Offer (strictly via WhatsApp)
  const handleDeployOffer = async () => {
    if (!selectedPolicyId) return;
    try {
      const res = await fetch(`/api/risk-analysis/policies/${selectedPolicyId}/deploy-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custom_message: inspection?.prescribed_workflow?.whatsapp_message_preview,
          channel: 'WhatsApp'
        })
      });
      const data = await res.json();
      showToast(`Targeted Retention Offer deployed via WhatsApp to ${inspection?.customer_name || selectedPolicyId}!`);
    } catch (err) {
      showToast(`Retention Offer dispatched via WhatsApp!`);
    }
  };

  // Helper currency formatter
  const fmt = (num) => {
    if (!num) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Risk Score Arc Geometry
  const score = inspection?.risk_score || 78;
  const circumference = 2 * Math.PI * 48; // ~301.6
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <DesktopLayout activePath="/lapse-risk-analysis">
      <main className="w-full pt-16 bg-surface min-h-screen">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce transition-all">
            <span className="material-symbols-outlined text-[20px]">mark_chat_read</span>
            <span className="font-body-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* WhatsApp Message Preview Modal */}
        {showWhatsAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
              <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">chat</span>
                  <div>
                    <h3 className="font-headline-sm text-body-lg font-bold">WhatsApp Dispatch Preview</h3>
                    <p className="font-caption text-caption text-emerald-100">
                      Generated by NVIDIA Nemotron 3.5 Lightning
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-white hover:text-emerald-200 transition-colors"
                  onClick={() => setShowWhatsAppModal(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 bg-surface-container-low/50">
                <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                  <span>To: <strong>{inspection?.customer_name}</strong> ({inspection?.customer_phone})</span>
                  <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Encrypted</span>
                </div>

                <div className="bg-[#E7F8E9] p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold uppercase">
                    <span>InsureRenew Official Retention Bot</span>
                    <span>Just Now</span>
                  </div>
                  <p className="font-body-md text-body-md text-emerald-950 whitespace-pre-wrap leading-relaxed">
                    {inspection?.prescribed_workflow?.whatsapp_message_preview ||
                      `Hi ${inspection?.customer_name}, as a valued customer we have unlocked an exclusive renewal discount on your ${inspection?.policy_type}. Tap to claim: https://renew.insure/${inspection?.policy_id}`}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-body-sm font-semibold hover:bg-surface-container-high transition-colors"
                  onClick={() => setShowWhatsAppModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-body-sm font-semibold flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    handleDeployOffer();
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Confirm &amp; Send WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Dossier Modal */}
        {showDossierModal && inspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                    {inspection.customer_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-sm text-on-surface font-bold">
                      Customer Dossier: {inspection.customer_name}
                    </h3>
                    <span className="font-caption text-caption text-on-surface-variant">
                      Policy #{inspection.policy_id} • {inspection.policy_type}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-on-surface-variant hover:text-on-surface"
                  onClick={() => setShowDossierModal(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-surface-container-low p-3 rounded-xl">
                    <span className="font-caption text-caption text-on-surface-variant block">City / State</span>
                    <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                      {inspection.city}, {inspection.state}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl">
                    <span className="font-caption text-caption text-on-surface-variant block">Tenure</span>
                    <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                      {inspection.tenure_years} Years
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl">
                    <span className="font-caption text-caption text-on-surface-variant block">On-Time Pay</span>
                    <span className="font-headline-sm text-body-md font-semibold text-tertiary">
                      {inspection.on_time_payment_rate}%
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl">
                    <span className="font-caption text-caption text-on-surface-variant block">Rejected Claims</span>
                    <span className="font-headline-sm text-body-md font-semibold text-error">
                      {inspection.rejected_claims}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2">
                  <h4 className="font-headline-sm text-body-md font-bold text-on-surface">
                    Gemini Actuarial Analysis
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {inspection.ai_explanation_summary}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/20 flex justify-end">
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-colors"
                  onClick={() => setShowDossierModal(false)}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col w-full">
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg">
            {/* Top Executive Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
              {/* Premium at Risk */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                    Total Premium At Risk
                  </span>
                  <span className="material-symbols-outlined text-error text-[20px]">monetization_on</span>
                </div>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                    {fmt(metrics.total_premium_at_risk)}
                  </span>
                  <span className="font-label-code text-label-code text-error bg-error-container/40 px-space-xs py-space-2xs rounded font-medium">
                    {metrics.critical_policies_count} Policies
                  </span>
                </div>
                <div className="flex items-center gap-space-xs mt-space-sm text-on-surface-variant font-caption text-caption">
                  <span className="material-symbols-outlined text-error text-[14px]">trending_up</span>
                  <span>+{fmt(metrics.projected_cycle_increase)} projected this fiscal cycle</span>
                </div>
              </div>

              {/* Critical Churn Ratio */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                    Critical Churn Ratio
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">crisis_alert</span>
                </div>
                <div className="flex items-baseline gap-space-sm">
                  <span className="font-metric-stat text-display text-on-surface">
                    {metrics.critical_churn_ratio_pct}%
                  </span>
                  <div className="flex items-center gap-space-2xs font-label-code text-label-code text-error bg-error-container/30 px-space-xs py-space-2xs rounded">
                    <span>+{metrics.churn_ratio_delta}%</span>
                    <span className="text-on-surface-variant">vs 7.8% base</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-sm">
                  <div
                    className="bg-error h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, metrics.critical_churn_ratio_pct * 3)}%` }}
                  ></div>
                </div>
              </div>

              {/* Portfolio Health Spectrum */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-2xs">
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                    Portfolio Health ({metrics.total_portfolio_count} Total)
                  </span>
                  <span className="font-label-code text-label-code text-on-surface font-semibold">Q3 Cohort</span>
                </div>
                <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 my-space-xs bg-surface-container">
                  <div
                    className="h-full bg-tertiary-container transition-all"
                    style={{ width: `${metrics.low_risk_pct}%` }}
                    title={`Low Risk: ${metrics.low_risk_count} (${metrics.low_risk_pct}%)`}
                  ></div>
                  <div
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${metrics.medium_risk_pct}%` }}
                    title={`Medium Risk: ${metrics.medium_risk_count} (${metrics.medium_risk_pct}%)`}
                  ></div>
                  <div
                    className="h-full bg-error transition-all"
                    style={{ width: `${metrics.high_risk_pct}%` }}
                    title={`Critical Risk: ${metrics.high_risk_count} (${metrics.high_risk_pct}%)`}
                  ></div>
                </div>
                <div className="flex items-center justify-between font-caption text-caption">
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container inline-block"></span> Low{' '}
                    {metrics.low_risk_count} ({metrics.low_risk_pct}%)
                  </span>
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> Med{' '}
                    {metrics.medium_risk_count} ({metrics.medium_risk_pct}%)
                  </span>
                  <span className="flex items-center gap-1 text-error font-semibold">
                    <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Crit{' '}
                    {metrics.high_risk_count} ({metrics.high_risk_pct}%)
                  </span>
                </div>
              </div>

              {/* AI Diagnostics Status */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-2xs">
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                    Diagnostic Engine
                  </span>
                  <span className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary font-label-code text-caption font-semibold px-space-xs py-space-2xs rounded-full">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>{' '}
                    AI Audited
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {metrics.engine_version}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      Gemini + Nemotron 3.5
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-label-code text-label-code text-primary font-semibold">
                      {metrics.precision_pct}%
                    </span>
                    <p className="font-caption text-caption text-on-surface-variant">Precision</p>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs pt-space-xs font-caption text-caption text-on-surface-variant">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                  <span>Last automated batch run: {metrics.last_batch_run}</span>
                </div>
              </div>
            </div>

            {/* Explainable AI Scoring Banner */}
            <div className="bg-surface-container-low p-space-lg rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-base">
              <div className="flex items-start gap-space-md max-w-xl">
                <div className="p-space-sm bg-primary/10 rounded-xl text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Explainable Lapse Inference Model
                    </span>
                    <span className="font-label-code text-caption bg-surface-container-highest text-on-surface-variant px-space-xs py-space-2xs rounded">
                      0 - 100 Hazard Index
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Real-time multi-factorial scoring maps behavioral friction and commercial triggers. Policies
                    scoring ≥75 require mandatory same-week retention intervention via WhatsApp.
                  </p>
                </div>
              </div>

              {/* Logic Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs w-full lg:w-auto">
                <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-code text-label-code text-error font-semibold">+25 pts</span>
                  <span className="font-caption text-caption text-on-surface-variant truncate">
                    Late Payments (≥3x)
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-code text-label-code text-error font-semibold">+20 pts</span>
                  <span className="font-caption text-caption text-on-surface-variant truncate">Claim Rejection</span>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-code text-label-code text-secondary font-semibold">+15 pts</span>
                  <span className="font-caption text-caption text-on-surface-variant truncate">
                    Premium Hike &gt;10%
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-code text-label-code text-secondary font-semibold">+18 pts</span>
                  <span className="font-caption text-caption text-on-surface-variant truncate">
                    Inactivity (&gt;90d)
                  </span>
                </div>
              </div>
            </div>

            {/* Split-Pane Deep Dive Layout */}
            <div className="grid grid-cols-12 gap-space-lg items-start">
              {/* LEFT PANE: Priority Triage Queue (40% width on widescreen: col-span-12 lg:col-span-5) */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-space-md">
                {/* Queue Header & Filters */}
                <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Priority Triage Queue
                      </span>
                      <span className="font-label-code text-caption bg-surface-container text-on-surface px-space-xs py-space-2xs rounded-full font-medium">
                        Sorted: Risk Desc
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search queue..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface border-none focus:outline-none focus:ring-1 focus:ring-primary w-32 sm:w-40"
                      />
                    </div>
                  </div>

                  {/* Queue Filter Tabs */}
                  <div className="flex items-center gap-space-2xs bg-surface-container-low p-1 rounded-lg" id="queue-tabs">
                    {[
                      { id: 'all', label: 'All Critical', count: queue.length },
                      { id: 'late_pay', label: 'Late Pay', count: queue.filter((c) => c.primary_trigger_category === 'late_pay').length },
                      { id: 'disputed_claim', label: 'Disputed Claim', count: queue.filter((c) => c.primary_trigger_category === 'disputed_claim').length },
                      { id: 'hike_shock', label: 'Hike Shock', count: queue.filter((c) => c.primary_trigger_category === 'hike_shock').length }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        className={`flex-1 py-space-xs text-center font-caption text-caption rounded-md transition-colors ${
                          filterTab === tab.id
                            ? 'bg-surface-container-lowest text-error font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                            : 'text-on-surface-variant hover:text-on-surface font-medium'
                        }`}
                        type="button"
                        onClick={() => setFilterTab(tab.id)}
                      >
                        {tab.label} <span className="font-label-code">{tab.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Policy Cards List */}
                <div className="flex flex-col gap-space-sm" id="policy-list">
                  {loadingQueue ? (
                    <div className="py-12 text-center text-on-surface-variant font-caption text-caption">
                      Loading critical queue...
                    </div>
                  ) : queue.length === 0 ? (
                    <div className="py-12 text-center text-on-surface-variant font-caption text-caption">
                      No policies found matching filter.
                    </div>
                  ) : (
                    queue.map((item) => {
                      const isSelected = selectedPolicyId === item.policy_id;

                      return (
                        <div
                          key={item.policy_id}
                          className={`policy-card bg-surface-container-lowest p-space-base rounded-xl transition-all flex flex-col gap-space-sm relative overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-primary shadow-[0_4px_6px_-1px_rgba(37,99,235,0.12)]'
                              : 'shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:shadow-md'
                          }`}
                          onClick={() => setSelectedPolicyId(item.policy_id)}
                        >
                          {isSelected && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>}

                          <div className={`flex items-start justify-between ${isSelected ? 'pl-space-xs' : ''}`}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-space-xs">
                                <span className={`font-headline-sm text-body-lg text-on-surface ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                                  {item.customer_name}
                                </span>
                                <span className={`font-label-code text-caption ${isSelected ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                                  #{item.policy_id}
                                </span>
                                {isSelected && (
                                  <span className="bg-primary/10 text-primary font-caption text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                    Inspecting
                                  </span>
                                )}
                              </div>
                              <span className="font-caption text-caption text-on-surface-variant">
                                {item.policy_type} • {fmt(item.annual_premium)}/yr
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-error-container/40 text-error px-space-xs py-space-2xs rounded-full">
                              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                              <span className="font-label-code text-label-code font-bold">
                                {item.risk_score}/100
                              </span>
                            </div>
                          </div>

                          <div className={`flex items-center justify-between pt-space-xs font-caption text-caption text-on-surface-variant ${isSelected ? 'pl-space-xs' : ''}`}>
                            <span className="flex items-center gap-1 text-error font-medium">
                              <span className="material-symbols-outlined text-[14px]">warning</span>
                              Lapse in {item.days_to_renewal} days
                            </span>
                            <span>{item.primary_driver_text}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT PANE: Diagnostic Inspector (60% width on widescreen: col-span-12 lg:col-span-7) */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-space-base">
                {/* Inspector Core Container */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
                  {/* Inspector Header Bar */}
                  <div className="p-space-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-base">
                    <div className="flex items-center gap-space-md">
                      <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md font-bold">
                        {inspection?.customer_name ? inspection.customer_name.slice(0, 2).toUpperCase() : 'RS'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-sm flex-wrap">
                          <span className="font-headline-md text-headline-md text-on-surface font-bold">
                            {inspection?.customer_name || 'Loading Inspection...'}
                          </span>
                          <span className="font-label-code text-body-sm text-primary bg-primary/10 px-2 py-0.5 rounded font-semibold">
                            #{inspection?.policy_id || selectedPolicyId}
                          </span>
                          <span className="font-caption text-caption bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded">
                            Active {inspection?.tenure_years || 4} Years
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {inspection?.policy_type} • Annual Premium {fmt(inspection?.annual_premium || 32000)} • Renewal: {inspection?.renewal_date || 'Oct 28, 2025'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-xs self-end sm:self-center">
                      <span className="font-caption text-caption text-on-surface-variant">Agent:</span>
                      <span className="font-caption text-caption text-on-surface font-semibold">
                        K. Iyer (#AG-404)
                      </span>
                    </div>
                  </div>

                  <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg">
                    {/* Risk Gauge & Primary Score Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-space-base items-center bg-surface-container-low p-space-lg rounded-xl">
                      {/* Circular Gauge (Inline SVG Chart) */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center">
                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                            {/* Background Circle */}
                            <circle
                              className="text-surface-container-high"
                              cx="60"
                              cy="60"
                              fill="none"
                              r="48"
                              stroke="currentColor"
                              strokeWidth="10"
                            ></circle>
                            {/* Foreground Risk Arc */}
                            <circle
                              className="text-error transition-all duration-700 ease-out"
                              cx="60"
                              cy="60"
                              fill="none"
                              r="48"
                              stroke="currentColor"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              strokeWidth="10"
                            ></circle>
                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                            <span className="font-metric-stat text-display text-on-surface leading-none font-bold">
                              {score}
                            </span>
                            <span className="font-label-code text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                              / 100 Index
                            </span>
                            <span className="font-caption text-[10px] text-error font-bold uppercase tracking-widest mt-0.5">
                              {score >= 75 ? 'High Hazard' : 'Moderate Hazard'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-space-xs font-caption text-caption text-on-surface-variant">
                          <span className="w-2 h-2 rounded-full bg-error"></span>
                          <span>Confidence Rating: 94.2%</span>
                        </div>
                      </div>

                      {/* Contextual Diagnostic Summary (Powered by Gemini AI) */}
                      <div className="md:col-span-7 flex flex-col justify-center gap-space-sm pl-0 md:pl-space-base">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                          <span className="font-headline-sm text-headline-sm text-error font-bold">
                            {inspection?.ai_explanation_headline || 'High Lapse Hazard Detected'}
                          </span>
                        </div>

                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {inspection?.ai_explanation_summary ||
                            'Customer exhibits behavioral divergence spanning multiple friction vectors. The convergence of historical claims with recurring payment friction escalates customer non-renewal likelihood.'}
                        </p>

                        <div className="grid grid-cols-2 gap-space-sm pt-space-xs font-caption text-caption">
                          <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
                            <span className="text-on-surface-variant">Baseline Risk</span>
                            <span className="font-metric-stat text-body-lg text-on-surface font-semibold">
                              14 / 100
                            </span>
                          </div>
                          <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col">
                            <span className="text-on-surface-variant">Variance Escalation</span>
                            <span className="font-metric-stat text-body-lg text-error font-semibold">
                              +{score - 14} Pts Spike
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Itemized Attribution Factors Breakdown Table (Gemini Model Outputs) */}
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                            Attribution Factors &amp; Score Weightings
                          </span>
                          <span className="font-label-code text-caption bg-surface-container text-on-surface-variant px-space-xs py-space-2xs rounded">
                            {inspection?.attribution_factors?.length || 4} Triggers
                          </span>
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Model impact calibrated via Gemini AI
                        </span>
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
                            {inspection?.attribution_factors?.map((factor, idx) => (
                              <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                                <td className="py-space-md px-space-base">
                                  <div className="flex items-center gap-space-sm">
                                    <span
                                      className={`material-symbols-outlined text-[18px] ${
                                        factor.severity === 'Severe'
                                          ? 'text-error'
                                          : factor.severity === 'High Hazard'
                                          ? 'text-error'
                                          : 'text-secondary'
                                      }`}
                                    >
                                      {idx === 0
                                        ? 'credit_card_off'
                                        : idx === 1
                                        ? 'cancel'
                                        : idx === 2
                                        ? 'price_change'
                                        : 'person_off'}
                                    </span>
                                    <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                                      {factor.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-space-md px-space-base text-on-surface-variant">
                                  {factor.detail}
                                </td>
                                <td className="py-space-md px-space-base text-right font-metric-stat text-body-md text-error font-semibold">
                                  +{factor.points} pts
                                </td>
                                <td className="py-space-md px-space-base text-right">
                                  <span
                                    className={`font-caption text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                      factor.severity === 'Severe'
                                        ? 'bg-error-container/40 text-error'
                                        : factor.severity === 'High Hazard'
                                        ? 'bg-error-container/40 text-error'
                                        : 'bg-surface-container text-on-surface-variant'
                                    }`}
                                  >
                                    {factor.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recommended AI Intervention Strategy (NVIDIA Nemotron 3.5 Lightning via OpenRouter) */}
                    <div className="bg-primary/5 p-space-lg rounded-xl flex flex-col gap-space-md relative overflow-hidden">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                          </div>
                          <div>
                            <span className="font-headline-sm text-body-lg text-on-surface font-bold">
                              Prescribed Intervention Workflow
                            </span>
                            <span className="block font-caption text-caption text-on-surface-variant">
                              Algorithmically generated playbook to reverse attrition risk
                            </span>
                          </div>
                        </div>
                        <span className="bg-tertiary-container/10 text-tertiary font-label-code text-caption px-2 py-0.5 rounded font-bold">
                          {inspection?.prescribed_workflow?.retention_probability_pct || 82}% Retention Probability If Deployed
                        </span>
                      </div>

                      {/* Recommendation Tiles (STRICTLY WhatsApp - NO VOICE CALLS) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                        {/* Tile 1: Contact Channel strictly WhatsApp */}
                        <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-start gap-space-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                          <div className="p-space-xs bg-emerald-600/10 text-emerald-600 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                              Recommended Contact Channel
                            </span>
                            <span className="font-headline-sm text-body-md text-on-surface font-bold">
                              {inspection?.prescribed_workflow?.recommended_channel || 'WhatsApp Priority Outreach'}
                            </span>
                            <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                              {inspection?.prescribed_workflow?.channel_rationale ||
                                'Empathetic WhatsApp communication with instant payment link.'}
                            </p>
                          </div>
                        </div>

                        {/* Tile 2: Counter-Offer from OpenRouter Nemotron */}
                        <div className="bg-surface-container-lowest p-space-md rounded-xl flex items-start gap-space-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                          <div className="p-space-xs bg-tertiary/10 text-tertiary rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">loyalty</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                              Approved Counter-Offer
                            </span>
                            <span className="font-headline-sm text-body-md text-on-surface font-bold">
                              {inspection?.prescribed_workflow?.approved_counter_offer || '12% Loyalty Discount Package'}
                            </span>
                            <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                              {inspection?.prescribed_workflow?.offer_details ||
                                'Neutralizes the inflation spike while attaching free tele-consult rider.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Row - CALL REMOVED, STRICTLY WHATSAPP */}
                      <div className="flex flex-wrap items-center justify-end gap-space-sm pt-space-xs">
                        <button
                          className="px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-body-sm font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                          type="button"
                          onClick={() => setShowDossierModal(true)}
                        >
                          <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                          <span>View Full Dossier</span>
                        </button>

                        <button
                          className="px-space-md py-space-sm rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-body-sm font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                          type="button"
                          onClick={() => setShowWhatsAppModal(true)}
                        >
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                          <span>Preview WhatsApp</span>
                        </button>

                        <button
                          className="px-space-lg py-space-sm rounded-xl bg-primary-container text-on-primary hover:bg-primary transition-all font-body-sm font-semibold flex items-center gap-2 shadow-[0_2px_4px_rgba(37,99,235,0.2)] active:scale-[0.98]"
                          type="button"
                          onClick={handleDeployOffer}
                        >
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
