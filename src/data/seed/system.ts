/**
 * 种子数据补充：仓储 / 财务 / 税务外汇 / 系统
 */

import type {
  Inventory,
  InboundOrder,
  OutboundOrder,
  TransferOrder,
  StocktakeOrder,
  StockAlert,
  ARInvoice,
  APInvoice,
  CostAnalysis,
  ExpenseRecord,
  RefundDeclaration,
  VATRecord,
  FxVerification,
  LcDoc,
  User,
  Role,
  Permission,
} from '../../types';

const NOW = '2026-11-01T08:00:00.000Z';
const base = (id: string) => ({ id, createdAt: NOW, updatedAt: NOW });

// ===== 仓储 =====
export const seedInventories: Inventory[] = [
  { ...base('inv1'), productId: 'p_led_panel', warehouseId: 'wh_finished', onHand: 3200, onOrder: 1000, allocated: 500, safetyStock: 1000, unitCost: 12.5, currency: 'CNY', batchNo: 'B20261101', lastUpdated: '2026-11-01' },
  { ...base('inv2'), productId: 'p_led_bulb', warehouseId: 'wh_finished', onHand: 850, onOrder: 0, allocated: 300, safetyStock: 1000, unitCost: 45.0, currency: 'CNY', batchNo: 'B20261101', lastUpdated: '2026-11-01' },
  { ...base('inv3'), productId: 'p_power_supply', warehouseId: 'wh_pending', onHand: 120, onOrder: 2000, allocated: 0, safetyStock: 500, unitCost: 88.0, currency: 'CNY', batchNo: 'B20261028', lastUpdated: '2026-10-28' },
  { ...base('inv4'), productId: 'p_cable', warehouseId: 'wh_finished', onHand: 5600, onOrder: 0, allocated: 800, safetyStock: 2000, unitCost: 6.8, currency: 'CNY', batchNo: 'B20261025', lastUpdated: '2026-10-25' },
];

export const seedInboundOrders: InboundOrder[] = [
  { ...base('ib1'), code: 'IB20261101', poId: 'po_1', warehouseId: 'wh_finished', items: [{ productId: 'p_led_panel', productName: 'LED 面板灯 36W', quantity: 3000, unitCost: 28.5, batchNo: 'B20261101', unit: 'pcs' }, { productId: 'p_led_bulb', productName: 'LED 球泡灯 9W', quantity: 2000, unitCost: 4.5, batchNo: 'B20261101', unit: 'pcs' }], status: 'completed', inboundDate: '2026-11-01', operator: '王仓管', remark: 'PO-2026-001 到货入库' },
];

export const seedOutboundOrders: OutboundOrder[] = [
  { ...base('ob1'), code: 'OB20261102', soId: 'so_1', warehouseId: 'wh_finished', items: [{ productId: 'p_led_panel', productName: 'LED 面板灯 36W', quantity: 5000, unit: 'pcs' }], status: 'confirmed', outboundDate: '2026-11-02', operator: '王仓管', bookingId: 'bk_1', remark: 'SO-2026-001 出库待运' },
];

export const seedTransferOrders: TransferOrder[] = [
  { ...base('tr1'), code: 'TR20261030', fromWarehouse: 'wh_finished', toWarehouse: 'wh_pending', items: [{ productId: 'p_led_panel', productName: 'LED 灯条', quantity: 200, unit: 'pcs' }], status: 'completed', transferDate: '2026-10-30', operator: '王仓管', remark: '调拨至待运仓' },
];

export const seedStocktakeOrders: StocktakeOrder[] = [
  { ...base('st1'), code: 'ST20261020', warehouseId: 'wh_finished', items: [{ productId: 'p_led_panel', productName: 'LED 灯条', bookQty: 3000, actualQty: 2998, diffQty: -2, unit: 'pcs', remark: '正常损耗' }], status: 'adjusted', stocktakeDate: '2026-10-20', operator: '王仓管', adjustAmount: -25, remark: '月度盘点' },
];

export const seedStockAlerts: StockAlert[] = [
  { ...base('sa1'), productId: 'p_led_bulb', warehouseId: 'wh_finished', type: 'low_stock', message: 'p2 现有库存 850 低于安全库存 1000，建议补货', status: 'open', triggeredAt: '2026-11-01', resolution: null },
  { ...base('sa2'), productId: 'p_power_supply', warehouseId: 'wh_pending', type: 'low_stock', message: 'p3 现有库存 120 低于安全库存 500，已下单补货 2000', status: 'processing', triggeredAt: '2026-10-28', resolution: '采购在途' },
];

