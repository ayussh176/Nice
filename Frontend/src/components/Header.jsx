import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-lg flex items-center justify-between">
      <div className="flex items-center gap-space-base flex-1 max-w-xl">
        <img
          alt="Brand logo. - Primary color: #2563eb - Font: manrope - Mode: light - Roundness: rounded-sm"
          className="h-8 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida/AEtjO1Vl9azc3tREBsI2NDlROJUht5acO_yrIw6J7Kj7afG11mitgEeVx6Fx0wCP67xofn5PzOnnqPHFdptx4ECgu95D63zc4urRubixZArHWE_X97JcV_u_YISLoK62BWs7BYIDG7e5QFV-ZPD89WCQfl0dOc6q1l0TpOJuQo1NFJlc6Rc81M6AZ6eavao8nGMbk11ZIuoD-knEBV99CmS7dxSzIp8FRvtP1cxq9_6Nu9p7B9s4HVcA0R3J8s_8"
        />
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full h-10 pl-10 pr-space-base rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
            placeholder="Search policy ID, customer name, VIN, or agent code..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="hidden lg:flex items-center gap-space-xs bg-surface-container-lowest px-space-md h-10 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            calendar_today
          </span>
          <span className="font-caption text-caption text-on-surface font-medium">
            Q3 Fiscal Cycle (Oct - Dec)
          </span>
          <span className="material-symbols-outlined text-outline text-[16px]">
            expand_more
          </span>
        </div>
        <button
          className="relative p-space-sm rounded-xl bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]"
          type="button"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-code text-[10px] font-bold">
            5
          </span>
        </button>
        <div className="flex items-center gap-space-md pl-space-xs">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-headline-sm text-body-md text-on-surface font-semibold leading-tight">
              Elena Rostova
            </span>
            <span className="font-caption text-caption text-on-surface-variant leading-tight">
              Chief Retention Officer
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
