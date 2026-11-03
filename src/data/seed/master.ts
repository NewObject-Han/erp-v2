/**
 * 种子数据：主数据（商品分类 / 商品 / 贸易术语 / 币种 / 汇率 / 价格矩阵 / 仓库）
 */

import type {
  ProductCategory,
  Product,
  Incoterm,
  Currency,
  ExchangeRate,
  PriceListItem,
  Warehouse,
} from '../../types';

export const seedCategories: ProductCategory[] = [
  { id: 'cat_led', code: 'LED', name: 'LED 照明', createdAt: '', updatedAt: '' },
  { id: 'cat_elec', code: 'ELEC', name: '电子电气', createdAt: '', updatedAt: '' },
  { id: 'cat_furn', code: 'FURN', name: '家具家居', createdAt: '', updatedAt: '' },
  { id: 'cat_text', code: 'TEXT', name: '纺织服装', createdAt: '', updatedAt: '' },
];

export const seedProducts: Product[] = [
  {
    id: 'p_led_panel',
    sku: 'LED-PNL-36W',
    name: 'LED 面板灯 36W',
    nameEn: 'LED Panel Light 36W',
    hsCode: '9405.42.0000',
    unit: 'pcs',
    categoryId: 'cat_led',
    costPrice: 28.5,
    salePrice: 8.2,
    specs: '36W 300x300mm 嵌入式',
    active: true,
    declarationElements: 'LED 灯具; 36W; 300x300mm',
    refundRate: 13,
    netWeight: 1.2,
    grossWeight: 1.4,
    packageSize: '36x36x4cm',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'p_led_bulb',
    sku: 'LED-BLB-9W',
    name: 'LED 球泡灯 9W',
    nameEn: 'LED Bulb 9W',
    hsCode: '9405.42.0000',
    unit: 'pcs',
    categoryId: 'cat_led',
    costPrice: 4.2,
    salePrice: 1.6,
    specs: '9W E27 6500K',
    active: true,
    declarationElements: 'LED 球泡; 9W; E27',
    refundRate: 13,
    netWeight: 0.15,
    grossWeight: 0.18,
    packageSize: '8x8x12cm',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'p_power_supply',
    sku: 'PWR-SUP-100W',
    name: 'LED 驱动电源 100W',
    nameEn: 'LED Driver 100W',
    hsCode: '8504.40.9900',
    unit: 'pcs',
    categoryId: 'cat_elec',
    costPrice: 12.8,
    salePrice: 5.6,
    specs: '100W 恒流 24V',
    active: true,
    declarationElements: 'LED 驱动电源; 100W; 恒流',
    refundRate: 13,
    netWeight: 0.45,
    grossWeight: 0.55,
    packageSize: '18x8x5cm',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'p_cable',
    sku: 'CBL-UL1061-24AWG',
    name: 'UL1061 电子线 24AWG',
    nameEn: 'UL1061 Wire 24AWG',
    hsCode: '8544.42.0000',
    unit: 'm',
    categoryId: 'cat_elec',
    costPrice: 0.35,
    salePrice: 0.18,
    specs: '24AWG 红黑双并',
    active: true,
    declarationElements: '电子线; 24AWG; UL1061',
    refundRate: 13,
    netWeight: 0.02,
    grossWeight: 0.03,
    packageSize: '100m/卷',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'p_desk_lamp',
    sku: 'LMP-DSK-LED5W',
    name: 'LED 护眼台灯 5W',
    nameEn: 'LED Desk Lamp 5W',
    hsCode: '9405.42.0000',
    unit: 'pcs',
    categoryId: 'cat_led',
    costPrice: 18.5,
    salePrice: 7.8,
    specs: '5W USB 触控调光',
    active: true,
    declarationElements: 'LED 台灯; 5W; USB',
    refundRate: 13,
    netWeight: 0.38,
    grossWeight: 0.48,
    packageSize: '20x10x8cm',
    createdAt: '',
    updatedAt: '',
  },
];

export const seedIncoterms: Incoterm[] = [
  { id: 'inc_exw', code: 'EXW', name: 'EXW', nameZh: '工厂交货', description: '卖方在工厂交货，买方承担全部运输', active: true, sortOrder: 1, createdAt: '', updatedAt: '' },
  { id: 'inc_fca', code: 'FCA', name: 'FCA', nameZh: '货交承运人', description: '卖方将货物交给买方指定承运人', active: true, sortOrder: 2, createdAt: '', updatedAt: '' },
  { id: 'inc_fob', code: 'FOB', name: 'FOB', nameZh: '装运港船上交货', description: '卖方在装运港船上交货，买方承担海运及保险', active: true, sortOrder: 3, createdAt: '', updatedAt: '' },
  { id: 'inc_cfr', code: 'CFR', name: 'CFR', nameZh: '成本加运费', description: '卖方支付运费至目的港，保险由买方办理', active: true, sortOrder: 4, createdAt: '', updatedAt: '' },
  { id: 'inc_cif', code: 'CIF', name: 'CIF', nameZh: '成本保险费加运费', description: '卖方支付运费和保险费至目的港', active: true, sortOrder: 5, createdAt: '', updatedAt: '' },
  { id: 'inc_dap', code: 'DAP', name: 'DAP', nameZh: '目的地交货', description: '卖方运至指定目的地，不负责清关', active: true, sortOrder: 6, createdAt: '', updatedAt: '' },
  { id: 'inc_ddp', code: 'DDP', name: 'DDP', nameZh: '完税后交货', description: '卖方承担全部费用与风险包括进口清关', active: true, sortOrder: 7, createdAt: '', updatedAt: '' },
];

