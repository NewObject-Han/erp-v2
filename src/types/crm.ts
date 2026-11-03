/**
 * 客户与供应商类型（CRM 域）
 */
import type { BaseEntity } from './common';

/** 付款方式 */
export type PaymentTerms = 'T/T' | 'L/C' | 'OA' | 'D/P' | 'D/A' | 'OTHER';

/** 客户状态 */
export type CustomerStatus = 'potential' | 'active' | 'inactive' | 'blacklist';

/** 客户档案 */
export interface Customer extends BaseEntity {
  code: string;
  name: string;
  /** 国别 */
  country: string;
  /** 联系人 */
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  /** 付款方式 */
  paymentTerms: PaymentTerms;
  /** 信用额度（USD） */
  creditLimit: number;
  /** 账期天数 */
  creditDays: number;
  status: CustomerStatus;
  level: 'A' | 'B' | 'C' | 'D';
  /** 来源渠道 */
  source: string;
  website: string;
  /** 客户画像标签 */
  tags: string[];
  remark: string;
}

/** 跟进记录 */
export interface FollowUp extends BaseEntity {
  customerId: string;
  type: 'visit' | 'call' | 'email' | 'wechat' | 'meeting' | 'other';
  content: string;
  at: string;
  user: string;
}

/** 商机阶段 */
export type OpportunityStage =
  | 'lead'
  | 'inquiry'
  | 'quotation'
  | 'sample'
  | 'negotiation'
  | 'won'
  | 'lost';

/** 商机 */
export interface Opportunity extends BaseEntity {
  customerId: string;
  inquiryId?: string | null;
  title: string;
  estimatedAmount: number;
  currency: string;
  stage: OpportunityStage;
  expectedClose: string;
  probability: number;
  remark: string;
}

/** 客户信用状态 */
export type CreditStatus = 'normal' | 'warning' | 'exceeded' | 'frozen';

/** 客户信用额度使用 */
export interface CustomerCredit extends BaseEntity {
  customerId: string;
  creditLimit: number;
  usedAmount: number;
  availableAmount: number;
  creditDays: number;
  status: CreditStatus;
  lastUpdated: string;
}

/** 供应商等级 */
export type SupplierLevel = 'strategic' | 'preferred' | 'regular' | 'temporary';

/** 供应商状态 */
export type SupplierStatus = 'active' | 'inactive' | 'pending' | 'blacklist';

/** 供应商档案 */
export interface Supplier extends BaseEntity {
  code: string;
  name: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  /** 主营品类 */
  mainCategory: string;
  /** 等级 */
  level: SupplierLevel;
  /** 状态 */
  status: SupplierStatus;
  /** 资质文件列表 */
  qualifications: SupplierQualification[];
  /** 历史平均准交率 */
  onTimeRate: number;
  remark: string;
}

/** 供应商资质 */
export interface SupplierQualification extends BaseEntity {
  supplierId: string;
  /** 资质类型：ISO / CE / REACH / 营业执照 等 */
  type: string;
  /** 证书编号 */
  certNo: string;
  /** 有效期至 */
  validTo: string;
  /** 附件地址 */
  fileUrl?: string | null;
  status: 'valid' | 'expired' | 'pending';
}
