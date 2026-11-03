/**
 * 税务外汇域类型：退税 / 增值税 / 外汇核销 / 信用证
 */
import type { BaseEntity } from './common';

/** 退税申报状态 */
export type RefundStatus =
  | 'pending'
  | 'collecting'
  | 'submitted'
  | 'approved'
  | 'received'
  | 'rejected';

/** 退税申报单 */
export interface RefundDeclaration extends BaseEntity {
  code: string;
  salesOrderId: string;
  customsId?: string | null;
  arId?: string | null;
  /** 申报金额（FOB 离岸价） */
  declareAmount: number;
  currency: string;
  /** 退税率 */
  taxRate: number;
  /** 应退税额 */
  refundAmount: number;
  status: RefundStatus;
  /** 申报期间 */
  period: string;
  /** 申报日期 */
  declareDate: string;
  /** 到账日期 */
  receivedDate?: string | null;
  /** 备注 */
  remark: string;
}

/** 增值税类型 */
export type VATType = 'input' | 'output';

/** 增值税状态 */
export type VATStatus = 'draft' | 'declared' | 'paid' | 'refunded';

/** 增值税记录 */
export interface VATRecord extends BaseEntity {
  code: string;
  type: VATType;
  /** 关联单据 ID */
  refId: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  /** 所属期间 2026-01 */
  period: string;
  status: VATStatus;
  /** 关联说明 */
  refDesc: string;
}

/** 外汇核销状态 */
export type FxStatus = 'pending' | 'verified' | 'rejected' | 'closed';

/** 外汇核销单 */
export interface FxVerification extends BaseEntity {
  code: string;
  arId: string;
  /** 收汇水单号 */
  receiptNo: string;
  /** 收汇金额 */
  amount: number;
  currency: string;
  /** 收汇日期 */
  receiptDate: string;
  /** 核销日期 */
  verifyDate?: string | null;
  status: FxStatus;
  /** 核销金额 */
  verifiedAmount: number;
  remark: string;
}

/** 信用证状态 */
export type LcStatus =
  | 'draft'
  | 'issued'
  | 'amended'
  | 'presented'
  | 'negotiated'
  | 'settled'
  | 'closed'
  | 'cancelled';

/** 信用证交单状态 */
export type LcDocStatus =
  | 'pending'
  | 'presented'
  | 'accepted'
  | 'rejected'
  | 'negotiated';

/** 信用证交单记录 */
export interface LcDocument extends BaseEntity {
  lcId: string;
  type: string;
  docNo: string;
  status: LcDocStatus;
  /** 交单日期 */
  presentedAt?: string | null;
  remark: string;
}

/** 信用证 */
export interface LcDoc extends BaseEntity {
  code: string;
  salesOrderId: string;
  /** 开证申请人（客户） */
  applicant: string;
  /** 受益人（我司） */
  beneficiary: string;
  amount: number;
  currency: string;
  /** 开证日期 */
  issueDate: string;
  /** 效期 */
  expiryDate: string;
  /** 装运期 */
  latestShipDate: string;
  /** 交单期 */
  presentationDays: number;
  status: LcStatus;
  documents: LcDocument[];
  /** 开证行 */
  issuingBank: string;
  /** 信用证号码 */
  lcNo: string;
  /** 改证次数 */
  amendCount: number;
  remark: string;
  owner: string;
}
