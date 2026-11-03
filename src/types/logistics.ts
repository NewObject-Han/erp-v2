/**
 * 物流单证域类型：订舱 / 报关 / 单证 / 审核
 */
import type { BaseEntity } from './common';

/** 单证类型 */
export type DocType =
  | 'commercial_invoice'
  | 'packing_list'
  | 'certificate_of_origin'
  | 'bill_of_lading'
  | 'customs_declaration'
  | 'other';

/** 单证状态 */
export type DocStatus = 'draft' | 'generating' | 'ready' | 'submitted' | 'audited' | 'approved' | 'rejected';

/** 订舱状态 */
export type BookingStatus =
  | 'draft'
  | 'booked'
  | 'confirmed'
  | 'shipped'
  | 'closed'
  | 'cancelled';

/** 订舱单 */
export interface Booking extends BaseEntity {
  code: string;
  salesOrderId: string;
  /** 起运港 */
  portOfLoading: string;
  /** 目的港 */
  portOfDischarge: string;
  /** 船名 */
  vessel: string;
  /** 航次 */
  voyage: string;
  /** 预计离港 */
  etd: string;
  /** 预计到港 */
  eta: string;
  /** 运费 */
  freight: number;
  /** 保险费 */
  insurance: number;
  currency: string;
  /** 订舱号 */
  bookingNo: string;
  status: BookingStatus;
  /** 货代 */
  forwarder: string;
  /** 柜型柜量 */
  containerType: string;
  containerQty: number;
  remark: string;
  owner: string;
}

/** 报关状态 */
export type CustomsStatus =
  | 'draft'
  | 'submitted'
  | 'inspection'
  | 'released'
  | 'rejected'
  | 'closed';

/** 报关单 */
export interface CustomsDeclaration extends BaseEntity {
  code: string;
  bookingId: string;
  salesOrderId: string;
  /** 出口商 */
  exporterName: string;
  /** 进口商 */
  importerName: string;
  hsCode: string;
  /** 申报金额 */
  declareValue: number;
  currency: string;
  /** 报关单号 */
  customsNo: string;
  /** 商品名称 */
  productName: string;
  /** 数量 */
  quantity: number;
  /** 出口日期 */
  exportDate: string;
  status: CustomsStatus;
  /** 退税率 */
  refundRate: number;
  /** 应退税额 */
  taxAmount: number;
  remark: string;
  owner: string;
}

/** 单证审核项 */
export interface AuditItem {
  docType: string;
  field: string;
  expected: string;
  actual: string;
  /** 严重程度 */
  severity: 'critical' | 'major' | 'minor';
  /** 说明 */
  message: string;
}

/** 单证审核结果 */
export interface AuditResult {
  passed: boolean;
  discrepancies: AuditItem[];
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  /** 审核时间 */
  auditedAt: string;
  /** 审核说明 */
  summary: string;
}

/** 单证 */
export interface Document extends BaseEntity {
  type: DocType;
  bookingId: string;
  salesOrderId: string;
  code: string;
  /** 单证内容（结构化） */
  content: Record<string, unknown>;
  pdfUrl?: string | null;
  status: DocStatus;
  auditResult?: AuditResult | null;
  /** 生成日期 */
  issueDate: string;
  /** 份数 */
  copies: number;
  remark: string;
}

/** 物流轨迹节点 */
export interface TrackingPoint {
  at: string;
  location: string;
  event: string;
  description: string;
}

/** 物流轨迹 */
export interface LogisticsTrack extends BaseEntity {
  bookingId: string;
  salesOrderId: string;
  points: TrackingPoint[];
  /** 当前状态 */
  currentStatus: string;
  /** 预计到港 */
  eta: string;
  /** 是否异常 */
  hasException: boolean;
}
