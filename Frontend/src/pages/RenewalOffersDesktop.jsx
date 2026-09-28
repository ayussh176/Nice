import React, { useState } from 'react';
import DesktopLayout from '../components/DesktopLayout';

const AVAILABLE_OFFERS = [
  {
    id: 'loyalty_12',
    category: 'loyalty',
    ruleBadge: 'Rule-01 Applied',
    title: 'Loyalty Discount: 12% off + Free Family Health Checkup',
    description: 'Addresses price sensitivity while leveraging strong multi-year relationship record.',
    boostPct: 34,
    boostLabel: '+34% Boost',
    badge: 'Popular',
    badgeColor: 'bg-primary/10 text-primary'
  },
  {
    id: 'loyalty_15',
    category: 'loyalty',
    ruleBadge: 'Rule-01-EXP',
    title: 'Executive Loyalty Lock: 15% Waiver + Annual Health Pass',
    description: 'Maximum loyalty concession with complimentary diagnostics package for all family members.',
    boostPct: 42,
    boostLabel: '+42% Boost',
    badge: 'High Impact',
    badgeColor: 'bg-tertiary/10 text-tertiary'
  },
  {
    id: 'installment_3',
    category: 'installment',
    ruleBadge: 'Rule-02 Applied',
    title: 'Installment Payment: 3-Part Zero-Interest Split',
    description: 'Smooths out short-term liquidity bottlenecks with automated e-mandate scheduling.',
    boostPct: 41,
    boostLabel: '+41% Boost',
    badge: 'Liquidity Ease',
    badgeColor: 'bg-secondary/10 text-secondary'
  },
  {
    id: 'installment_monthly',
    category: 'installment',
    ruleBadge: 'Rule-02-FLEX',
    title: 'Flexible Monthly Auto-Pay: 6 Micro-Installments',
    description: 'Converts annual lump sum into automated UPI monthly debits with zero surcharge.',
    boostPct: 45,
    boostLabel: '+45% Boost',
    badge: 'Best Conversion',
    badgeColor: 'bg-tertiary/10 text-tertiary'
  },
  {
    id: 'ncb_50',
    category: 'ncb',
    ruleBadge: 'Rule-03 Applied',
    title: 'No-Claim Bonus Protection (NCB Booster 50%)',
    description: 'Shields accumulated NCB discount tier from forfeiture in minor diagnostic incidents.',
    boostPct: 18,
    boostLabel: '+18% Boost',
    badge: 'Zero-Claim Patrons',
    badgeColor: 'bg-primary/10 text-primary'
  },
  {
    id: 'ncb_100',
    category: 'ncb',
    ruleBadge: 'Rule-03-GOLD',
    title: 'NCB Sovereign Armor: 100% Shield + Hospitalization Cash',
    description: 'Guarantees full NCB preservation irrespective of claims plus ₹1,000/day hospital daily cash.',
    boostPct: 28,
    boostLabel: '+28% Boost',
    badge: 'Comprehensive',
    badgeColor: 'bg-secondary/10 text-secondary'
  },
  {
    id: 'coverage_rider',
    category: 'coverage',
    ruleBadge: 'Rule-04 Applied',
    title: 'Premium Reduction: Adjust Rider Coverage (-8% Net)',
    description: 'Removes redundant accidental dismemberment rider, countering annual premium shock.',
    boostPct: 29,
    boostLabel: '+29% Boost',
    badge: 'Cost Optimizer',
    badgeColor: 'bg-error-container text-on-error-container'
  },
  {
    id: 'price_freeze_2y',
    category: 'coverage',
    ruleBadge: 'Rule-05 Applied',
    title: 'Guaranteed 2-Year Premium Freeze Lock',
    description: 'Guarantees zero premium escalation for 24 months regardless of age bracket transitions.',
    boostPct: 38,
    boostLabel: '+38% Boost',
    badge: 'Inflation Shield',
    badgeColor: 'bg-primary/10 text-primary'
  }
];

