/**
 * 业务枚举值
 */

// ===== 客户 =====
export const CUSTOMER_STATUS = {
  POTENTIAL: 'potential',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLACKLIST: 'blacklist',
} as const;

export const PAYMENT_TERMS_OPTIONS = ['T/T', 'L/C', 'OA', 'D/P', 'D/A', 'OTHER'] as const;

export const CUSTOMER_LEVELS = ['A', 'B', 'C', 'D'] as const;

// ===== 销售 =====
export const INQUIRY_SOURCE = {
  EXHIBITION: 'exhibition',
  B2B: 'b2b',
  EMAIL: 'email',
  REFERRAL: 'referral',
  OTHER: 'other',
} as const;

export const INQUIRY_STATUS = {
  PENDING: 'pending',
  QUOTED: 'quoted',
  IN_PROGRESS: 'in_progress',
  CONVERTED: 'converted',
  CLOSED: 'closed',
} as const;

export const QUOTATION_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export const SAMPLE_STATUS = {
  PENDING: 'pending',
  PRODUCING: 'producing',
  SHIPPED: 'shipped',
  CONFIRMED: 'confirmed',
  CONVERTED: 'converted',
  CANCELLED: 'cancelled',
} as const;

export const PI_STATUS = {
  DRAFT: 'draft',
  ISSUED: 'issued',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  IN_PRODUCTION: 'in_production',
  READY_TO_SHIP: 'ready_to_ship',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_SOURCE = {
  PI: 'pi',
  SAMPLE: 'sample',
  DIRECT: 'direct',
  REORDER: 'reorder',
} as const;

// ===== 采购 =====
export const SUPPLIER_LEVEL = {
  STRATEGIC: 'strategic',
  PREFERRED: 'preferred',
  REGULAR: 'regular',
  TEMPORARY: 'temporary',
} as const;

export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  BLACKLIST: 'blacklist',
} as const;

export const PUR_INQUIRY_STATUS = {
  DRAFT: 'draft',
  QUOTED: 'quoted',
  COMPARING: 'comparing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const COMPARE_STATUS = {
  DRAFT: 'draft',
  COMPARING: 'comparing',
  COMPLETED: 'completed',
} as const;

export const PO_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  CONFIRMED: 'confirmed',
  IN_PRODUCTION: 'in_production',
  SHIPPED: 'shipped',
  RECEIVED: 'received',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export const ARRIVAL_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  DEFECTIVE: 'defective',
  CANCELLED: 'cancelled',
} as const;

// ===== 跟单 =====
export const TRACKING_NODE_TYPE = {
  PURCHASE: 'purchase',
  PRODUCTION: 'production',
  INSPECTION: 'inspection',
  PACKING: 'packing',
  BOOKING: 'booking',
  CUSTOMS: 'customs',
  SHIPPING: 'shipping',
  DOCUMENT: 'document',
  DELIVERY: 'delivery',
} as const;

export const NODE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  DELAYED: 'delayed',
  EXCEPTION: 'exception',
} as const;

export const TRACKING_STATUS = {
  INIT: 'init',
  IN_PROGRESS: 'in_progress',
  DELAYED: 'delayed',
  COMPLETED: 'completed',
  EXCEPTION: 'exception',
} as const;

export const EXCEPTION_TYPE = {
  DELAY: 'delay',
  QUALITY: 'quality',
  LOGISTICS: 'logistics',
  PAYMENT: 'payment',
  DOCUMENT: 'document',
  CUSTOMS: 'customs',
  SUPPLIER: 'supplier',
  OTHER: 'other',
} as const;

export const EXCEPTION_STATUS = {
  OPEN: 'open',
  PROCESSING: 'processing',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

// ===== 物流单证 =====
export const DOC_TYPE = {
  COMMERCIAL_INVOICE: 'commercial_invoice',
  PACKING_LIST: 'packing_list',
  CERTIFICATE_OF_ORIGIN: 'certificate_of_origin',
  BILL_OF_LADING: 'bill_of_lading',
  CUSTOMS_DECLARATION: 'customs_declaration',
  OTHER: 'other',
} as const;

export const DOC_STATUS = {
  DRAFT: 'draft',
  GENERATING: 'generating',
  READY: 'ready',
  SUBMITTED: 'submitted',
  AUDITED: 'audited',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const BOOKING_STATUS = {
  DRAFT: 'draft',
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export const CUSTOMS_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  INSPECTION: 'inspection',
  RELEASED: 'released',
  REJECTED: 'rejected',
  CLOSED: 'closed',
} as const;

// ===== 仓储 =====
export const WAREHOUSE_TYPE = {
  FINISHED: 'finished',
  PENDING_SHIPMENT: 'pending_shipment',
  MATERIAL: 'material',
  OVERSEAS: 'overseas',
} as const;

export const INBOUND_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const OUTBOUND_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TRANSFER_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const STOCKTAKE_STATUS = {
  DRAFT: 'draft',
  COUNTING: 'counting',
  COMPLETED: 'completed',
  ADJUSTED: 'adjusted',
  CANCELLED: 'cancelled',
} as const;

export const ALERT_TYPE = {
  LOW_STOCK: 'low_stock',
  OVERSTOCK: 'overstock',
  EXPIRY: 'expiry',
  NO_MOVEMENT: 'no_movement',
  OTHER: 'other',
} as const;

export const ALERT_STATUS = {
  OPEN: 'open',
  PROCESSING: 'processing',
  RESOLVED: 'resolved',
  IGNORED: 'ignored',
} as const;

// ===== 财务 =====
export const AR_STATUS = {
  OPEN: 'open',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
  PAID: 'paid',
  WRITTEN_OFF: 'written_off',
  CANCELLED: 'cancelled',
} as const;

export const AP_STATUS = {
  OPEN: 'open',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

export const EXPENSE_TYPE = {
  FREIGHT: 'freight',
  COMMISSION: 'commission',
  TRAVEL: 'travel',
  OFFICE: 'office',
  BANK: 'bank',
  OTHER: 'other',
} as const;

export const EXPENSE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
} as const;

// ===== 税务外汇 =====
export const REFUND_STATUS = {
  PENDING: 'pending',
  COLLECTING: 'collecting',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  RECEIVED: 'received',
  REJECTED: 'rejected',
} as const;

export const VAT_TYPE = {
  INPUT: 'input',
  OUTPUT: 'output',
} as const;

export const VAT_STATUS = {
  DRAFT: 'draft',
  DECLARED: 'declared',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

export const FX_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  CLOSED: 'closed',
} as const;

export const LC_STATUS = {
  DRAFT: 'draft',
  ISSUED: 'issued',
  AMENDED: 'amended',
  PRESENTED: 'presented',
  NEGOTIATED: 'negotiated',
  SETTLED: 'settled',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export const LC_DOC_STATUS = {
  PENDING: 'pending',
  PRESENTED: 'presented',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NEGOTIATED: 'negotiated',
} as const;

// ===== 系统 =====
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled',
} as const;

export const OPENAPI_CONNECTOR_STATUS = {
  NOT_CONFIGURED: 'not_configured',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

// ===== 通用常量 =====
/** 固定退税率（demo 决策：不做可维护税率表） */
export const FIXED_REFUND_RATE = 13;

/** 默认币种 */
export const DEFAULT_CURRENCY = 'USD';

/** 基础币种 */
export const BASE_CURRENCY = 'CNY';

/** 默认贸易术语 */
export const DEFAULT_INCOTERM = 'FOB';
