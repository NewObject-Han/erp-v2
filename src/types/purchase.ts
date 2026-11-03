/**
 * 采购域类型：采购询价 / 比价 / 采购订单 / 到货
 */
import type { BaseEntity } from './common';

/** 采购询价状态 */
export type PurInquiryStatus =
  | 'draft'
  | 'quoted'
  | 'comparing'
  | 'completed'
  | 'cancelled';

/** 采购询价明细行 */
export interface PurchaseInquiryItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

/** 采购询价单 */
export interface PurchaseInquiry extends BaseEntity {
  code: string;
  supplierId?: string | null;
  salesOrderId?: string | null;
  items: PurchaseInquiryItem[];
  totalAmount: number;
  currency: string;
  status: PurInquiryStatus;
  /** 询价日期 */
  inquiryDate: string;
  /** 要求交期 */
  expectedDeliveryDate: string;
  remark: string;
  owner: string;
}

/** 比价状态 */
export type CompareStatus = 'draft' | 'comparing' | 'completed';

/** 供应商报价明细 */
export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
  currency: string;
  validTo: string;
  deliveryDays: number;
  /** 是否含运费 */
  includeFreight: boolean;
  remark: string;
}

/** 比价表 */
export interface PriceCompare extends BaseEntity {
  inquiryId: string;
  quotes: SupplierQuote[];
  /** 选定供应商 */
  selectedSupplier?: string | null;
  status: CompareStatus;
  /** 比价结论 */
  conclusion: string;
  createdBy: string;
}

/** 采购订单状态 */
export type POStatus =
  | 'draft'
  | 'sent'
  | 'confirmed'
  | 'in_production'
  | 'shipped'
  | 'received'
  | 'closed'
  | 'cancelled';

/** 采购订单明细行 */
export interface PurchaseOrderItem {
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

/** 采购订单 */
export interface PurchaseOrder extends BaseEntity {
  code: string;
  supplierId: string;
  salesOrderId?: string | null;
  items: PurchaseOrderItem[];
  totalAmount: number;
  currency: string;
  taxRate: number;
  deliveryDate: string;
  status: POStatus;
  /** 关联询价/比价 */
  inquiryId?: string | null;
  /** 采购员 */
  owner: string;
  remark: string;
}

/** 到货状态 */
export type ArrivalStatus = 'pending' | 'partial' | 'completed' | 'defective' | 'cancelled';

/** 到货明细 */
export interface ArrivalItem {
  productId: string;
  productName: string;
  /** 应收数量 */
  expectedQty: number;
  /** 实收数量 */
  arrivedQty: number;
  /** 不良数量 */
  defectiveQty: number;
  unit: string;
}

/** 到货验收单 */
export interface PoArrival extends BaseEntity {
  poId: string;
  items: ArrivalItem[];
  arrivedQty: number;
  defectiveQty: number;
  status: ArrivalStatus;
  /** 验收日期 */
  arrivalDate: string;
  /** 验收人 */
  receiver: string;
  /** 不良处理说明 */
  defectiveRemark: string;
}