const INITIAL_CARDS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    policyId: '#HS-90412',
    plan: 'Health Shield Comprehensive • 5 Yrs Tenure',
    icon: 'health_and_safety',
    riskScore: 78,
    riskLabel: 'Risk: 78',
    riskClass: 'bg-error-container text-on-error-container',
    category: 'loyalty',
    ruleBadge: 'Rule-01 Applied',
    offerTitle: 'Loyalty Discount: 12% off + Free Family Health Checkup',
    offerDesc: 'Addresses price sensitivity while leveraging strong 5-year relationship record.',
    baseProb: 45,
    projectedProb: 79,
    boost: '+34% Boost',
    status: 'pending' // pending | accepted | declined
  },
  {
    id: 2,
    name: 'Sunita Rao',
    policyId: '#MC-88120',
    plan: 'Motor Comprehensive • 4 Late Payments',
    icon: 'directions_car',
    riskScore: 88,
    riskLabel: 'Risk: 88',
    riskClass: 'bg-error-container text-on-error-container',
    category: 'installment',
    ruleBadge: 'Rule-02 Applied',
    offerTitle: 'Installment Payment: 3-Part Zero-Interest Split',
    offerDesc: 'Smooths out short-term liquidity bottlenecks with automated e-mandate scheduling.',
    baseProb: 32,
    projectedProb: 73,
    boost: '+41% Boost',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Dr. Arvind Joshi',
    policyId: '#HS-11204',
    plan: 'Health Super Policy • 0 Claims Recorded',
    icon: 'verified',
    riskScore: 22,
    riskLabel: 'Risk: 22 Low',
    riskClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    category: 'ncb',
    ruleBadge: 'Rule-03 Applied',
    offerTitle: 'No-Claim Bonus Protection (NCB Booster 50%)',
    offerDesc: 'Shields accumulated NCB discount tier from forfeiture in minor diagnostic incidents.',
    baseProb: 78,
    projectedProb: 96,
    boost: '+18% Boost',
    status: 'pending'
  },
  {
    id: 4,
    name: 'Deepa Nair',
    policyId: '#TL-77390',
    plan: 'Term Life Secure • +18% Rate Hike Triggered',
    icon: 'favorite',
    riskScore: 65,
    riskLabel: 'Risk: 65',
    riskClass: 'bg-error-container text-on-error-container',
    category: 'coverage',
    ruleBadge: 'Rule-04 Applied',
    offerTitle: 'Premium Reduction: Adjust Rider Coverage (-8% Net)',
    offerDesc: 'Removes redundant accidental dismemberment rider, countering premium shock.',
    baseProb: 51,
    projectedProb: 80,
    boost: '+29% Boost',
    status: 'pending'
  }
];

