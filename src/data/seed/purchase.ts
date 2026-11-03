/**
 * 种子数据：采购域（采购询价 / 比价 / 采购订单 / 到货）
 */

import type {
  PurchaseInquiry,
  PriceCompare,
  PurchaseOrder,
  PoArrival,
} from '../../types';

export const seedPurchaseInquiries: PurchaseInquiry[] = [
  {
    id: 'purinq_1',
    code: 'PIR-20261009-001',
    supplierId: 'sup_huayi',
    salesOrderId: 'so_1',
    items: [
      { productId: 'p_led_panel', productName: 'LED 面板灯 36W', quantity: 5000, unit: 'pcs' },
    ],
    totalAmount: 142500,
    currency: 'CNY',
    status: 'completed',
    inquiryDate: '2026-10-09',
    expectedDeliveryDate: '2026-11-20',
    remark: '由销售订单 SO-20261008-001 驱动',
    owner: '赵刚',
    createdAt: '2026-10-09T10:00:00.000Z',
    updatedAt: '2026-10-11T10:00:00.000Z',
  },
  {
    id: 'purinq_2',
    code: 'PIR-20261019-001',
    supplierId: 'sup_mingzhu',
    salesOrderId: 'so_2',
    items: [
      { productId: 'p_desk_lamp', productName: 'LED 护眼台灯 5W', quantity: 2000, unit: 'pcs' },
    ],
    totalAmount: 37000,
    currency: 'CNY',
    status: 'quoted',
    inquiryDate: '2026-10-19',
    expectedDeliveryDate: '2026-11-25',
    remark: '样品已确认，准备下单',
    owner: '赵刚',
    createdAt: '2026-10-19T10:00:00.000Z',
    updatedAt: '2026-10-19T10:00:00.000Z',
  },
];

export const seedPriceCompares: PriceCompare[] = [
  {
    id: 'pc_1',
    inquiryId: 'purinq_1',
    quotes: [
      { supplierId: 'sup_huayi', supplierName: '深圳市华艺照明有限公司', unitPrice: 28.5, taxRate: 13, totalPrice: 142500, currency: 'CNY', validTo: '2026-10-25', deliveryDays: 35, includeFreight: true, remark: '含运费到深圳仓' },
      { supplierId: 'sup_mingzhu', supplierName: '中山市明竹家居有限公司', unitPrice: 29.8, taxRate: 13, totalPrice: 149000, currency: 'CNY', validTo: '2026-10-25', deliveryDays: 40, includeFreight: false, remark: '不含运费' },
      { supplierId: 'sup_zhongke', supplierName: '东莞中科电子科技有限公司', unitPrice: 30.2, taxRate: 13, totalPrice: 151000, currency: 'CNY', validTo: '2026-10-25', deliveryDays: 30, includeFreight: false, remark: '交期较快但价高' },
    ],
    selectedSupplier: 'sup_huayi',
    status: 'completed',
    conclusion: '华艺价格最优且含运费，选定为供应商',
    createdBy: '赵刚',
    createdAt: '2026-10-10T10:00:00.000Z',
    updatedAt: '2026-10-11T10:00:00.000Z',
  },
];

export const seedPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_1',
    code: 'PO-20261011-001',
    supplierId: 'sup_huayi',
    salesOrderId: 'so_1',
    items: [
      {
        productId: 'p_led_panel', productName: 'LED 面板灯 36W', sku: 'LED-PNL-36W',
        quantity: 5000, unitPrice: 28.5, totalPrice: 142500,
        costPrice: 28.5, hsCode: '9405.42.0000', unit: 'pcs', remark: '',
      },
    ],
    totalAmount: 142500,
    currency: 'CNY',
    taxRate: 13,
    deliveryDate: '2026-11-20',
    status: 'in_production',
    inquiryId: 'purinq_1',
    owner: '赵刚',
    remark: '生产备货中',
    createdAt: '2026-10-11T10:00:00.000Z',
    updatedAt: '2026-10-28T10:00:00.000Z',
  },
  {
    id: 'po_2',
    code: 'PO-20261021-001',
    supplierId: 'sup_zhongke',
    salesOrderId: 'so_2',
    items: [
      {
        productId: 'p_power_supply', productName: 'LED 驱动电源 100W', sku: 'PWR-SUP-100W',
        quantity: 2000, unitPrice: 12.8, totalPrice: 25600,
        costPrice: 12.8, hsCode: '8504.40.9900', unit: 'pcs', remark: '台灯配套电源',
      },
      {
        productId: 'p_cable', productName: 'UL1061 电子线 24AWG', sku: 'CBL-UL1061-24AWG',
        quantity: 5000, unitPrice: 0.35, totalPrice: 1750,
        costPrice: 0.35, hsCode: '8544.42.0000', unit: 'm', remark: '',
      },
    ],
    totalAmount: 27350,
    currency: 'CNY',
    taxRate: 13,
    deliveryDate: '2026-11-18',
    status: 'confirmed',
    inquiryId: 'purinq_2',
    owner: '赵刚',
    remark: '台灯配套电源与线材采购',
    createdAt: '2026-10-21T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z',
  },
];

export const seedPoArrivals: PoArrival[] = [
  {
    id: 'arr_1',
    poId: 'po_1',
    items: [
      { productId: 'p_led_panel', productName: 'LED 面板灯 36W', expectedQty: 5000, arrivedQty: 5000, defectiveQty: 0, unit: 'pcs' },
    ],
    arrivedQty: 5000,
    defectiveQty: 0,
    status: 'completed',
    arrivalDate: '2026-11-19',
    receiver: '孙丽',
    defectiveRemark: '',
    createdAt: '2026-11-19T10:00:00.000Z',
    updatedAt: '2026-11-19T10:00:00.000Z',
  },
];