// ===== 财务 =====
export const seedArInvoices: ARInvoice[] = [
  { ...base('ar1'), code: 'AR20261001', customerId: 'cus_abc', salesOrderId: 'so_1', amount: 28500, currency: 'USD', exchangeRate: 7.24, amountCny: 206340, paidAmount: 14250, issueDate: '2026-10-01', dueDate: '2026-12-01', status: 'partial', paymentTerms: 'T/T', verifiedAmount: 14250, remark: '30% 定金已收', owner: '陈销售' },
  { ...base('ar2'), code: 'AR20260902', customerId: 'cus_global', salesOrderId: 'so_2', amount: 12600, currency: 'EUR', exchangeRate: 7.85, amountCny: 98910, paidAmount: 0, issueDate: '2026-09-02', dueDate: '2026-10-02', status: 'overdue', paymentTerms: 'T/T', verifiedAmount: 0, remark: '尾款逾期 30 天', owner: '陈销售' },
  { ...base('ar3'), code: 'AR20261003', customerId: 'cus_aladdin', salesOrderId: 'so_2', amount: 8600, currency: 'USD', exchangeRate: 7.24, amountCny: 62264, paidAmount: 0, issueDate: '2026-10-20', dueDate: '2027-01-20', status: 'open', paymentTerms: 'L/C', verifiedAmount: 0, remark: '信用证项下', owner: '刘销售' },
];

export const seedApInvoices: APInvoice[] = [
  { ...base('ap1'), code: 'AP20261001', supplierId: 'sup_huayi', purchaseOrderId: 'po_1', amount: 96000, currency: 'CNY', exchangeRate: 1, amountCny: 96000, taxRate: 13, taxAmount: 12480, paidAmount: 28800, dueDate: '2026-11-15', status: 'partial', paymentTerms: '月结30', remark: '预付 30%', owner: '赵采购' },
  { ...base('ap2'), code: 'AP20260902', supplierId: 'sup_zhongke', purchaseOrderId: 'po_2', amount: 54000, currency: 'CNY', exchangeRate: 1, amountCny: 54000, taxRate: 13, taxAmount: 7020, paidAmount: 0, dueDate: '2026-10-15', status: 'overdue', paymentTerms: '月结30', remark: '逾期未付', owner: '赵采购' },
];

export const seedCostAnalyses: CostAnalysis[] = [
  { ...base('cost1'), salesOrderId: 'so_1', costs: [
    { category: 'material', name: '采购成本', amount: 96000, currency: 'CNY', note: 'PO-2026-001' },
    { category: 'freight', name: '海运费', amount: 18500, currency: 'CNY', note: 'BK-2026-001' },
    { category: 'other', name: '报关杂费', amount: 3200, currency: 'CNY', note: '报关+拖车' },
  ], totalCost: 117700, revenue: 28500, currency: 'USD', exchangeRate: 7.24, revenueCny: 206340, grossProfit: 88640, profitRate: 42.95 },
  { ...base('cost2'), salesOrderId: 'so_2', costs: [
    { category: 'material', name: '采购成本', amount: 54000, currency: 'CNY', note: 'PO-2026-002' },
    { category: 'freight', name: '海运费', amount: 12800, currency: 'CNY', note: 'BK-2026-002' },
  ], totalCost: 66800, revenue: 12600, currency: 'EUR', exchangeRate: 7.85, revenueCny: 98910, grossProfit: 32110, profitRate: 32.47 },
];

export const seedExpenseRecords: ExpenseRecord[] = [
  { ...base('exp1'), code: 'EX20261001', type: 'freight', department: '物流部', amount: 18500, currency: 'CNY', exchangeRate: 1, amountCny: 18500, date: '2026-10-18', description: 'SO-2026-001 海运费', status: 'paid', salesOrderId: 'so_1', owner: '周物流' },
  { ...base('exp2'), code: 'EX20261002', type: 'commission', department: '销售部', amount: 1425, currency: 'USD', exchangeRate: 7.24, amountCny: 10317, date: '2026-10-25', description: '客户 c1 佣金 5%', status: 'approved', salesOrderId: 'so_1', owner: '陈销售' },
  { ...base('exp3'), code: 'EX20261003', type: 'travel', department: '销售部', amount: 8600, currency: 'CNY', exchangeRate: 1, amountCny: 8600, date: '2026-10-12', description: '广交会差旅', status: 'pending', salesOrderId: null, owner: '刘销售' },
];

// ===== 税务外汇 =====
export const seedRefundDeclarations: RefundDeclaration[] = [
  { ...base('rf1'), code: 'RF20261001', salesOrderId: 'so_1', customsId: 'cd1', arId: 'ar1', declareAmount: 27800, currency: 'USD', taxRate: 13, refundAmount: 26176.4, status: 'submitted', period: '2026-10', declareDate: '2026-10-25', receivedDate: null, remark: '单证齐全已申报' },
  { ...base('rf2'), code: 'RF20260901', salesOrderId: 'so_2', customsId: 'cd2', arId: 'ar2', declareAmount: 12300, currency: 'EUR', taxRate: 13, refundAmount: 12583.5, status: 'received', period: '2026-09', declareDate: '2026-09-28', receivedDate: '2026-10-20', remark: '退税已到账' },
];

