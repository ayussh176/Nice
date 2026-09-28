import React, { useState, useEffect, useCallback } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function DatabaseExplorer() {
  const [activeTab, setActiveTab] = useState('customer_policies');
  const [activeViewMode, setActiveViewMode] = useState('tables'); // 'tables' | 'views' | 'schema'
  const [selectedView, setSelectedView] = useState('policy_model_features');
  
  // Health & Stats State
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Table Data State
  const [tableData, setTableData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected Detail Modal State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // Table Definitions
  const tables = [
    { id: 'policy_products', label: 'Policy Products', icon: 'category', endpoint: '/api/database/policy-products', countKey: 'policy_products', desc: 'Catalog templates (200 products)' },
    { id: 'customers', label: 'Customers', icon: 'groups', endpoint: '/api/database/customers', countKey: 'customers', desc: 'Demographics & tenure (20,000 customers)' },
    { id: 'customer_policies', label: 'Customer Policies', icon: 'receipt_long', endpoint: '/api/database/customer-policies', countKey: 'customer_policies', desc: 'Active contracts & premiums (20,000 records)' },
    { id: 'payment_summary', label: 'Payment Summary', icon: 'payments', endpoint: '/api/database/payment-summary', countKey: 'payment_summary', desc: 'Payment history & on-time rates (20,000 records)' },
    { id: 'claim_summary', label: 'Claim Summary', icon: 'health_and_safety', endpoint: '/api/database/claim-summary', countKey: 'claim_summary', desc: 'Claims frequency & payout sums (20,000 records)' },
    { id: 'risk_scores', label: 'Risk Scores', icon: 'trending_up', endpoint: '/api/database/risk-scores', countKey: 'risk_scores', desc: 'ML lapse-risk predictions' },
    { id: 'renewal_offers', label: 'Renewal Offers', icon: 'local_offer', endpoint: '/api/database/renewal-offers', countKey: 'renewal_offers', desc: 'Personalized discount offers' },
    { id: 'interactions', label: 'Interactions', icon: 'forum', endpoint: '/api/database/interactions', countKey: 'interactions', desc: 'Customer outreach log' },
    { id: 'retention_actions', label: 'Retention Actions', icon: 'task_alt', endpoint: '/api/database/retention-actions', countKey: 'retention_actions', desc: 'Retention agent work items' },
  ];

  const modelViews = [
    { id: 'policy_model_features', label: 'Policy Model Features', desc: 'Unified 20K feature dataset for ML modeling (1 row per contract)' },
    { id: 'lapse_model_inference_data', label: 'Lapse Inference Data', desc: 'Leakage-free dataset for ML model prediction pipeline' },
    { id: 'portfolio_renewals', label: 'Portfolio Renewals View', desc: 'Sorted renewals queue with payment & claim indicators' },
    { id: 'retention_dashboard_summary', label: 'Retention Summary View', desc: 'High-level aggregated metrics across all contracts' },
  ];

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Health & Stats
  const fetchHealthAndStats = async () => {
    try {
      setStatsLoading(true);
      const [healthRes, statsRes] = await Promise.all([
        fetch('/api/database/health').then(r => r.json()).catch(() => null),
        fetch('/api/database/stats').then(r => r.json()).catch(() => null),
      ]);
      setHealth(healthRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndStats();
  }, []);

  // Fetch Table Data
  const fetchTableData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '';
      if (activeViewMode === 'tables') {
        const currentTbl = tables.find(t => t.id === activeTab);
        if (!currentTbl) return;
        url = `${currentTbl.endpoint}?page=${currentPage}&limit=${pageSize}`;
      } else if (activeViewMode === 'views') {
        url = `/api/database/views/${selectedView}?page=${currentPage}&limit=${pageSize}`;
      }

      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      if (sortColumn) {
        url += `&sort=${encodeURIComponent(sortColumn)}&order=${sortOrder}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success) {
        setTableData(data.rows || []);
        setTotalRows(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error(data.error || 'Failed to fetch rows');
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
      setError(err.message);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeViewMode, selectedView, currentPage, pageSize, debouncedSearch, sortColumn, sortOrder]);

  useEffect(() => {
    if (activeViewMode !== 'schema') {
      fetchTableData();
    }
  }, [fetchTableData, activeViewMode]);

  // Handle Sort
  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortColumn(col);
      setSortOrder('ASC');
    }
    setCurrentPage(1);
  };

  // Open Detail Modal
  const handleOpenDetail = async (row) => {
    const id = row.customer_policy_id || row.customer_id;
    if (!id) {
      setSelectedRecord(row);
      return;
    }
    setSelectedRecord(row);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/database/customer-policy-details/${id}`);
      const data = await res.json();
      if (data.success) {
        setDetailData(data.data);
      } else {
        setDetailData(null);
      }
    } catch (err) {
      console.error('Failed to load customer policy details', err);
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Format Helpers
  const formatValue = (key, val) => {
    if (val === null || val === undefined) {
      return <span className="text-outline italic text-xs">NULL</span>;
    }
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> True
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> False
        </span>
      );
    }
    if (key.includes('premium') || key.includes('amount') || key.includes('claim_amount')) {
      const num = Number(val);
      if (!isNaN(num)) {
        return <span className="font-mono font-medium">${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
      }
    }
    if (key.includes('pct') || key.includes('rate')) {
      const num = Number(val);
      if (!isNaN(num)) {
        return <span className="font-mono font-semibold text-primary">{num}%</span>;
      }
    }
    if (key.includes('_id') || key === 'customer_id' || key === 'policy_id') {
      return <span className="font-mono text-xs px-1.5 py-0.5 bg-surface-container rounded text-on-surface font-semibold">{String(val)}</span>;
    }
    if (typeof val === 'object') {
      return <span className="font-mono text-xs text-slate-500 truncate max-w-xs">{JSON.stringify(val)}</span>;
    }
    return String(val);
  };

  const currentColumns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <DesktopLayout activePath="/database">
      <div className="p-space-lg max-w-[1600px] mx-auto space-y-6">
        
        {/* ── Top Header & Connection Banner ─────────────────────── */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-surface-container-high/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-container text-on-primary shadow-[0_1px_4px_rgba(37,99,235,0.2)]">
                  <span className="material-symbols-outlined text-[26px]">database</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface">Database Explorer</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      PostgreSQL 16
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Docker Connected
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Authoritative 20,000 records insurance database with real-time relational query inspector
                  </p>
                </div>
              </div>
            </div>

            {/* Live Diagnostics Pill Box */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-3 text-xs text-on-surface border border-surface-container-high">
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider font-semibold">Database</span>
                  <span className="font-mono font-bold text-primary">{health?.database || 'insurance_retention'}</span>
                </div>
                <div className="h-6 w-px bg-surface-container-high" />
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider font-semibold">Host / Port</span>
                  <span className="font-mono font-bold text-on-surface">{health?.host || 'localhost'}:{health?.port || '5433'}</span>
                </div>
                <div className="h-6 w-px bg-surface-container-high" />
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase tracking-wider font-semibold">Latency</span>
                  <span className="font-mono font-bold text-emerald-600">{health?.latencyMs !== undefined ? `${health.latencyMs} ms` : '—'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  fetchHealthAndStats();
                  fetchTableData();
                }}
                disabled={loading || statsLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm hover:bg-primary/90 transition-all shadow-[0_1px_4px_rgba(37,99,235,0.25)] active:scale-95 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${loading || statsLoading ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>Refresh DB</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 9 Real Table Stat Cards ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">
              PostgreSQL Tables (20,000 Normalized Records)
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">Click any card to inspect table</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
            {tables.map((tbl) => {
              const isSelected = activeViewMode === 'tables' && activeTab === tbl.id;
              const count = stats?.counts?.[tbl.countKey];
              return (
                <button
                  key={tbl.id}
                  onClick={() => {
                    setActiveViewMode('tables');
                    setActiveTab(tbl.id);
                    setCurrentPage(1);
                    setSearchTerm('');
                  }}
                  className={`flex flex-col p-3.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-primary-container/10 border-primary shadow-[0_2px_8px_rgba(37,99,235,0.15)] ring-2 ring-primary/30'
                      : 'bg-surface-container-lowest border-surface-container-high/80 hover:border-primary/50 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {tbl.icon}
                    </span>
                    {count !== undefined && count > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-on-surface truncate w-full">{tbl.label}</span>
                  <div className="mt-1">
                    {statsLoading ? (
                      <div className="h-6 w-12 bg-surface-container-high animate-pulse rounded" />
                    ) : (
                      <span className={`text-lg font-bold font-mono ${count === 0 ? 'text-slate-400' : 'text-on-surface'}`}>
                        {count !== undefined ? count.toLocaleString() : '—'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── View Mode Selector Bar ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface-container-lowest p-2 rounded-2xl border border-surface-container-high/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl">
            <button
              onClick={() => setActiveViewMode('tables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'tables'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Table Explorer</span>
            </button>
            <button
              onClick={() => setActiveViewMode('views')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'views'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_agenda</span>
              <span>ML Model Views</span>
            </button>
            <button
              onClick={() => setActiveViewMode('schema')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === 'schema'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Architecture &amp; ERD</span>
            </button>
          </div>

          {/* Quick Stats on Active Selection */}
          <div className="flex items-center gap-3 px-3">
            <span className="text-xs text-on-surface-variant">
              Active: <strong className="text-on-surface">{activeViewMode === 'tables' ? tables.find(t => t.id === activeTab)?.label : activeViewMode === 'views' ? selectedView : 'Relational Architecture'}</strong>
            </span>
            {activeViewMode !== 'schema' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary font-mono">
                {totalRows.toLocaleString()} rows
              </span>
            )}
          </div>
        </div>

        {/* ── Sub-Selector for Model Views ───────────────────────── */}
        {activeViewMode === 'views' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {modelViews.map((vw) => {
              const isSelected = selectedView === vw.id;
              const count = stats?.viewCounts?.[vw.id];
              return (
                <button
                  key={vw.id}
                  onClick={() => {
                    setSelectedView(vw.id);
                    setCurrentPage(1);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-surface-container-lowest border-surface-container-high hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface font-mono">{vw.id}</span>
                    {count !== undefined && (
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {count.toLocaleString()} rows
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{vw.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Main Content Area: Table / Views / Schema ───────────── */}
        {activeViewMode !== 'schema' ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            
            {/* Table Toolbar */}
            <div className="p-4 border-b border-surface-container-high/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-low/30">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeViewMode === 'tables' ? activeTab : selectedView}...`}
                  className="w-full h-9 pl-9 pr-8 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Rows Per Page & Refresh */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-8 px-2 rounded-lg bg-surface-container-lowest border border-surface-container-high text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <span className="text-xs text-on-surface-variant font-mono">
                  {totalRows > 0 ? (
                    <>
                      Showing <strong className="text-on-surface">{((currentPage - 1) * pageSize) + 1}</strong> - <strong className="text-on-surface">{Math.min(currentPage * pageSize, totalRows)}</strong> of <strong className="text-on-surface">{totalRows.toLocaleString()}</strong>
                    </>
                  ) : (
                    '0 rows'
                  )}
                </span>
              </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto min-h-[400px]">
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-on-surface-variant">Querying PostgreSQL database...</span>
                </div>
              ) : error ? (
                <div className="p-12 text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-error">error</span>
                  <h3 className="text-sm font-bold text-on-surface">Database Query Error</h3>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto">{error}</p>
                  <button
                    onClick={fetchTableData}
                    className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium"
                  >
                    Retry Query
                  </button>
                </div>
              ) : tableData.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto text-outline">
                    <span className="material-symbols-outlined text-2xl">database_off</span>
                  </div>
                  <h3 className="text-sm font-bold text-on-surface">No records found</h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    {searchTerm ? `No rows matched query "${searchTerm}" in this table.` : 'This table currently contains 0 records (e.g. waiting for ML predictions or runtime interactions).'}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/60 border-b border-surface-container-high/80 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      {currentColumns.map((col) => (
                        <th
                          key={col}
                          onClick={() => handleSort(col)}
                          className="py-3 px-4 cursor-pointer hover:bg-surface-container-high/50 select-none transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{col}</span>
                            {sortColumn === col ? (
                              <span className="material-symbols-outlined text-[14px] text-primary">
                                {sortOrder === 'ASC' ? 'arrow_upward' : 'arrow_downward'}
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-[14px] text-outline opacity-40">
                                unfold_more
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/50 text-xs">
                    {tableData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-primary/5 transition-colors cursor-pointer group"
                        onClick={() => handleOpenDetail(row)}
                      >
                        <td className="py-2.5 px-4 text-center font-mono text-outline text-[10px]">
                          {((currentPage - 1) * pageSize) + idx + 1}
                        </td>
                        {currentColumns.map((col) => (
                          <td key={col} className="py-2.5 px-4 whitespace-nowrap text-on-surface">
                            {formatValue(col, row[col])}
                          </td>
                        ))}
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(row);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary font-medium text-[11px] transition-all opacity-80 group-hover:opacity-100 flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-surface-container-high/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low/20">
                <span className="text-xs text-on-surface-variant font-medium">
                  Page <strong className="text-on-surface">{currentPage}</strong> of <strong className="text-on-surface">{totalPages.toLocaleString()}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface disabled:opacity-30 hover:bg-surface-container transition-colors"
                    title="First Page"
                  >
                    <span className="material-symbols-outlined text-[16px]">first_page</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-container-high bg-surface-container-lowest text-xs font-semibold text-on-surface disabled:opacity-30 hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    <span>Prev</span>
                  </button>

                  {/* Direct Jump Input */}
                  <div className="flex items-center gap-1 mx-2 text-xs">
                    <span className="text-on-surface-variant">Go to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                          setCurrentPage(val);
                        }
                      }}
                      className="w-14 h-8 px-2 text-center rounded-lg bg-surface-container-lowest border border-surface-container-high font-mono font-bold text-xs"
                    />
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-container-high bg-surface-container-lowest text-xs font-semibold text-on-surface disabled:opacity-30 hover:bg-surface-container transition-colors"
                  >
                    <span>Next</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface disabled:opacity-30 hover:bg-surface-container transition-colors"
                    title="Last Page"
                  >
                    <span className="material-symbols-outlined text-[16px]">last_page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Architecture & Schema Documentation ───────────────── */
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <h2 className="text-lg font-bold text-on-surface mb-2">Relational Entity-Relationship Diagram (20K Architecture)</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Authoritative schema mapping the 20,000 policy subscription contracts to customer profiles, product catalog templates, payment behavior, claims history, and ML prediction targets.
              </p>

              {/* Visual ASCII / Structured Flow Diagram */}
              <div className="p-6 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <pre>{`
  +-----------------------+                    +------------------------------------+
  |   POLICY_PRODUCTS     |                    |             CUSTOMERS              |
  | (200 Catalog Plans)   |                    |         (20,000 Profiles)          |
  +-----------------------+                    +------------------------------------+
  | PK: policy_id (P001)  |                    | PK: customer_id (CUST000001)       |
  |     policy_name       |                    |     customer_age, gender           |
  |     policy_type       |                    |     occupation, tenure_years       |
  +-----------+-----------+                    +------------------+-----------------+
              |                                                   |
              | 1:N                                               | 1:N
              +-----------------------+  +------------------------+
                                      |  |
                                      v  v
                          +------------------------------------------+
                          |            CUSTOMER_POLICIES             |
                          |      (20,000 Subscription Contracts)     |
                          +------------------------------------------+
                          | PK: customer_policy_id                   |
                          | FK: customer_id    -> CUSTOMERS          |
                          | FK: policy_id      -> POLICY_PRODUCTS    |
                          |     premium_amount, previous_premium     |
                          |     premium_increase_pct, payment_freq   |
                          |     days_to_renewal, policy_status       |
                          +--------------------+---------------------+
                                               |
        +-----------------------+--------------+--------------+-----------------------+
        | 1:1                   | 1:1                         | 1:N                   | 1:N
        v                       v                             v                       v
+-----------------------+ +-----------------------+   +-----------------------+ +-----------------------+
|    PAYMENT_SUMMARY    | |     CLAIM_SUMMARY     |   |      RISK_SCORES      | |    RENEWAL_OFFERS     |
| (20,000 Perf Records) | |  (20,000 Claim Sets)  |   |    (ML Model Out)     | |    (ML Model Out)     |
+-----------------------+ +-----------------------+   +-----------------------+ +-----------------------+
| PK/FK: cp_id          | | PK/FK: cp_id          |   | PK: risk_id           | | PK: offer_id          |
| has_late_payments     | | num_claims_last_year  |   | FK: cp_id             | | FK: cp_id             |
| late_payment_count    | | total_claim_amount    |   | risk_score (0-100)    | | offer_type            |
| avg_days_late         | | rejected_claims       |   | risk_level (H/M/L)    | | discount_percentage   |
| on_time_payment_rate  | | claims_approved       |   | risk_reasons (JSONB)  | | offer_accepted (bool) |
+-----------------------+ +-----------------------+   +-----------------------+ +-----------------------+
`}</pre>
              </div>

              {/* Table Reference Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {tables.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/70 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">{t.icon}</span>
                      <span className="font-bold text-xs text-on-surface font-mono">{t.id}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{t.desc}</p>
                    <div className="text-[11px] font-mono text-primary font-bold">
                      Current Count: {stats?.counts?.[t.countKey]?.toLocaleString() || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Detail Inspector Modal / Drawer ─────────────────────── */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-surface-container-high overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-[22px]">badge</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                      <span>Record Inspector</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {selectedRecord.customer_policy_id ? `CP #${selectedRecord.customer_policy_id}` : selectedRecord.customer_id || selectedRecord.policy_id}
                      </span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Normalized relational record details directly queried from Docker PostgreSQL
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setDetailData(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {detailLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-on-surface-variant">Loading joined relational data...</span>
                  </div>
                ) : detailData ? (
                  <div className="space-y-6">
                    {/* Facet 1: Customer Profile */}
                    <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        <span>CUSTOMER DEMOGRAPHICS</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Customer ID</span>
                          <span className="font-mono font-bold text-on-surface">{detailData.customer_id}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Age / Gender</span>
                          <span className="font-semibold text-on-surface">{detailData.customer_age} yrs • {detailData.customer_gender}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Occupation</span>
                          <span className="font-semibold text-on-surface">{detailData.customer_occupation}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Customer Tenure</span>
                          <span className="font-semibold text-on-surface">{detailData.customer_tenure_years} years</span>
                        </div>
                      </div>
                    </div>

                    {/* Facet 2: Policy & Premium */}
                    <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        <span>POLICY CONTRACT &amp; PREMIUM</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Plan Name</span>
                          <span className="font-bold text-on-surface">{detailData.policy_name}</span>
                          <span className="text-[10px] font-mono text-outline block">{detailData.policy_id}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Policy Type</span>
                          <span className="font-semibold text-on-surface">{detailData.policy_type}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Current Premium</span>
                          <span className="font-mono font-bold text-lg text-primary">${Number(detailData.premium_amount || 0).toLocaleString()}</span>
                          <span className="text-[10px] text-on-surface-variant block">Prev: ${Number(detailData.previous_premium_amount || 0).toLocaleString()} (+{detailData.premium_increase_pct}%)</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] uppercase">Days to Renewal</span>
                          <span className={`inline-block font-bold font-mono px-2 py-0.5 rounded text-xs mt-1 ${detailData.days_to_renewal <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                            {detailData.days_to_renewal} days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Facet 3: Payment & Claims */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Payment */}
                      <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                          <span>PAYMENT PERFORMANCE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-on-surface-variant block text-[10px]">On-Time Rate</span>
                            <span className="font-mono font-bold text-emerald-600 text-base">{detailData.on_time_payment_rate}%</span>
                          </div>
                          <div>
                            <span className="text-on-surface-variant block text-[10px]">Late Payments</span>
                            <span className="font-mono font-bold text-on-surface">{detailData.late_payment_count} ({detailData.avg_days_late} avg days)</span>
                          </div>
                        </div>
                      </div>

                      {/* Claims */}
                      <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                          <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                          <span>CLAIMS HISTORY (LAST YEAR)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-on-surface-variant block text-[10px]">Total Claim Amount</span>
                            <span className="font-mono font-bold text-base text-on-surface">${Number(detailData.total_claim_amount_last_year || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-on-surface-variant block text-[10px]">Claims Status</span>
                            <span className="font-semibold text-on-surface">{detailData.num_claims_last_year} claims ({detailData.claims_approved} approved, {detailData.rejected_claims} rejected)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Raw JSON Record */}
                    <div>
                      <span className="text-xs font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Raw Database Record (JSON)</span>
                      <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-44">
                        {JSON.stringify(detailData, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Raw Database Record (JSON)</span>
                    <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                      {JSON.stringify(selectedRecord, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-surface-container-high bg-surface-container-low/40 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setDetailData(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm"
                >
                  Close Inspector
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DesktopLayout>
  );
}