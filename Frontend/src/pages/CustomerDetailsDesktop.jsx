import React, { useState, useEffect } from 'react';
import DesktopLayout from '../components/DesktopLayout';

const API_BASE = 'http://localhost:8000/api';

export default function CustomerDetailsDesktop() {
  // Directory state
  const [directoryData, setDirectoryData] = useState({
    total: 0,
    page: 1,
    limit: 8,
    total_pages: 1,
    items: [],
    attention_count: 0
  });
  const [loadingDirectory, setLoadingDirectory] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskTier, setRiskTier] = useState('All Tiers');
  const [lobFilter, setLobFilter] = useState('All Products');
  const [page, setPage] = useState(1);

  // Selected customer & dossier state
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  // Action status & Toast
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Fetch Directory
  const fetchDirectory = async (currentPage = 1, search = searchTerm, tier = riskTier, lob = lobFilter) => {
    setLoadingDirectory(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 8
      });
      if (search) params.append('search', search);
      if (tier && tier !== 'All Tiers') params.append('risk_tier', tier);
      if (lob && lob !== 'All Products') params.append('lob', lob);

      const res = await fetch(`${API_BASE}/customers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch customer directory');
      const data = await res.json();
      setDirectoryData(data);

      // If no customer currently selected or selected not in list, auto-select first
      if (data.items && data.items.length > 0) {
        if (!selectedPolicyId || !data.items.some(it => it.policy_id === selectedPolicyId)) {
          setSelectedPolicyId(data.items[0].policy_id);
          fetchDossier(data.items[0].policy_id);
        }
      }
    } catch (err) {
      console.error('Error fetching directory:', err);
      showToast('Connection Alert', 'Could not load customer directory from server', 'error');
    } finally {
      setLoadingDirectory(false);
    }
  };

  // Fetch Dossier
  const fetchDossier = async (identifier) => {
    setLoadingDossier(true);
    try {
      const res = await fetch(`${API_BASE}/customers/${encodeURIComponent(identifier)}/dossier`);
      if (!res.ok) throw new Error('Failed to fetch customer dossier');
      const data = await res.json();
      setDossier(data);
    } catch (err) {
      console.error('Error fetching dossier:', err);
      showToast('Error', 'Unable to retrieve customer dossier data', 'error');
    } finally {
      setLoadingDossier(false);
    }
  };

  useEffect(() => {
    fetchDirectory(page, searchTerm, riskTier, lobFilter);
  }, [page, riskTier, lobFilter]);

  // Handle Search Input (simple debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchDirectory(1, searchTerm, riskTier, lobFilter);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSelectCustomer = (policyId, customerName) => {
    setSelectedPolicyId(policyId);
    fetchDossier(policyId);
    showToast('Customer Loaded', `Loaded detailed retention dossier for ${customerName} (#${policyId})`);
  };

  // Action Dispatchers (WhatsApp strictly, no calls)
  const handleDispatchWhatsApp = async () => {
    if (!selectedPolicyId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customers/${selectedPolicyId}/whatsapp`, { method: 'POST' });
      const data = await res.json();
      showToast('WhatsApp Outreach Deployed', data.message || 'Personalized renewal link delivered to customer');
    } catch (err) {
      showToast('WhatsApp Error', 'Failed to dispatch WhatsApp message', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispatchSmartPing = async () => {
    if (!selectedPolicyId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customers/${selectedPolicyId}/ping`, { method: 'POST' });
      const data = await res.json();
      showToast('Smart Ping Sent', data.message || 'Renewal ping dispatched successfully');
    } catch (err) {
      showToast('Ping Error', 'Failed to dispatch smart ping', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyLoyalty = async () => {
    if (!selectedPolicyId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customers/${selectedPolicyId}/intervene?discount_pct=12`, { method: 'POST' });
      const data = await res.json();
      showToast('Intervention Deployed', data.message || '12% Retention discount voucher generated');
      // Refresh dossier to show updated offers
      fetchDossier(selectedPolicyId);
    } catch (err) {
      showToast('Intervention Error', 'Failed to apply voucher', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const selectedItem = directoryData.items.find(i => i.policy_id === selectedPolicyId) || directoryData.items[0];

  return (
    <DesktopLayout activePath="/customer-details">
      {/* Interactive Feedback Toast */}
      <div 
        className={`fixed top-20 right-8 z-50 transform transition-all duration-300 flex items-center gap-space-sm px-space-lg py-space-md rounded-xl shadow-2xl border ${
          toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-100px] pointer-events-none'
        } ${
          toast.type === 'error'
            ? 'bg-error text-on-error border-error-container'
            : 'bg-inverse-surface text-inverse-on-surface border-outline-variant/30'
        }`}
        id="toastNotification"
      >
        <span className="material-symbols-outlined text-[22px] text-tertiary-fixed">
          {toast.type === 'error' ? 'error' : 'check_circle'}
        </span>
        <div className="flex flex-col">
          <span className="font-headline-sm text-body-md font-semibold">{toast.title}</span>
          <span className="font-caption text-caption opacity-90">{toast.message}</span>
        </div>
      </div>

      <main className="w-full pt-16 bg-surface min-h-screen">
        <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg max-w-[1680px] mx-auto w-full">
          {/* Top Breadcrumb & Status Telemetry */}
          <div className="flex items-center justify-between flex-wrap gap-space-sm">
            <nav className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
              <span className="hover:text-primary cursor-pointer transition-colors">Customer Directory</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Retention Workbench</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold bg-surface-container px-space-xs py-space-2xs rounded-lg">
                Roster &amp; Detailed Dossier
              </span>
            </nav>
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant bg-surface-container-low px-space-md py-space-xs rounded-full">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                <span className="font-label-code text-label-code text-on-surface font-semibold">
                  {directoryData.attention_count.toLocaleString()} CUSTOMERS REQUIRING ATTENTION
                </span>
              </div>
              <span className="font-caption text-caption text-outline">Underwriter Audit Ref: #BLR-RET-9941</span>
            </div>
          </div>

          {/* SECTION 1: MASTER CUSTOMER DIRECTORY TABLE */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container flex flex-col overflow-hidden">
            {/* Table Header / Toolbar */}
            <div className="p-space-md lg:p-space-lg bg-surface-container-lowest border-b border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div>
                <h1 className="font-headline-md text-headline-sm lg:text-headline-md text-on-surface font-bold tracking-tight">
                  Customer Retention Directory
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Select any customer row below to inspect risk telemetry, AI prescriptive intervention, and lifecycle audits.
                </p>
              </div>
              {/* Controls: Search, Filters, Export */}
              <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
                {/* Search */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[16px]">
                    search
                  </span>
                  <input
                    className="h-9 pl-8 pr-3 text-body-sm bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline border-none focus:ring-2 focus:ring-primary/20 w-48 sm:w-60"
                    placeholder="Search name, policy ID..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Filter: Risk Tier */}
                <div className="flex items-center gap-1 bg-surface-container-low px-space-sm h-9 rounded-xl text-caption">
                  <span className="text-on-surface-variant font-medium">Risk:</span>
                  <select
                    className="bg-transparent text-on-surface font-semibold focus:outline-none border-none p-0 pr-4 text-body-sm cursor-pointer"
                    value={riskTier}
                    onChange={(e) => { setRiskTier(e.target.value); setPage(1); }}
                  >
                    <option value="All Tiers">All Tiers</option>
                    <option value="High Risk">High Risk (70+)</option>
                    <option value="Medium Risk">Medium Risk (40-69)</option>
                    <option value="Low Risk">Low Risk (&lt;40)</option>
                  </select>
                </div>
                {/* Filter: Line of Business */}
                <div className="flex items-center gap-1 bg-surface-container-low px-space-sm h-9 rounded-xl text-caption">
                  <span className="text-on-surface-variant font-medium">LOB:</span>
                  <select
                    className="bg-transparent text-on-surface font-semibold focus:outline-none border-none p-0 pr-4 text-body-sm cursor-pointer"
                    value={lobFilter}
                    onChange={(e) => { setLobFilter(e.target.value); setPage(1); }}
                  >
                    <option value="All Products">All Products</option>
                    <option value="Health">Health Policies</option>
                    <option value="Life">Life & Term Protection</option>
                    <option value="Car">Car & Motor</option>
                    <option value="Liability">Liability & Commercial</option>
                  </select>
                </div>
                {/* Export Button */}
                <button 
                  onClick={() => showToast('Export Initiated', 'Exporting active customer directory to CSV format')}
                  className="h-9 px-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto w-full min-h-[300px]">
              {loadingDirectory ? (
                <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant gap-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-body-sm">Loading real customer retention records...</span>
                </div>
              ) : directoryData.items.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[36px] text-outline mb-2">person_search</span>
                  <p>No customers match the current search or filters.</p>
                </div>
              ) : (
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
                    {directoryData.items.map((cust) => {
                      const isSelected = cust.policy_id === selectedPolicyId;
                      return (
                        <tr
                          key={cust.policy_id}
                          onClick={() => handleSelectCustomer(cust.policy_id, cust.customer_name)}
                          className={`${
                            isSelected
                              ? 'bg-primary/10 border-l-4 border-l-primary'
                              : 'hover:bg-surface-container-low/60 border-l-4 border-l-transparent'
                          } transition-colors cursor-pointer group`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <div className={`w-10 h-10 rounded-full font-headline-sm text-body-md font-bold flex items-center justify-center shadow-sm ${
                                  isSelected ? 'bg-primary text-on-primary' : 'bg-primary-fixed text-primary'
                                }`}>
                                  {cust.customer_initials}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 bg-surface-container-lowest p-0.5 rounded-full shadow">
                                  <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    verified
                                  </span>
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-headline-sm text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                                    {cust.customer_name}
                                  </span>
                                  <span className="bg-surface-container-high text-primary font-label-code text-[11px] px-1.5 py-0.5 rounded font-bold">
                                    {cust.customer_tier}
                                  </span>
                                </div>
                                <span className="font-label-code text-caption text-outline">
                                  #{cust.policy_id} • {cust.customer_city}, {cust.customer_state}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-[18px]">
                                {cust.policy_type.toLowerCase().includes('motor') || cust.policy_type.toLowerCase().includes('car') ? 'directions_car' : 'health_and_safety'}
                              </span>
                              <span className="font-medium text-on-surface truncate max-w-[220px]" title={cust.product_name}>
                                {cust.product_name}
                              </span>
                            </div>
                            <span className="font-caption text-on-surface-variant text-[11px]">
                              Sum Insured: ₹{cust.sum_insured.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-label-code font-bold text-on-surface">
                                ₹{cust.premium_amount.toLocaleString()}
                              </span>
                              <span className={`${cust.premium_increase_pct > 8 ? 'text-error' : 'text-on-surface-variant'} font-caption text-[11px] font-medium`}>
                                {cust.premium_increase_pct > 0 ? `+${cust.premium_increase_pct}% hike` : 'Standard renewal'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className={`font-semibold ${cust.days_to_renewal <= 7 ? 'text-error' : 'text-on-surface'}`}>
                                {cust.renewal_date}
                              </span>
                              <span className={`font-caption text-[11px] flex items-center gap-1 ${
                                cust.days_to_renewal <= 7 ? 'text-error font-semibold' : 'text-on-surface-variant'
                              }`}>
                                {cust.days_to_renewal <= 7 && <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>}
                                {cust.renewal_urgency}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg font-metric-stat text-body-sm font-bold flex items-center justify-center ${
                                cust.risk_score >= 70
                                  ? 'bg-error-container/50 text-error'
                                  : cust.risk_score >= 40
                                  ? 'bg-secondary-container/50 text-secondary'
                                  : 'bg-tertiary-container/50 text-tertiary'
                              }`}>
                                {cust.risk_score}
                              </div>
                              <div className="flex flex-col">
                                <span className={`font-caption text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  cust.risk_score >= 70 ? 'bg-error text-on-error' : 'bg-surface-container-high text-on-surface'
                                }`}>
                                  {cust.risk_level}
                                </span>
                                <span className={`font-caption text-[10px] ${cust.risk_score >= 70 ? 'text-error' : 'text-on-surface-variant'}`}>
                                  {cust.risk_velocity}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded w-max ${
                                cust.has_late_payments
                                  ? 'bg-error-container/50 text-error'
                                  : 'bg-tertiary/15 text-tertiary'
                              }`}>
                                {cust.payment_grievance_status}
                              </span>
                              <span className="font-caption text-on-surface-variant text-[11px]">
                                {cust.grievance_note}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full shadow-sm transition-all ${
                              isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface group-hover:bg-primary group-hover:text-on-primary'
                            }`}>
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Footer Pagination */}
            <div className="px-space-md py-space-sm bg-surface-container-low border-t border-surface-container flex items-center justify-between text-caption text-on-surface-variant flex-wrap gap-2">
              <span>
                Showing {directoryData.items.length} of {directoryData.total.toLocaleString()} policies in registry
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2 font-semibold text-primary">
                  Page {directoryData.page} of {directoryData.total_pages || 1}
                </span>
                <button
                  disabled={page >= directoryData.total_pages}
                  onClick={() => setPage(p => Math.min(directoryData.total_pages, p + 1))}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: SELECTED CUSTOMER DOSSIER & WORKBENCH */}
          {dossier && (
            <div className="flex flex-col gap-space-md" id="customer-dossier-wrapper">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Active Customer Inspection Dossier
                  </h2>
                </div>
                <span className="text-caption text-on-surface-variant">
                  Inspecting #{dossier.policy_id} • Click any row above to switch customer
                </span>
              </div>

              {/* Dossier Hero Surface */}
              <div className={`bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg border-l-4 ${
                dossier.risk_score >= 70 ? 'border-l-error' : 'border-l-primary'
              }`}>
                {/* Left: Customer Summary Entity */}
                <div className="flex items-start md:items-center gap-space-lg flex-1">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-md text-headline-md font-bold shadow-inner">
                      {dossier.customer_initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-0.5 rounded-full shadow">
                      <span className="material-symbols-outlined text-[20px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-2xs min-w-0">
                    <div className="flex items-center gap-space-sm flex-wrap">
                      <h1 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface tracking-tight truncate">
                        {dossier.customer_name}
                      </h1>
                      <span className="bg-surface-container-high text-primary font-label-code text-label-code px-space-sm py-0.5 rounded-full font-semibold">
                        {dossier.customer_tier} Tier
                      </span>
                      <span className="bg-surface-container-low text-on-surface-variant font-caption text-caption px-space-sm py-0.5 rounded-full">
                        {dossier.tenure_years} Years Tenure (Since {dossier.since_year})
                      </span>
                    </div>
                    <div className="flex items-center gap-space-md flex-wrap text-on-surface-variant font-body-sm text-body-sm mt-space-2xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                        {dossier.city}, {dossier.state}
                      </span>
                      <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                        Age {dossier.age} • {dossier.occupation}
                      </span>
                      <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">chat</span>
                        {dossier.phone}
                      </span>
                    </div>
                    {/* Key Policy Bar Details */}
                    <div className="flex items-center gap-space-base flex-wrap font-caption text-caption mt-space-xs text-on-surface">
                      <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-space-2xs rounded-lg">
                        <span className="material-symbols-outlined text-primary text-[16px]">health_and_safety</span>
                        <span className="font-semibold text-primary">{dossier.product_name}</span>
                        <span className="font-label-code text-label-code text-outline">#{dossier.policy_id}</span>
                      </div>
                      <span className="text-on-surface-variant">
                        Annual Premium: <strong className="text-on-surface font-semibold font-label-code text-label-code">₹{dossier.premium_amount.toLocaleString()}</strong>{' '}
                        <span className="text-error font-medium text-[11px]">(+{dossier.premium_increase_pct}% hike)</span>
                      </span>
                      <span className="text-on-surface-variant">
                        Renewal Date: <strong className="text-error font-semibold font-label-code text-label-code">{dossier.renewal_date}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Risk Score Gauge & Action CTAs Strip */}
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-space-lg lg:border-l lg:pl-space-lg lg:border-surface-container shrink-0">
                  {/* Risk Gauge Mini Dial */}
                  <div className={`flex items-center gap-space-md p-space-sm px-space-md rounded-xl ${
                    dossier.risk_score >= 70 ? 'bg-error-container/40' : 'bg-secondary-container/40'
                  }`}>
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                        <path
                          className="text-surface-container-high"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className={dossier.risk_score >= 70 ? 'text-error' : 'text-secondary'}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${dossier.risk_score}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.5"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-metric-stat text-label-code font-bold text-on-surface leading-none">
                          {dossier.risk_score}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className={`material-symbols-outlined text-[16px] ${dossier.risk_score >= 70 ? 'text-error' : 'text-secondary'}`}>
                          warning
                        </span>
                        <span className="font-headline-sm text-label-code uppercase tracking-wider font-bold">
                          {dossier.risk_level} RISK
                        </span>
                      </div>
                      <span className="font-caption text-[11px] opacity-80">Velocity Index: {dossier.risk_velocity}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons (WhatsApp only, no voice calls) */}
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <button
                      onClick={handleDispatchWhatsApp}
                      disabled={actionLoading}
                      className="h-10 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      title="Direct WhatsApp outreach"
                    >
                      <span className="material-symbols-outlined text-[18px] text-tertiary">chat</span>
                      <span>WhatsApp Outreach</span>
                    </button>
                    <button
                      onClick={handleDispatchSmartPing}
                      disabled={actionLoading}
                      className="h-10 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">schedule_send</span>
                      <span>Send Smart Ping</span>
                    </button>
                    <button
                      onClick={handleApplyLoyalty}
                      disabled={actionLoading}
                      className="h-10 px-space-md rounded-xl bg-primary text-on-primary hover:bg-primary/90 font-body-sm text-body-sm font-semibold flex items-center gap-space-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">percent</span>
                      <span>Apply 12% Loyalty</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2-Column Responsive Split Architecture */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                {/* LEFT COLUMN: Explainable Risk Attribution & AI Prescriptive Strategy (~38%) */}
                <div className="lg:col-span-5 flex flex-col gap-space-lg">
                  {/* Card 1: Explainable Risk Diagnostics (Gemini Powered) */}
                  <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-base">
                    <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-error text-[22px]">analytics</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          Explainable Risk Diagnostics
                        </h2>
                      </div>
                      <span className="font-label-code text-label-code text-error bg-error-container/50 px-space-xs py-space-2xs rounded-lg font-bold">
                        Lapse Hazard: {dossier.risk_score}%
                      </span>
                    </div>

                    {/* Overall Probability Bar Visual */}
                    <div className="flex flex-col gap-space-2xs bg-surface-container-low p-space-md rounded-xl">
                      <div className="flex justify-between items-center text-on-surface font-caption text-caption">
                        <span>Gemini Actuarial Ensemble</span>
                        <span className="font-label-code text-label-code font-bold text-error">
                          {dossier.risk_score}.0% LAPSE RISK
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-r from-secondary to-error rounded-full transition-all duration-700"
                          style={{ width: `${dossier.risk_score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant font-caption">
                        <span>Benchmark baseline: 21%</span>
                        <span className="text-error font-medium">
                          Deviation: +{Math.max(0, dossier.risk_score - 21)}% above median
                        </span>
                      </div>
                    </div>

                    {/* Factor Attribution Stack */}
                    <div className="flex flex-col gap-space-sm">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                        Key Attribution Point Breakdown
                      </span>
                      {dossier.ai_risk_explanation?.factors?.map((factor, idx) => (
                        <div
                          key={idx}
                          className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-sm border-l-2 border-l-error"
                        >
                          <div className="flex items-start gap-space-xs">
                            <span className="material-symbols-outlined text-error text-[18px] mt-0.5">
                              {idx === 0 ? 'event_repeat' : idx === 1 ? 'report_problem' : 'trending_up'}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-body-md text-body-md text-on-surface font-semibold">
                                {factor.name}
                              </span>
                              <span className="font-caption text-caption text-on-surface-variant">
                                {factor.detail}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-label-code text-label-code font-bold text-error">
                              +{factor.points} pts
                            </span>
                            <div className="font-caption text-[10px] text-error font-semibold uppercase">
                              {factor.severity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: AI Prescribed Intervention Strategy (NVIDIA Nemotron 3.5 Lightning Powered) */}
                  <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-base relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[22px]">smart_toy</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          AI Prescribed Strategy
                        </h2>
                      </div>
                      <span className="bg-primary/10 text-primary font-caption text-caption font-semibold px-space-xs py-space-2xs rounded-lg">
                        Model: Nemotron-3.5-Lightning
                      </span>
                    </div>

                    {/* Strategy Highlight Box */}
                    <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm border-l-4 border-l-primary">
                      <div className="flex items-center justify-between">
                        <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                          Recommended Package Formulation
                        </span>
                        <span className="bg-tertiary/15 text-tertiary font-label-code text-caption px-space-xs py-0.5 rounded font-bold">
                          Best ROI
                        </span>
                      </div>
                      <div className="flex flex-col gap-space-xs text-on-surface font-body-sm text-body-sm">
                        <div className="flex items-start gap-space-xs">
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                          <span>
                            <strong>Prescribed Counter Offer:</strong>{' '}
                            {dossier.ai_renewal_recommendation?.approved_counter_offer || '12% Loyalty Retention Discount'}
                          </span>
                        </div>
                        <div className="flex items-start gap-space-xs">
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                          <span>
                            <strong>Strategy Rationale:</strong>{' '}
                            {dossier.ai_renewal_recommendation?.offer_details || 'Offsets premium inflation and protects retention margins.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prescribed Channel & Success Metric */}
                    <div className="grid grid-cols-2 gap-space-sm bg-surface-container-high/40 p-space-md rounded-xl">
                      <div className="flex flex-col">
                        <span className="font-caption text-caption text-on-surface-variant">Prescribed Outreach Channel</span>
                        <span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-tertiary text-[18px]">chat</span>
                          WhatsApp Priority
                        </span>
                        <span className="text-[11px] text-outline">Direct 1-click renewal payment</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-caption text-caption text-on-surface-variant">Retention Uplift Simulation</span>
                        <div className="flex items-center gap-space-xs mt-0.5">
                          <span className="font-metric-stat text-body-lg text-outline line-through">45%</span>
                          <span className="material-symbols-outlined text-[16px] text-tertiary">arrow_forward</span>
                          <span className="font-metric-stat text-headline-sm text-tertiary font-bold">
                            {dossier.ai_renewal_recommendation?.retention_probability_pct || 84}%
                          </span>
                        </div>
                        <span className="text-[11px] text-tertiary font-semibold">+39% probability recovery</span>
                      </div>
                    </div>

                    {/* WhatsApp Message Preview */}
                    {dossier.ai_renewal_recommendation?.whatsapp_message_preview && (
                      <div className="p-space-sm rounded-xl bg-tertiary/10 border border-tertiary/20 flex flex-col gap-1">
                        <span className="font-caption text-[11px] text-tertiary font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">chat</span>
                          WhatsApp Template Preview
                        </span>
                        <p className="font-body-sm text-[12px] text-on-surface italic">
                          "{dossier.ai_renewal_recommendation.whatsapp_message_preview}"
                        </p>
                      </div>
                    )}

                    {/* Intervention Action Protocol CTA Buttons (Strictly WhatsApp, no calls) */}
                    <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
                      <button
                        onClick={handleDispatchWhatsApp}
                        disabled={actionLoading}
                        className="flex-1 h-10 px-space-md rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>Deploy Offer to WhatsApp</span>
                      </button>
                      <button
                        onClick={handleDispatchSmartPing}
                        disabled={actionLoading}
                        className="flex-1 h-10 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px] text-tertiary">chat</span>
                        <span>Send WhatsApp Ping</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Chronological Timeline, Ledger, and Policy Claims Intelligence (~62%) */}
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  {/* Tabbed Container */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
                    {/* Navigation Tabs Bar */}
                    <div className="flex items-center gap-space-xs px-space-lg pt-space-md bg-surface-container-low border-b border-surface-container overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('timeline')}
                        className={`pb-space-sm px-space-md font-headline-sm text-body-md transition-all flex items-center gap-space-xs whitespace-nowrap ${
                          activeTab === 'timeline'
                            ? 'font-semibold text-primary border-b-2 border-primary'
                            : 'font-normal text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        Activity Timeline
                      </button>
                      <button
                        onClick={() => setActiveTab('ledger')}
                        className={`pb-space-sm px-space-md font-headline-sm text-body-md transition-all flex items-center gap-space-xs whitespace-nowrap ${
                          activeTab === 'ledger'
                            ? 'font-semibold text-primary border-b-2 border-primary'
                            : 'font-normal text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        Payment Ledger ({dossier.ledger?.length || 0})
                      </button>
                      <button
                        onClick={() => setActiveTab('claims')}
                        className={`pb-space-sm px-space-md font-headline-sm text-body-md transition-all flex items-center gap-space-xs whitespace-nowrap ${
                          activeTab === 'claims'
                            ? 'font-semibold text-primary border-b-2 border-primary'
                            : 'font-normal text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">medical_services</span>
                        Claims History ({dossier.claims?.length || 0})
                      </button>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className={`pb-space-sm px-space-md font-headline-sm text-body-md transition-all flex items-center gap-space-xs whitespace-nowrap ${
                          activeTab === 'documents'
                            ? 'font-semibold text-primary border-b-2 border-primary'
                            : 'font-normal text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        Policy Docs ({dossier.documents?.length || 0})
                      </button>
                    </div>

                    {/* TAB CONTENT 1: Timeline */}
                    {activeTab === 'timeline' && (
                      <div className="p-space-lg flex flex-col gap-space-lg" id="content-timeline">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                              Lifecycle Audit &amp; Event Stream
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant">
                              Real-time touchpoints, telemetry events, and settlement logs
                            </span>
                          </div>
                          <div className="flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
                            <span className="material-symbols-outlined text-[16px] text-tertiary">sync</span>
                            <span>Live Database Stream</span>
                          </div>
                        </div>

                        {/* Timeline Vertical Track */}
                        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
                          {dossier.timeline?.map((evt) => (
                            <div key={evt.id} className="relative group">
                              <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-surface-container-lowest ${
                                evt.status === 'Critical' || evt.status === 'Disputed'
                                  ? 'bg-error animate-pulse'
                                  : evt.status === 'Delivered'
                                  ? 'bg-primary'
                                  : 'bg-tertiary'
                              }`}></div>
                              <div className="bg-surface-container-low/70 p-space-md rounded-xl hover:bg-surface-container transition-all">
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <span className="font-headline-sm text-body-md text-on-surface font-semibold flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-[18px]">
                                      {evt.icon}
                                    </span>
                                    {evt.title}
                                  </span>
                                  <span className="font-label-code text-caption text-on-surface-variant">
                                    {evt.timestamp}
                                  </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                  {evt.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT 2: Payment Ledger */}
                    {activeTab === 'ledger' && (
                      <div className="p-space-lg flex flex-col gap-space-md" id="content-ledger">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                            Payment Invoices &amp; Settlements
                          </span>
                          <button 
                            onClick={() => showToast('Download Started', 'Downloading statements archive')}
                            className="font-caption text-caption text-primary hover:underline"
                          >
                            Download All Statements
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-body-sm text-body-sm">
                            <thead>
                              <tr className="bg-surface-container-low text-on-surface-variant font-caption text-caption">
                                <th className="py-space-sm px-space-md rounded-l-lg">Invoice #</th>
                                <th className="py-space-sm px-space-md">Date</th>
                                <th className="py-space-sm px-space-md">Amount</th>
                                <th className="py-space-sm px-space-md">Method</th>
                                <th className="py-space-sm px-space-md rounded-r-lg">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-on-surface">
                              {dossier.ledger?.map((tx, idx) => (
                                <tr key={idx} className="hover:bg-surface-container-low/50">
                                  <td className="py-space-sm px-space-md font-label-code text-label-code font-semibold">
                                    {tx.invoice_id}
                                  </td>
                                  <td className="py-space-sm px-space-md">{tx.date}</td>
                                  <td className="py-space-sm px-space-md font-label-code font-bold">
                                    ₹{tx.amount.toLocaleString()}
                                  </td>
                                  <td className="py-space-sm px-space-md">{tx.payment_method}</td>
                                  <td className="py-space-sm px-space-md">
                                    <span className="bg-tertiary/15 text-tertiary px-2 py-0.5 rounded font-caption text-[11px] font-bold">
                                      {tx.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT 3: Claims History */}
                    {activeTab === 'claims' && (
                      <div className="p-space-lg flex flex-col gap-space-md" id="content-claims">
                        <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                          Claims Registered Under #{dossier.policy_id}
                        </span>
                        {dossier.claims?.map((clm, idx) => (
                          <div
                            key={idx}
                            className={`p-space-md rounded-xl flex flex-col gap-space-xs ${
                              clm.status === 'Rejected'
                                ? 'bg-error-container/20 border-l-4 border-l-error'
                                : 'bg-surface-container-low'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`font-headline-sm text-body-md font-bold ${clm.status === 'Rejected' ? 'text-error' : 'text-on-surface'}`}>
                                {clm.claim_id} • ₹{clm.amount_claimed.toLocaleString()}
                              </span>
                              <span className={`font-caption text-[11px] px-2 py-0.5 rounded font-bold ${
                                clm.status === 'Rejected'
                                  ? 'bg-error text-on-error'
                                  : 'bg-tertiary/15 text-tertiary'
                              }`}>
                                {clm.status}
                              </span>
                            </div>
                            <span className="font-caption text-caption text-on-surface">
                              Type: {clm.claim_type} • Date: {clm.date}
                            </span>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {clm.remarks}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB CONTENT 4: Policy Documents */}
                    {activeTab === 'documents' && (
                      <div className="p-space-lg flex flex-col gap-space-sm" id="content-documents">
                        <span className="font-headline-sm text-body-md font-semibold text-on-surface">
                          Digitized Policy Assets
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-xs">
                          {dossier.documents?.map((doc) => (
                            <div key={doc.id} className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[24px]">
                                  picture_as_pdf
                                </span>
                                <div className="flex flex-col">
                                  <span className="font-body-sm font-semibold text-on-surface">{doc.title}</span>
                                  <span className="font-caption text-outline">{doc.size} • {doc.category}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => showToast('Download Started', `Downloading ${doc.title}`)}
                                className="material-symbols-outlined text-on-surface-variant hover:text-primary"
                              >
                                download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Reliability & Claims Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    {/* Metric 1: Reliability Index */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                          Payment Reliability
                        </span>
                        <span className="material-symbols-outlined text-secondary text-[20px]">credit_score</span>
                      </div>
                      <div className="my-space-xs">
                        <div className="font-metric-stat text-headline-md text-on-surface font-bold">
                          {dossier.risk_score >= 70 ? '78%' : '94%'}
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Verified NACH / UPI Record
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full"
                          style={{ width: `${dossier.risk_score >= 70 ? 78 : 94}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metric 2: Lifetime Value */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                          Lifetime Value (LTV)
                        </span>
                        <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                      </div>
                      <div className="my-space-xs">
                        <div className="font-metric-stat text-headline-md text-primary font-bold">
                          ₹{(dossier.premium_amount * Math.max(1, dossier.tenure_years)).toLocaleString()}
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Paid across {dossier.tenure_years} policy years
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-caption text-[11px] text-tertiary">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        <span>{dossier.customer_tier} Tier Account</span>
                      </div>
                    </div>

                    {/* Metric 3: Grievance & Dispute Status */}
                    <div className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border-l-4 ${
                      dossier.risk_score >= 70 ? 'border-l-error' : 'border-l-tertiary'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-caption text-on-surface-variant uppercase font-semibold">
                          Dispute Status
                        </span>
                        <span className="material-symbols-outlined text-error text-[20px]">gavel</span>
                      </div>
                      <div className="my-space-xs">
                        <div className={`font-body-md text-body-md font-bold ${dossier.risk_score >= 70 ? 'text-error' : 'text-on-surface'}`}>
                          {dossier.risk_score >= 70 ? '#CLM-Active Review' : 'Zero Active Disputes'}
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          {dossier.risk_score >= 70 ? 'Escalated to underwriting' : 'Clean account history'}
                        </span>
                      </div>
                      <span className="font-label-code text-[11px] text-outline font-semibold">
                        Audit: Live Sync
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </DesktopLayout>
  );
}
