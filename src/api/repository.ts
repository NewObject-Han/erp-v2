/**
 * 通用 CRUD 仓库 + 各资源实例
 *
 * 基于 localStorage transport 的 CRUD 客户端
 * 接口形状与将来真实后端一致（list/get/create/update/delete/batchDelete）
 */

import { createStorageCrud } from './client';
import type {
  Inquiry,
  Quotation,
  SampleOrder,
  PiDoc,
  SalesOrder,
  PurchaseInquiry,
  PriceCompare,
  PurchaseOrder,
  PoArrival,
  TrackingOrder,
  TrackingNode,
  TrackingException,
  Booking,
  CustomsDeclaration,
  Document,
  LogisticsTrack,
  Inventory,
  InboundOrder,
  OutboundOrder,
  TransferOrder,
  StocktakeOrder,
  StockAlert,
  ARInvoice,
  APInvoice,
  CostAnalysis,
  ExpenseRecord,
  RefundDeclaration,
  VATRecord,
  FxVerification,
  LcDoc,
  User,
  Role,
  Permission,
  Product,
  ProductCategory,
  Incoterm,
  Currency,
  ExchangeRate,
  PriceListItem,
  Customer,
  FollowUp,
  Opportunity,
  CustomerCredit,
  Supplier,
  SupplierQualification,
  Warehouse,
  AiCallLog,
  OperationLog,
  ApprovalRecord,
} from '../types';

/** 通用 CRUD 工厂 */
function crud<T extends { id: string }>(resource: string) {
  return createStorageCrud<T>(resource);
}

// ===== 主数据 =====
export const categories = crud<ProductCategory>('categories');
export const products = crud<Product>('products');
export const incoterms = crud<Incoterm>('incoterms');
export const currencies = crud<Currency>('currencies');
export const exchangeRates = crud<ExchangeRate>('exchangeRates');
export const priceLists = crud<PriceListItem>('priceLists');

// ===== 客户与供应商 =====
export const customers = crud<Customer>('customers');
export const followUps = crud<FollowUp>('followUps');
export const opportunities = crud<Opportunity>('opportunities');
export const customerCredits = crud<CustomerCredit>('customerCredits');
export const suppliers = crud<Supplier>('suppliers');
export const supplierQualifications = crud<SupplierQualification>('supplierQualifications');

// ===== 仓储主数据 =====
export const warehouses = crud<Warehouse>('warehouses');

// ===== 销售域 =====
export const inquiries = crud<Inquiry>('inquiries');
export const quotations = crud<Quotation>('quotations');
export const sampleOrders = crud<SampleOrder>('sampleOrders');
export const piDocs = crud<PiDoc>('piDocs');
export const salesOrders = crud<SalesOrder>('salesOrders');

// ===== 采购域 =====
export const purchaseInquiries = crud<PurchaseInquiry>('purchaseInquiries');
export const priceCompares = crud<PriceCompare>('priceCompares');
export const purchaseOrders = crud<PurchaseOrder>('purchaseOrders');
export const poArrivals = crud<PoArrival>('poArrivals');

// ===== 跟单域 =====
export const trackingOrders = crud<TrackingOrder>('trackingOrders');
export const trackingNodes = crud<TrackingNode>('trackingNodes');
export const trackingExceptions = crud<TrackingException>('trackingExceptions');

// ===== 物流单证 =====
export const bookings = crud<Booking>('bookings');
export const customsDeclarations = crud<CustomsDeclaration>('customsDeclarations');
export const documents = crud<Document>('documents');
export const logisticsTracks = crud<LogisticsTrack>('logisticsTracks');

// ===== 仓储 =====
export const inventories = crud<Inventory>('inventories');
export const inboundOrders = crud<InboundOrder>('inboundOrders');
export const outboundOrders = crud<OutboundOrder>('outboundOrders');
export const transferOrders = crud<TransferOrder>('transferOrders');
export const stocktakeOrders = crud<StocktakeOrder>('stocktakeOrders');
export const stockAlerts = crud<StockAlert>('stockAlerts');

// ===== 财务 =====
export const arInvoices = crud<ARInvoice>('arInvoices');
export const apInvoices = crud<APInvoice>('apInvoices');
export const costAnalyses = crud<CostAnalysis>('costAnalyses');
export const expenseRecords = crud<ExpenseRecord>('expenseRecords');

// ===== 税务外汇 =====
export const refundDeclarations = crud<RefundDeclaration>('refundDeclarations');
export const vatRecords = crud<VATRecord>('vatRecords');
export const fxVerifications = crud<FxVerification>('fxVerifications');
export const lcDocs = crud<LcDoc>('lcDocs');

// ===== 系统 =====
export const users = crud<User>('users');
export const roles = crud<Role>('roles');
export const permissions = crud<Permission>('permissions');
export const operationLogs = crud<OperationLog>('operationLogs');

// ===== 审批工作流 =====
export const approvals = crud<ApprovalRecord>('approvals');

// ===== AI =====
export const aiCallLogs = crud<AiCallLog>('aiCallLogs');
