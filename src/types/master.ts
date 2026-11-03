/**
 * 主数据类型：商品 / 贸易术语 / 币种汇率 / 价格矩阵
 */
import type { BaseEntity } from './common';

/** 商品分类 */
export interface ProductCategory extends BaseEntity {
  code: string;
  name: string;
  parentId?: string | null;
}

/** 商品档案 */
export interface Product extends BaseEntity {
  /** SKU 编码 */
  sku: string;
  /** 中文品名 */
  name: string;
  /** 英文品名 */
  nameEn: string;
  /** HS 编码 */
  hsCode: string;
  /** 计量单位 */
  unit: string;
  /** 分类 ID */
  categoryId: string;
  /** 成本价（CNY） */
  costPrice: number;
  /** 标准售价（USD） */
  salePrice: number;
  /** 规格描述 */
  specs: string;
  /** 是否启用 */
  active: boolean;
  /** 申报要素 */
  declarationElements: string;
  /** 退税率（固定 13%，不做可维护税率表） */
  refundRate: number;
  /** 净重 kg */
  netWeight: number;
  /** 毛重 kg */
  grossWeight: number;
  /** 包装尺寸 cm */
  packageSize: string;
}

/** 贸易术语主数据 */
export interface Incoterm extends BaseEntity {
  code: string;
  name: string;
  /** 中文名 */
  nameZh: string;
  /** 责任说明 */
  description: string;
  /** 是否启用 */
  active: boolean;
  /** 排序 */
  sortOrder: number;
}

/** 币种主数据 */
export interface Currency extends BaseEntity {
  code: string;
  name: string;
  /** 符号 */
  symbol: string;
  /** 是否基础币种（CNY） */
  isBase: boolean;
  /** 小数位 */
  decimals: number;
  active: boolean;
}

/** 汇率记录 */
export interface ExchangeRate extends BaseEntity {
  /** 原币种 */
  fromCurrency: string;
  /** 目标币种 */
  toCurrency: string;
  /** 汇率 */
  rate: number;
  /** 日期 */
  date: string;
  source: string;
}

/** 价格矩阵条目 */
export interface PriceListItem extends BaseEntity {
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  validFrom: string;
  validTo: string;
}
