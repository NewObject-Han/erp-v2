/**
 * 仓储域类型：仓库 / 库存 / 出入库 / 调拨 / 盘点 / 预警
 */
import type { BaseEntity } from './common';

/** 仓库类型 */
export type WarehouseType = 'finished' | 'pending_shipment' | 'material' | 'overseas';

/** 仓库 */
export interface Warehouse extends BaseEntity {
  code: string;
  name: string;
  type: WarehouseType;
  location: string;
  /** 是否启用 */
  active: boolean;
  /** 备注 */
  remark: string;
}

/** 库存记录 */
export interface Inventory extends BaseEntity {
  productId: string;
  warehouseId: string;
  /** 现有量 */
  onHand: number;
  /** 在途量 */
  onOrder: number;
  /** 已预留 */
  allocated: number;
  /** 安全库存 */
  safetyStock: number;
  /** 单位成本 */
  unitCost: number;
  currency: string;
  /** 批次号 */
  batchNo: string;
  lastUpdated: string;
}

/** 入库状态 */
export type InboundStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

/** 入库明细 */
export interface InboundItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  batchNo: string;
  unit: string;
}

/** 入库单 */
export interface InboundOrder extends BaseEntity {
  code: string;
  poId?: string | null;
  warehouseId: string;
  items: InboundItem[];
  status: InboundStatus;
  /** 入库日期 */
  inboundDate: string;
  /** 经办人 */
  operator: string;
  /** 备注 */
  remark: string;
}

/** 出库状态 */
export type OutboundStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

/** 出库明细 */
export interface OutboundItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

/** 出库单 */
export interface OutboundOrder extends BaseEntity {
  code: string;
  soId?: string | null;
  warehouseId: string;
  items: OutboundItem[];
  status: OutboundStatus;
  /** 出库日期 */
  outboundDate: string;
  /** 经办人 */
  operator: string;
  /** 关联订舱 */
  bookingId?: string | null;
  remark: string;
}

/** 调拨状态 */
export type TransferStatus = 'draft' | 'confirmed' | 'in_transit' | 'completed' | 'cancelled';

/** 调拨明细 */
export interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

/** 调拨单 */
export interface TransferOrder extends BaseEntity {
  code: string;
  fromWarehouse: string;
  toWarehouse: string;
  items: TransferItem[];
  status: TransferStatus;
  /** 调拨日期 */
  transferDate: string;
  /** 经办人 */
  operator: string;
  remark: string;
}

/** 盘点状态 */
export type StocktakeStatus = 'draft' | 'counting' | 'completed' | 'adjusted' | 'cancelled';

/** 盘点明细 */
export interface StocktakeItem {
  productId: string;
  productName: string;
  /** 账面数量 */
  bookQty: number;
  /** 实盘数量 */
  actualQty: number;
  /** 差异 */
  diffQty: number;
  unit: string;
  remark: string;
}

/** 盘点单 */
export interface StocktakeOrder extends BaseEntity {
  code: string;
  warehouseId: string;
  items: StocktakeItem[];
  status: StocktakeStatus;
  /** 盘点日期 */
  stocktakeDate: string;
  /** 经办人 */
  operator: string;
  /** 调整金额 */
  adjustAmount: number;
  remark: string;
}

/** 预警类型 */
export type AlertType = 'low_stock' | 'overstock' | 'expiry' | 'no_movement' | 'other';

/** 预警状态 */
export type AlertStatus = 'open' | 'processing' | 'resolved' | 'ignored';

/** 库存预警 */
export interface StockAlert extends BaseEntity {
  productId: string;
  warehouseId: string;
  type: AlertType;
  message: string;
  status: AlertStatus;
  /** 触发日期 */
  triggeredAt: string;
  /** 处理说明 */
  resolution?: string | null;
}
