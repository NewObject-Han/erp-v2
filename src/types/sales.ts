/**
 * 销售域类型：询盘 / 报价 / 样品 / PI / 销售订单
 */
import type { BaseEntity } from './common';
import type { PaymentTerms } from './customer';

/** 询盘来源 */
export type InquirySource = 'exhibition' | 'b2b' | 'email' | 'referral' | 'other';

/** 询盘状态 */
export type InquiryStatus =
  | 'pending'
  | 'quoted'
  | 'in_progress'
  | 'converted'
  | 'closed';

/** 询盘 */
export interface Inquiry extends BaseEntity {
  customerId: string;
  productId: string;
  quantity: number;
  /** 目标价 */
  targetPrice: number;
  currency: string;
  incoterm: string;
  source: InquirySource;
  /** 原始邮件内容 */
  emailRaw: string;
  /** 是否 AI 解析 */
  aiParsed: boolean;
  /** 状态 */
  status: InquiryStatus;
  /** 跟进人 */
  owner: string;
  /** 备注 */
  remark: string;
  /** 客户要求交期 */
  expectedDeliveryDate: string;
}

/** 报价单状态 */
export type QuotationStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired';

/** 报价明细行 */
export interface QuotationItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costPrice: number;
  profit: number;
  profitRate: number;
  hsCode: string;
  unit: string;
  remark: string;
}

/** 报价单 */
export interface Quotation extends BaseEntity {
  code: string;
  customerId: string;
  inquiryId?: string | null;
  /** 版本号 */
  version: number;
  items: QuotationItem[];
  totalAmount: number;
  currency: string;
  incoterm: string;
  validFrom: string;
  validTo: string;
  /** 利润率 */
  profitRate: number;
  status: QuotationStatus;
  /** 审批人 */
  approver?: string | null;
  /** 审批时间 */
  approvedAt?: string | null;
  /** 审批意见 */
  approvalRemark?: string | null;
  remark: string;
  owner: string;
}

/** 样品单状态 */
export type SampleStatus =
  | 'pending'
  | 'producing'
  | 'shipped'
  | 'confirmed'
  | 'converted'
  | 'cancelled';

/** 样品明细行 */
export interface SampleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

/** 样品单 */
export interface SampleOrder extends BaseEntity {
  code: string;
  customerId: string;
  inquiryId?: string | null;
  items: SampleItem[];
  /** 样品费 */
  sampleFee: number;
  currency: string;
  /** 样品费是否冲抵大货 */
  feeOffset: boolean;
  status: SampleStatus;
  /** 寄送单号 */
  trackingNo?: string | null;
  /** 寄送日期 */
  shippedAt?: string | null;
  /** 确认日期 */
  confirmedAt?: string | null;
  remark: string;
  owner: string;
}

/** PI 状态 */
export type PiStatus = 'draft' | 'issued' | 'confirmed' | 'cancelled';

/** PI 明细行 */
export interface PiItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hsCode: string;
  unit: string;
}

/** 形式发票 PI */
export interface PiDoc extends BaseEntity {
  code: string;
  quotationId?: string | null;
  customerId: string;
  items: PiItem[];
  totalAmount: number;
  currency: string;
  incoterm: string;
  issueDate: string;
  status: PiStatus;
  /** 合同号 */
  contractNo?: string | null;
  /** 确认日期 */
  confirmedAt?: string | null;
  remark: string;
  owner: string;
}

/** 订单来源 */
export type OrderSource = 'pi' | 'sample' | 'direct' | 'reorder';

/** 订单状态 */
export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'in_production'
  | 'ready_to_ship'
  | 'shipped'
  | 'completed'
  | 'cancelled';

/** 销售订单明细行 */
export interface SalesOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costPrice: number;
  hsCode: string;
  unit: string;
  remark: string;
}

/** 销售订单 */
export interface SalesOrder extends BaseEntity {
  code: string;
  customerId: string;
  piId?: string | null;
  quotationId?: string | null;
  items: SalesOrderItem[];
  totalAmount: number;
  currency: string;
  incoterm: string;
  paymentTerms: PaymentTerms;
  deliveryDate: string;
  status: OrderStatus;
  source: OrderSource;
  /** 是否关联采购 */
  hasPurchase: boolean;
  /** 备注 */
  remark: string;
  owner: string;
}
