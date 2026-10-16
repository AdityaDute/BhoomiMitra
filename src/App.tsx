import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { FarmingPlannerPage } from './pages/FarmingPlannerPage';
import { CostTrackerPage } from './pages/CostTrackerPage';
import { SoilJourneyPage } from './pages/SoilJourneyPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/soil-health" element={<SoilHealthPage />} />
        <Route path="/farming-planner" element={<FarmingPlannerPage />} />
        <Route path="/cost-tracker" element={<CostTrackerPage />} />
        <Route path="/soil-journey" element={<SoilJourneyPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
