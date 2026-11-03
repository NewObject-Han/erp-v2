/**
 * 通用常量
 */

/** 模块名（用于权限矩阵） */
export const MODULES = {
  DASHBOARD: 'dashboard',
  CRM: 'crm',
  SALES: 'sales',
  PURCHASE: 'purchase',
  TRACKING: 'tracking',
  LOGISTICS: 'logistics',
  WAREHOUSE: 'warehouse',
  FINANCE: 'finance',
  TAX: 'tax',
  MASTER: 'master',
  AI: 'ai',
  OPENAPI: 'openapi',
  SYSTEM: 'system',
} as const;

/** 权限操作 */
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  APPROVE: 'approve',
  EXPORT: 'export',
} as const;

/** 模块中文名 */
export const MODULE_LABELS: Record<string, string> = {
  dashboard: '工作台',
  crm: '客户与供应商',
  sales: '销售管理',
  purchase: '采购管理',
  tracking: '订单跟单',
  logistics: '物流单证',
  warehouse: '仓储管理',
  finance: '财务管理',
  tax: '税务外汇',
  master: '主数据',
  ai: 'AI 中心',
  openapi: '开放平台',
  system: '系统管理',
};

/** localStorage 键前缀 */
export const LS_KEY_PREFIX = 'erp-v2';

/** 业务单号前缀 */
export const BIZ_NO_PREFIX = {
  inquiry: 'INQ',
  quotation: 'QT',
  sample: 'SMP',
  pi: 'PI',
  salesOrder: 'SO',
  purchaseInquiry: 'PIR',
  priceCompare: 'PC',
  purchaseOrder: 'PO',
  arrival: 'ARR',
  tracking: 'TK',
  exception: 'EX',
  booking: 'BK',
  customs: 'CD',
  document: 'DC',
  inbound: 'IN',
  outbound: 'OB',
  transfer: 'TR',
  stocktake: 'ST',
  stockAlert: 'AL',
  receivable: 'AR',
  payable: 'AP',
  expense: 'EX',
  refund: 'RF',
  vat: 'VAT',
  fx: 'FX',
  lc: 'LC',
  user: 'U',
  role: 'R',
} as const;

/** 通知类型 */
export const NOTIFY_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

/** 导航分组 */
export const NAV_GROUPS = [
  { key: 'workspace', label: '工作台' },
  { key: 'biz', label: '业务运营' },
  { key: 'support', label: '财务税务' },
  { key: 'infra', label: '基础设施' },
  { key: 'sys', label: '系统' },
] as const;

export type NavGroupKey = (typeof NAV_GROUPS)[number]['key'];