export default function RenewalOffersDesktop() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [activeCategory, setActiveCategory] = useState('all');

  // Change Offer Modal State
  const [editingCard, setEditingCard] = useState(null);
  const [selectedOfferOption, setSelectedOfferOption] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    title: '',
    message: ''
  });

  const showToast = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleOpenChangeOfferModal = (card) => {
    setEditingCard(card);
    // Find currently matching offer or default to the first one in same category
    const current = AVAILABLE_OFFERS.find(o => o.title === card.offerTitle) || AVAILABLE_OFFERS[0];
    setSelectedOfferOption(current);
  };

  const handleApplyOfferChange = () => {
    if (!editingCard || !selectedOfferOption) return;

    setCards(prevCards =>
      prevCards.map(c => {
        if (c.id === editingCard.id) {
          const newProjected = Math.min(99, c.baseProb + selectedOfferOption.boostPct);
          return {
            ...c,
            offerTitle: selectedOfferOption.title,
            offerDesc: selectedOfferOption.description,
            ruleBadge: selectedOfferOption.ruleBadge,
            category: selectedOfferOption.category,
            boost: selectedOfferOption.boostLabel,
            projectedProb: newProjected
          };
        }
        return c;
      })
    );

    showToast(
      'Offer Updated Successfully',
      `Applied '${selectedOfferOption.title}' to ${editingCard.name} (${editingCard.policyId})`
    );

    setEditingCard(null);
    setSelectedOfferOption(null);
  };

  const handleAcceptOffer = (card) => {
    setCards(prevCards =>
      prevCards.map(c => (c.id === card.id ? { ...c, status: 'accepted' } : c))
    );
    showToast(
      'Offer Dispatched via WhatsApp',
      `Offer '${card.offerTitle}' successfully dispatched to ${card.name} via WhatsApp priority channel.`
    );
  };

  const handleDeclineOffer = (card) => {
    setCards(prevCards =>
      prevCards.map(c => (c.id === card.id ? { ...c, status: 'declined' } : c))
    );
    showToast(
      'Offer Declined',
      `Policy #${card.policyId} marked for manual retention review in underwriting inbox.`
    );
  };

  const handleBatchAccept = () => {
    setCards(prevCards =>
      prevCards.map(c => (c.status === 'pending' ? { ...c, status: 'accepted' } : c))
    );
    showToast(
      'Batch Processing Triggered',
      'Dispatched 200 tailored retention offers across active WhatsApp and digital connectors.'
    );
  };

  const filteredCards = cards.filter(card => {
    if (activeCategory === 'all') return true;
    return card.category === activeCategory;
  });

  return (
    <DesktopLayout activePath="/renewal-offers">
      <main className="w-full pt-16 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg w-full max-w-7xl mx-auto">
            {/* Top Retention Engine Operational Header */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md z-10">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <span className="font-caption text-caption text-primary font-semibold tracking-wider uppercase">
                      Algorithmic Underwriting Node
                    </span>
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
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Smart Retention Recommendation Engine
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                    Real-time heuristic evaluation paired with predictive tenure models. Automated counter-offers target high-lapse segments prior to scheduled renewal drop-offs.
                  </p>
                </div>
                <div className="flex items-center gap-space-sm self-start lg:self-center shrink-0">
                  <button
                    onClick={handleBatchAccept}
                    className="h-10 px-space-lg rounded-xl bg-primary-container text-on-primary font-body-md font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    <span>Batch Accept (200)</span>
                  </button>
                  <button
                    onClick={() => showToast('Engine Config', 'Heuristic rules are synced with underwriting parameters.')}
                    className="h-10 px-space-md rounded-xl bg-surface-container text-on-surface font-body-md flex items-center gap-space-xs hover:bg-surface-container-high transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span className="hidden sm:inline">Engine Config</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-space-md pt-space-xs flex-wrap">
                <div className="flex items-center gap-space-xs overflow-x-auto pb-1 max-w-full">
                  {[
                    { id: 'all', label: 'All Offers', count: 200 },
                    { id: 'loyalty', label: 'Loyalty Discount', count: 68 },
                    { id: 'installment', label: 'Installment Plan', count: 45 },
                    { id: 'ncb', label: 'NCB Booster', count: 52 },
                    { id: 'coverage', label: 'Coverage Adjustment', count: 35 }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-space-md py-1.5 rounded-full font-caption text-caption font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                        activeCategory === tab.id
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full font-label-code text-[10px] ${
                        activeCategory === tab.id ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-space-sm text-on-surface-variant font-caption text-caption">
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  <span>
                    Last automated sync: <span className="font-label-code text-on-surface font-medium">Just now</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Visual Rule Automation Logic Matrix */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between flex-wrap gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Active Heuristic Rule Matrix
                  </h2>
                </div>
                <div className="flex items-center gap-space-xs font-label-code text-caption text-on-surface-variant">
                  <span>Execution Latency: <strong className="text-tertiary-container">14ms</strong></span>
                  <span className="inline-block w-1 h-1 rounded-full bg-outline"></span>
                  <span>Intervention Threshold: ≥ 40 Risk Score</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {/* Rule 1 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-caption text-primary font-semibold">RULE-01</span>
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[10px] font-semibold">
                        High Risk
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                        Trigger Condition
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">
                        Risk Score &gt; 70 &amp; Tenure ≥ 5 yrs
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
                    <span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      Loyalty Discount: 12% off + Free Health Checkup
                    </span>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-caption text-primary font-semibold">RULE-02</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-code text-[10px] font-semibold">
                        Friction Point
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                        Trigger Condition
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">
                        ≥ 2 Late Payments + Cash Friction
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
                    <span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      Installment Plan: 3-Part 0% Interest Split
                    </span>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-caption text-primary font-semibold">RULE-03</span>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-code text-[10px] font-semibold">
                        Retention Boost
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                        Trigger Condition
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">
                        Zero Claims Recorded + Low Risk
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
                    <span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      NCB Protection Booster (50% Shield)
                    </span>
                  </div>
                </div>

                {/* Rule 4 */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-caption text-primary font-semibold">RULE-04</span>
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-code text-[10px] font-semibold">
                        Rate Sensitivity
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                        Trigger Condition
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">
                        Premium Shock (&gt; 15% annual hike)
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 shadow-sm">
                    <span className="font-caption text-caption text-tertiary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> Prescribed Counter-Offer
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      Rider Optimization (-8% Premium Net)
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Policy Intervention Ledger / Offer Cards Grid */}
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Prescribed Interventions
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Recommended actions requiring underwriter validation or automated queue dispatch
                  </p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-caption text-caption text-on-surface-variant">
                    Showing <strong className="text-on-surface font-label-code">{filteredCards.length}</strong> critical priorities
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
                {filteredCards.map(card => {
                  const isAccepted = card.status === 'accepted';
                  const isDeclined = card.status === 'declined';

                  return (
                    <div
                      key={card.id}
                      className={`policy-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all p-space-lg flex flex-col justify-between gap-space-md border border-surface-container ${
                        isDeclined ? 'opacity-40 grayscale pointer-events-none' : ''
                      }`}
                    >
                      <div className="flex flex-col gap-space-md">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-space-sm">
                          <div className="flex items-center gap-space-md">
                            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-primary text-[24px]">
                                {card.icon}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-space-xs">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                                  {card.name}
                                </h3>
                                <span className="font-label-code text-caption px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface-variant">
                                  {card.policyId}
                                </span>
                              </div>
                              <span className="font-caption text-caption text-on-surface-variant">
                                {card.plan}
                              </span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-space-xs py-1 rounded-full shrink-0 ${card.riskClass}`}>
                            <span className="material-symbols-outlined text-[16px]">warning</span>
                            <span className="font-label-code text-caption font-semibold">{card.riskLabel}</span>
                          </div>
                        </div>

                        {/* AI Recommendation Highlight Banner */}
                        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs border-l-4 border-l-primary">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-space-xs">
                              <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                              <span className="font-caption text-caption text-primary font-semibold uppercase">
                                AI Recommended Offer
                              </span>
                            </div>
                            <span className="font-label-code text-[11px] text-on-surface-variant font-medium bg-surface-container-highest px-2 py-0.5 rounded">
                              {card.ruleBadge}
                            </span>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface font-semibold">
                            {card.offerTitle}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {card.offerDesc}
                          </p>
                        </div>

                        {/* Retention Projection Progress Comparison */}
                        <div className="bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm">
                          <div className="flex items-center justify-between font-caption text-caption">
                            <span className="text-on-surface-variant">Base Retention Probability</span>
                            <span className="font-label-code text-on-surface font-semibold">{card.baseProb}%</span>
                          </div>
                          <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden flex">
                            <div className="bg-outline h-full" style={{ width: `${card.baseProb}%` }}></div>
                          </div>
                          <div className="flex items-center justify-between font-caption text-caption pt-1">
                            <span className="text-tertiary-container font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">trending_up</span> Projected with Offer
                            </span>
                            <div className="flex items-center gap-space-xs">
                              <span className="font-metric-stat text-body-md text-tertiary-container font-bold">
                                {card.projectedProb}%
                              </span>
                              <span className="font-label-code text-caption px-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
                                {card.boost}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden flex">
                            <div
                              className="bg-tertiary-container h-full transition-all duration-500"
                              style={{ width: `${card.projectedProb}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                        {isAccepted ? (
                          <div className="flex items-center gap-2 text-tertiary font-body-sm font-semibold py-1">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            <span>Offer Dispatched via WhatsApp</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleDeclineOffer(card)}
                              className="px-space-md h-9 rounded-xl bg-surface-container text-on-surface font-caption text-caption font-semibold hover:bg-surface-container-high transition-colors"
                              type="button"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleOpenChangeOfferModal(card)}
                              className="px-space-md h-9 rounded-xl bg-primary/10 text-primary font-caption text-caption font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1 shadow-sm"
                              type="button"
                              title="Click to select or modify retention offer"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                              <span>Change Offer</span>
                            </button>
                            <button
                              onClick={() => handleAcceptOffer(card)}
                              className="px-space-lg h-9 rounded-xl bg-primary-container text-on-primary font-caption text-caption font-semibold flex items-center gap-space-xs shadow-sm hover:opacity-95 active:scale-95 transition-all"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">send</span>
                              <span>Accept Offer</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Audit Trace & Queue Status Metric Sub-Bar */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-space-md flex-wrap">
                <span className="flex items-center gap-1 font-caption text-caption">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container">verified</span>
                  Multi-Agent Consensus: <strong>Active</strong>
                </span>
                <span className="flex items-center gap-1 font-caption text-caption">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">chat</span>
                  Delivery Channel: <strong>WhatsApp Priority Outreach</strong>
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="font-caption text-caption text-on-surface-variant">
                  Auto-dispatch queue: <strong className="text-on-surface font-label-code">196 pending</strong>
                </span>
                <button 
                  onClick={() => showToast('Pipeline Sync', 'All 196 queued renewal offers verified with actuarial engine.')}
                  className="text-primary font-caption text-caption font-semibold hover:underline" 
                  type="button"
                >
                  View Pipeline Log →
                </button>
              </div>
            </section>
          </div>

          {/* CHANGE OFFER INTERACTIVE MODAL */}
          {editingCard && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-space-lg bg-surface-container-low border-b border-surface-container flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">swap_horiz</span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Change Retention Offer
                      </h2>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                      Target Policyholder: <strong className="text-on-surface font-medium">{editingCard.name}</strong> ({editingCard.policyId}) • Risk Score: {editingCard.riskScore}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingCard(null)}
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Modal Body: Offer Selection Catalog */}
                <div className="p-space-lg overflow-y-auto flex flex-col gap-space-sm max-h-[60vh]">
                  <div className="text-caption font-caption text-on-surface-variant mb-1">
                    Select an optimized counter-offer from the actuarial underwriting catalog:
                  </div>

                  {AVAILABLE_OFFERS.map(offer => {
                    const isSelected = selectedOfferOption?.id === offer.id;
                    const isCurrent = offer.title === editingCard.offerTitle;

                    return (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedOfferOption(offer)}
                        className={`p-space-md rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary'
                            : 'bg-surface-container-low hover:bg-surface-container border-surface-container'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-primary bg-primary' : 'border-outline'
                            }`}>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                            </div>
                            <span className="font-body-md text-body-md font-semibold text-on-surface">
                              {offer.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCurrent && (
                              <span className="font-caption text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                                Current Active
                              </span>
                            )}
                            <span className="font-label-code text-[11px] font-bold text-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded">
                              {offer.boostLabel}
                            </span>
                          </div>
                        </div>

                        <p className="font-body-sm text-body-sm text-on-surface-variant pl-7">
                          {offer.description}
                        </p>

                        <div className="flex items-center gap-2 pl-7 pt-0.5 text-caption font-caption">
                          <span className="font-label-code text-[10px] text-outline font-medium">
                            {offer.ruleBadge}
                          </span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${offer.badgeColor}`}>
                            {offer.badge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modal Footer */}
                <div className="p-space-md bg-surface-container-low border-t border-surface-container flex items-center justify-between gap-space-sm">
                  <div className="flex flex-col">
                    <span className="font-caption text-caption text-on-surface-variant">Projected Retention Rate:</span>
                    <strong className="font-headline-sm text-body-md text-tertiary-container font-bold">
                      {selectedOfferOption ? Math.min(99, editingCard.baseProb + selectedOfferOption.boostPct) : editingCard.projectedProb}%
                      {' '}
                      <span className="text-caption font-normal text-on-surface-variant">
                        ({selectedOfferOption ? selectedOfferOption.boostLabel : editingCard.boost})
                      </span>
                    </strong>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      onClick={() => setEditingCard(null)}
                      className="px-space-md h-10 rounded-xl bg-surface-container text-on-surface font-body-sm font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyOfferChange}
                      className="px-space-lg h-10 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all shadow-sm flex items-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      <span>Apply Selected Offer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Simulation Toast Notification */}
          <aside
            className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
              toast.show ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
            }`}
            id="toastNotification"
          >
            <div className="bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-xl flex items-center gap-space-md max-w-md pointer-events-auto">
              <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary text-[18px]">chat</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-body-sm text-inverse-on-surface font-semibold" id="toastTitle">
                  {toast.title}
                </span>
                <span className="font-caption text-caption text-inverse-on-surface/80" id="toastMessage">
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                className="ml-auto text-inverse-on-surface/60 hover:text-inverse-on-surface p-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </DesktopLayout>
  );
}
