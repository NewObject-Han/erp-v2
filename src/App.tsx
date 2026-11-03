import { Routes, Route } from 'react-router-dom';
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

/**
 * 应用根路由
 *
 * T03 阶段：补全布局路由 + 工作台
 * T05 阶段：补全全部业务模块路由
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
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
    </Routes>
  );
}
