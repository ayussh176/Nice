import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import RetentionDashboardDesktop from './pages/RetentionDashboardDesktop';
import PortfolioRenewalsDesktop from './pages/PortfolioRenewalsDesktop';
import LapseRiskAnalysisDesktop from './pages/LapseRiskAnalysisDesktop';
import CustomerDetailsDesktop from './pages/CustomerDetailsDesktop';
import SmartRemindersDesktop from './pages/SmartRemindersDesktop';
import RetentionDashboardMobile from './pages/RetentionDashboardMobile';
import RenewalOffersDesktop from './pages/RenewalOffersDesktop';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RetentionDashboardDesktop />} />
      <Route path="/overview-retention-dashboard" element={<RetentionDashboardDesktop />} />
      <Route path="/portfolio-renewals" element={<PortfolioRenewalsDesktop />} />
      <Route path="/lapse-risk-analysis" element={<LapseRiskAnalysisDesktop />} />
      <Route path="/renewal-offers" element={<RenewalOffersDesktop />} />
      <Route path="/smart-reminders" element={<SmartRemindersDesktop />} />
      <Route path="/customer-details" element={<CustomerDetailsDesktop />} />
      <Route path="/retention-dashboard-mobile" element={<RetentionDashboardMobile />} />
      {/* Catch-all redirect to Overview */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
