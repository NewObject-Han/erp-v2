/**
 * 种子数据初始化
 *
 * 首次启动（localStorage 无数据）时，将演示数据写入 localStorage。
 * 每个模块页面都有对应的资源数据，保证 demo 开箱可见。
 */

import { storageRead, storageWrite } from '../../api/client';
import { seedCategories, seedProducts, seedIncoterms, seedCurrencies, seedExchangeRates, seedPriceList, seedWarehouses } from './master';
import { seedCustomers, seedFollowUps, seedOpportunities, seedCustomerCredits, seedSuppliers, seedSupplierQualifications } from './customers';
import { seedInquiries, seedQuotations, seedSampleOrders, seedPiDocs, seedSalesOrders } from './sales';
import { seedPurchaseInquiries, seedPriceCompares, seedPurchaseOrders, seedPoArrivals } from './purchase';
import { seedTrackingOrders, seedTrackingNodes, seedTrackingExceptions } from './tracking';
import { seedBookings, seedCustomsDeclarations, seedDocuments, seedLogisticsTracks } from './logistics';
import {
  seedInventories,
  seedInboundOrders,
  seedOutboundOrders,
  seedTransferOrders,
  seedStocktakeOrders,
  seedStockAlerts,
  seedArInvoices,
  seedApInvoices,
  seedCostAnalyses,
  seedExpenseRecords,
  seedRefundDeclarations,
  seedVatRecords,
  seedFxVerifications,
  seedLcDocs,
  seedUsers,
  seedRoles,
  seedPermissions,
} from './system';

const SEED_MAP: Record<string, unknown[]> = {
  // 主数据
  categories: seedCategories,
  products: seedProducts,
  incoterms: seedIncoterms,
  currencies: seedCurrencies,
  exchangeRates: seedExchangeRates,
  priceLists: seedPriceList,
  warehouses: seedWarehouses,
  // 客户与供应商
  customers: seedCustomers,
  followUps: seedFollowUps,
  opportunities: seedOpportunities,
  customerCredits: seedCustomerCredits,
  suppliers: seedSuppliers,
  supplierQualifications: seedSupplierQualifications,
  // 销售
  inquiries: seedInquiries,
  quotations: seedQuotations,
  sampleOrders: seedSampleOrders,
  piDocs: seedPiDocs,
  salesOrders: seedSalesOrders,
  // 采购
  purchaseInquiries: seedPurchaseInquiries,
  priceCompares: seedPriceCompares,
  purchaseOrders: seedPurchaseOrders,
  poArrivals: seedPoArrivals,
  // 跟单
  trackingOrders: seedTrackingOrders,
  trackingNodes: seedTrackingNodes,
  trackingExceptions: seedTrackingExceptions,
  // 物流
  bookings: seedBookings,
  customsDeclarations: seedCustomsDeclarations,
  documents: seedDocuments,
  logisticsTracks: seedLogisticsTracks,
  // 仓储
  inventories: seedInventories,
  inboundOrders: seedInboundOrders,
  outboundOrders: seedOutboundOrders,
  transferOrders: seedTransferOrders,
  stocktakeOrders: seedStocktakeOrders,
  stockAlerts: seedStockAlerts,
  // 财务
  arInvoices: seedArInvoices,
  apInvoices: seedApInvoices,
  costAnalyses: seedCostAnalyses,
  expenseRecords: seedExpenseRecords,
  // 税务外汇
  refundDeclarations: seedRefundDeclarations,
  vatRecords: seedVatRecords,
  fxVerifications: seedFxVerifications,
  lcDocs: seedLcDocs,
  // 系统
  users: seedUsers,
  roles: seedRoles,
  permissions: seedPermissions,
};

/** 种子数据版本：种子内容变更时递增，强制重新播种（覆盖旧演示数据） */
const SEED_VERSION = '3';

const SEED_VERSION_KEY = 'erp_seed_version';

/** 清空并重新装载全部种子数据 */
export function resetSeedData(): void {
  Object.entries(SEED_MAP).forEach(([resource, data]) => {
    storageWrite(resource, data);
  });
  storageWrite(SEED_VERSION_KEY, [{ id: SEED_VERSION_KEY, value: SEED_VERSION }]);
}

/** 首次启动时装载种子数据（已有数据则跳过，仅补缺失资源） */
export function ensureSeedData(): void {
  const versionRaw = storageRead<{ id: string; value: string }>(SEED_VERSION_KEY);
  const storedVersion = versionRaw?.[0]?.value;
  if (storedVersion !== SEED_VERSION) {
    resetSeedData();
    return;
  }
  Object.entries(SEED_MAP).forEach(([resource, data]) => {
    const existing = storageRead(resource);
    if (existing.length === 0 && data.length > 0) {
      storageWrite(resource, data);
    }
  });
}
