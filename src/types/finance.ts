/**
 * 财务域类型：应收 / 应付 / 成本 / 费用
 */
import type { BaseEntity } from './common';

/** 应收单状态 */
export type ARStatus =
  | 'open'
  | 'partial'
  | 'overdue'
  | 'paid'
  | 'written_off'
  | 'cancelled';

/** 应收单 */
export interface ARInvoice extends BaseEntity {
  code: string;
  customerId: string;
  salesOrderId?: string | null;
  amount: number;
  currency: string;
  /** 汇率（原币 → CNY） */
  exchangeRate: number;
  /** 折合人民币 */
  amountCny: number;
  /** 已收金额 */
  paidAmount: number;
  issueDate: string;
  /** 到期日 */
  dueDate: string;
  status: ARStatus;
  /** 付款方式 */
  paymentTerms: string;
  /** 已核销金额 */
  verifiedAmount: number;
  remark: string;
  owner: string;
}

/** 应付单状态 */
export type APStatus =
  | 'open'
  | 'partial'
  | 'overdue'
  | 'paid'
  | 'cancelled';

/** 应付单 */
export interface APInvoice extends BaseEntity {
  code: string;
  supplierId: string;
  purchaseOrderId?: string | null;
  amount: number;
  currency: string;
  exchangeRate: number;
  amountCny: number;
  taxRate: number;
  taxAmount: number;
  /** 已付金额 */
  paidAmount: number;
  /** 到期日 */
  dueDate: string;
  status: APStatus;
  /** 付款方式 */
  paymentTerms: string;
  remark: string;
  owner: string;
}

/** 成本归集项 */
export interface CostItem {
  category: 'material' | 'labor' | 'freight' | 'insurance' | 'commission' | 'tax' | 'other';
  name: string;
  amount: number;
  currency: string;
  /** 归集说明 */
  note: string;
}

/** 订单成本分析 */
export interface CostAnalysis extends BaseEntity {
  salesOrderId: string;
  costs: CostItem[];
  /** 总成本（CNY） */
  totalCost: number;
  /** 收入（原币） */
  revenue: number;
  currency: string;
  exchangeRate: number;
  /** 收入折合 CNY */
  revenueCny: number;
  /** 毛利（CNY） */
  grossProfit: number;
  /** 毛利率 % */
  profitRate: number;
}

/** 费用类型 */
export type ExpenseType =
  | 'freight'
  | 'commission'
  | 'travel'
  | 'office'
  | 'bank'
  | 'other';

/** 费用状态 */
export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'paid' | 'rejected';

/** 费用记录 */
export interface ExpenseRecord extends BaseEntity {
  code: string;
  type: ExpenseType;
  department: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  amountCny: number;
  date: string;
  description: string;
  status: ExpenseStatus;
  /** 费用承担订单 */
  salesOrderId?: string | null;
  /** 经办人 */
  owner: string;
}
