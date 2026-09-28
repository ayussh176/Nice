import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ activePath }) {
  const location = useLocation();
  const currentPath = activePath || location.pathname;

  const navItems = [
    {
      path: '/',
      label: 'Overview',
      icon: 'grid_view'
    },
    {
      path: '/portfolio-renewals',
      label: 'Portfolio & Renewals',
      icon: 'inventory_2'
    },
    {
      path: '/lapse-risk-analysis',
      label: 'Lapse Risk Analysis',
      icon: 'warning'
    },
    {
      path: '/renewal-offers',
      label: 'Renewal Offers',
      icon: 'local_offer'
    },
    {
      path: '/smart-reminders',
      label: 'Smart Reminders',
      icon: 'schedule_send'
    },
    {
      path: '/customer-details',
      label: 'Customer Details',
      icon: 'contacts'
    }
    
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-base flex items-center gap-space-sm bg-surface-container-lowest">
          <img
            alt="Brand logo. - Primary color: #2563eb - Font: manrope - Mode: light - Roundness: rounded-sm"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Vl9azc3tREBsI2NDlROJUht5acO_yrIw6J7Kj7afG11mitgEeVx6Fx0wCP67xofn5PzOnnqPHFdptx4ECgu95D63zc4urRubixZArHWE_X97JcV_u_YISLoK62BWs7BYIDG7e5QFV-ZPD89WCQfl0dOc6q1l0TpOJuQo1NFJlc6Rc81M6AZ6eavao8nGMbk11ZIuoD-knEBV99CmS7dxSzIp8FRvtP1cxq9_6Nu9p7B9s4HVcA0R3J8s_8"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
              InsureRenew
            </span>
            <span className="font-caption text-caption text-on-surface-variant leading-tight">
              Retention &amp; Risk Console
            </span>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="px-space-base py-space-sm">
          <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">
                verified_user
              </span>
              <span className="font-caption text-caption text-on-surface font-semibold">
                Underwriting Live
              </span>
            </div>
            <span className="font-label-code text-label-code text-tertiary-container bg-surface-container-lowest px-space-xs py-space-2xs rounded-lg font-bold">
              AA-Tier
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          className="flex flex-col gap-space-xs px-space-base mt-space-sm"
          data-active-classes="bg-primary-container text-on-primary font-semibold shadow-[0_1px_4px_rgba(37,99,235,0.2)]"
        >
          {navItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path === '/' && (currentPath === '' || currentPath === '/overview-retention-dashboard')) ||
              (item.path === '/database' && currentPath === '/data');

            return (
              <React.Fragment key={item.path}>
                {item.isDatabase && (
                  <div className="my-2 border-t border-surface-container-high" />
                )}
                <Link
                  to={item.path}
                  className={`flex items-center gap-space-md px-space-md py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-[0_1px_4px_rgba(37,99,235,0.2)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Footer Metrics Card */}
      <div className="p-space-base flex flex-col gap-space-sm bg-surface-container-lowest">
        <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-caption text-caption text-on-surface-variant">
              Target Retention
            </span>
            <span className="font-metric-stat text-metric-stat text-primary">
              94.2%
            </span>
          </div>
          <span className="material-symbols-outlined text-tertiary text-[24px]">
            trending_up
          </span>
        </div>
        <div className="flex items-center justify-between px-space-xs text-on-surface-variant font-caption text-caption">
          <span>Retention Node: v2.4</span>
          <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container"></span>
        </div>
        
        {/* Mobile View Quick Toggle */}
        <Link
          to="/retention-dashboard-mobile"
          className="mt-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-surface-container text-primary font-caption text-[11px] font-medium hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">smartphone</span>
          <span>Switch to Mobile View</span>
        </Link>
      </div>
    </aside>
  );
}
