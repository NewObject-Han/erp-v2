import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import SalesPage from './pages/sales/SalesPage';
import PurchasePage from './pages/purchase/PurchasePage';
import TrackingPage from './pages/tracking/TrackingPage';
import LogisticsPage from './pages/logistics/LogisticsPage';
import WarehousePage from './pages/warehouse/WarehousePage';
import FinancePage from './pages/finance/FinancePage';
import TaxPage from './pages/tax/TaxPage';
import MasterDataPage from './pages/master/MasterDataPage';
import CrmPage from './pages/crm/CrmPage';
import AiCenterPage from './pages/ai/AiCenterPage';
import SystemPage from './pages/system/SystemPage';
import OpenPlatformPage from './pages/open/OpenPlatformPage';
import LoginPage from './pages/login/LoginPage';
import useAuthStore from './stores/useAuthStore';

/** 登录守卫：未登录重定向到 /login */
function RequireAuth({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * 应用根路由
 *
 * /login 登录页独立布局；其余页面需登录后访问。
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="purchase" element={<PurchasePage />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="logistics" element={<LogisticsPage />} />
        <Route path="warehouse" element={<WarehousePage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="tax" element={<TaxPage />} />
        <Route path="master" element={<MasterDataPage />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="ai" element={<AiCenterPage />} />
        <Route path="system" element={<SystemPage />} />
        <Route path="open" element={<OpenPlatformPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