export const seedCurrencies: Currency[] = [
  { id: 'cur_cny', code: 'CNY', name: '人民币', symbol: '¥', isBase: true, decimals: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'cur_usd', code: 'USD', name: '美元', symbol: '$', isBase: false, decimals: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'cur_eur', code: 'EUR', name: '欧元', symbol: '€', isBase: false, decimals: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'cur_gbp', code: 'GBP', name: '英镑', symbol: '£', isBase: false, decimals: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'cur_jpy', code: 'JPY', name: '日元', symbol: '¥', isBase: false, decimals: 0, active: true, createdAt: '', updatedAt: '' },
  { id: 'cur_hkd', code: 'HKD', name: '港币', symbol: 'HK$', isBase: false, decimals: 2, active: true, createdAt: '', updatedAt: '' },
];

export const seedExchangeRates: ExchangeRate[] = [
  { id: 'fx_usd_cny_1', fromCurrency: 'USD', toCurrency: 'CNY', rate: 7.2, date: '2026-10-01', source: '中国银行', createdAt: '', updatedAt: '' },
  { id: 'fx_eur_cny_1', fromCurrency: 'EUR', toCurrency: 'CNY', rate: 7.9, date: '2026-10-01', source: '中国银行', createdAt: '', updatedAt: '' },
  { id: 'fx_gbp_cny_1', fromCurrency: 'GBP', toCurrency: 'CNY', rate: 9.1, date: '2026-10-01', source: '中国银行', createdAt: '', updatedAt: '' },
  { id: 'fx_jpy_cny_1', fromCurrency: 'JPY', toCurrency: 'CNY', rate: 0.048, date: '2026-10-01', source: '中国银行', createdAt: '', updatedAt: '' },
  { id: 'fx_hkd_cny_1', fromCurrency: 'HKD', toCurrency: 'CNY', rate: 0.92, date: '2026-10-01', source: '中国银行', createdAt: '', updatedAt: '' },
];

export const seedPriceList: PriceListItem[] = [
  {
    id: 'pl_1', productId: 'p_led_panel', customerId: 'cus_abc', quantity: 100, unitPrice: 8.5, currency: 'USD',
    validFrom: '2026-10-01', validTo: '2026-12-31', createdAt: '', updatedAt: '',
  },
  {
    id: 'pl_2', productId: 'p_led_panel', customerId: 'cus_abc', quantity: 500, unitPrice: 8.0, currency: 'USD',
    validFrom: '2026-10-01', validTo: '2026-12-31', createdAt: '', updatedAt: '',
  },
  {
    id: 'pl_3', productId: 'p_led_bulb', customerId: 'cus_abc', quantity: 1000, unitPrice: 1.45, currency: 'USD',
    validFrom: '2026-10-01', validTo: '2026-12-31', createdAt: '', updatedAt: '',
  },
  {
    id: 'pl_4', productId: 'p_led_panel', customerId: 'cus_global', quantity: 200, unitPrice: 8.2, currency: 'USD',
    validFrom: '2026-10-01', validTo: '2026-12-31', createdAt: '', updatedAt: '',
  },
];

export const seedWarehouses: Warehouse[] = [
  { id: 'wh_finished', code: 'FIN', name: '成品仓', type: 'finished', location: '深圳福永', active: true, remark: '成品存储', createdAt: '', updatedAt: '' },
  { id: 'wh_pending', code: 'PEND', name: '待运仓', type: 'pending_shipment', location: '深圳福永', active: true, remark: '已出库待装船', createdAt: '', updatedAt: '' },
  { id: 'wh_material', code: 'MAT', name: '物料仓', type: 'material', location: '东莞虎门', active: true, remark: '原材料与包材', createdAt: '', updatedAt: '' },
  { id: 'wh_overseas', code: 'OS', name: '海外仓(洛杉矶)', type: 'overseas', location: '美国洛杉矶', active: true, remark: '海外仓数据视图占位', createdAt: '', updatedAt: '' },
];