export const seedVatRecords: VATRecord[] = [
  { ...base('vat1'), code: 'VAT20261001', type: 'input', refId: 'ap1', amount: 96000, taxRate: 13, taxAmount: 12480, period: '2026-10', status: 'declared', refDesc: '进项 - PO-2026-001' },
  { ...base('vat2'), code: 'VAT20261002', type: 'output', refId: 'so_1', amount: 206340, taxRate: 0, taxAmount: 0, period: '2026-10', status: 'declared', refDesc: '出口免税销售' },
];

export const seedFxVerifications: FxVerification[] = [
  { ...base('fx1'), code: 'FX20261001', arId: 'ar1', receiptNo: 'SW20261015001', amount: 14250, currency: 'USD', receiptDate: '2026-10-15', verifyDate: '2026-10-16', status: 'verified', verifiedAmount: 14250, remark: '30% 定金水单' },
  { ...base('fx2'), code: 'FX20261002', arId: 'ar2', receiptNo: '', amount: 0, currency: 'EUR', receiptDate: '', verifyDate: null, status: 'pending', verifiedAmount: 0, remark: '待客户付款' },
];

export const seedLcDocs: LcDoc[] = [
  { ...base('lc1'), code: 'LC20261001', salesOrderId: 'so_2', applicant: 'Al Noor Trading LLC', beneficiary: '深圳华盛进出口贸易有限公司', amount: 8600, currency: 'USD', issueDate: '2026-10-18', expiryDate: '2026-12-18', latestShipDate: '2026-11-30', presentationDays: 21, status: 'issued', documents: [
    { ...base('lcd1'), lcId: 'lc1', type: 'commercial_invoice', docNo: 'INV-2026-301', status: 'pending', presentedAt: null, remark: '待出运后交单' },
    { ...base('lcd2'), lcId: 'lc1', type: 'bill_of_lading', docNo: '', status: 'pending', presentedAt: null, remark: '待出运' },
  ], issuingBank: 'Emirates NBD', lcNo: 'LC86750021EN', amendCount: 0, remark: '即期信用证', owner: '刘销售' },
];

// ===== 系统管理 =====
export const seedUsers: User[] = [
  { ...base('u1'), username: 'admin', displayName: '李总', email: 'admin@huasheng.com', phone: '13800000001', roleIds: ['r1'], status: 'active', isAdmin: true, lastLoginAt: '2026-11-03T09:00:00.000Z' },
  { ...base('u2'), username: 'chen.sales', displayName: '陈销售', email: 'chen@huasheng.com', phone: '13800000002', roleIds: ['r2'], status: 'active', isAdmin: false, lastLoginAt: '2026-11-03T08:30:00.000Z' },
  { ...base('u3'), username: 'zhao.buyer', displayName: '赵采购', email: 'zhao@huasheng.com', phone: '13800000003', roleIds: ['r3'], status: 'active', isAdmin: false, lastLoginAt: '2026-11-02T17:20:00.000Z' },
  { ...base('u4'), username: 'wang.doc', displayName: '王单证', email: 'wang@huasheng.com', phone: '13800000004', roleIds: ['r4'], status: 'active', isAdmin: false, lastLoginAt: '2026-11-01T14:10:00.000Z' },
];

export const seedRoles: Role[] = [
  { ...base('r1'), code: 'admin', name: '系统管理员', description: '全部权限', permissionIds: ['pm1','pm2','pm3','pm4','pm5'], builtin: true },
  { ...base('r2'), code: 'sales', name: '销售', description: '销售管理 + 客户', permissionIds: ['pm1','pm2'], builtin: true },
  { ...base('r3'), code: 'buyer', name: '采购', description: '采购管理 + 供应商', permissionIds: ['pm1','pm3'], builtin: true },
  { ...base('r4'), code: 'doc', name: '单证', description: '物流单证 + 税务外汇', permissionIds: ['pm1','pm4'], builtin: true },
];

export const seedPermissions: Permission[] = [
  { ...base('pm1'), module: 'sales', action: 'view', description: '查看销售模块' },
  { ...base('pm2'), module: 'sales', action: 'edit', description: '编辑销售单据' },
  { ...base('pm3'), module: 'purchase', action: 'edit', description: '编辑采购单据' },
  { ...base('pm4'), module: 'logistics', action: 'edit', description: '编辑物流单证' },
  { ...base('pm5'), module: 'system', action: 'admin', description: '系统管理' },
];
