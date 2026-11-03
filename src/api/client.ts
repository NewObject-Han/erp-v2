/**
 * API 核心 Transport 层
 *
 * demo 阶段：localStorage 读写
 * 真实后端阶段：替换为 fetch/axios 调用（接口形状保持一致）
 */

import type { ApiResponse, PageQuery, PageResult } from '../types/common';
import { LS_KEY_PREFIX } from '../utils/constants';

/** 资源键名映射 */
export type ResourceKey =
  | 'categories'
  | 'products'
  | 'incoterms'
  | 'currencies'
  | 'exchangeRates'
  | 'priceLists'
  | 'customers'
  | 'followUps'
  | 'opportunities'
  | 'customerCredits'
  | 'suppliers'
  | 'supplierQualifications'
  | 'warehouses'
  | 'inquiries'
  | 'quotations'
  | 'sampleOrders'
  | 'piDocs'
  | 'salesOrders'
  | 'purchaseInquiries'
  | 'priceCompares'
  | 'purchaseOrders'
  | 'poArrivals'
  | 'trackingOrders'
  | 'trackingNodes'
  | 'trackingExceptions'
  | 'bookings'
  | 'customsDeclarations'
  | 'documents'
  | 'logisticsTracks'
  | 'inventories'
  | 'inboundOrders'
  | 'outboundOrders'
  | 'transferOrders'
  | 'stocktakeOrders'
  | 'stockAlerts'
  | 'arInvoices'
  | 'apInvoices'
  | 'costAnalyses'
  | 'expenseRecords'
  | 'refundDeclarations'
  | 'vatRecords'
  | 'fxVerifications'
  | 'lcDocs'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'operationLogs'
  | 'aiCallLogs';

const storageKey = (resource: string): string => `${LS_KEY_PREFIX}:data:${resource}`;

/** 模拟网络延迟（demo 体验） */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 从 localStorage 读取资源数组 */
export function storageRead<T>(resource: string): T[] {
  try {
    const raw = localStorage.getItem(storageKey(resource));
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

/** 写入 localStorage */
export function storageWrite<T>(resource: string, data: T[]): void {
  localStorage.setItem(storageKey(resource), JSON.stringify(data));
}

/** 清空所有业务数据（保留用户与角色） */
export function storageClearBusiness(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(`${LS_KEY_PREFIX}:data:`) && !k.includes('users') && !k.includes('roles') && !k.includes('permissions'))
    .forEach((k) => localStorage.removeItem(k));
}

/** 生成后端响应包装（为将来后端预留，demo 直接返回 data） */
function ok<T>(data: T, total?: number): Promise<ApiResponse<T>> {
  return Promise.resolve({
    code: 200,
    data,
    message: 'ok',
    total,
  });
}

/**
 * 通用 CRUD 客户端（基于 localStorage transport）
 *
 * 真实后端切换时：保留接口签名，将内部实现替换为 fetch 调用即可
 */
export function createStorageCrud<T extends { id: string }>(resource: string) {
  return {
    async list(params: PageQuery = {}): Promise<PageResult<T>> {
      await delay(120);
      const all = storageRead<T>(resource);
      const keyword = params.keyword?.toString().toLowerCase();
      let filtered = all;
      if (keyword) {
        filtered = all.filter((item) =>
          JSON.stringify(item).toLowerCase().includes(keyword),
        );
      }
      const total = filtered.length;
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 50;
      const start = (page - 1) * pageSize;
      const list = filtered.slice(start, start + pageSize);
      return { list, total, page, pageSize };
    },

    async get(id: string): Promise<T> {
      await delay(80);
      const all = storageRead<T>(resource);
      const found = all.find((item) => item.id === id);
      if (!found) throw new Error(`资源不存在: ${resource}/${id}`);
      return found;
    },

    async create(data: Partial<T>): Promise<T> {
      await delay(150);
      const all = storageRead<T>(resource);
      const now = new Date().toISOString();
      const entity = {
        ...(data as object),
        id: data.id ?? cryptoRandomId(),
        createdAt: data.createdAt ?? now,
        updatedAt: now,
      } as T;
      all.push(entity);
      storageWrite(resource, all);
      return entity;
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      await delay(150);
      const all = storageRead<T>(resource);
      const idx = all.findIndex((item) => item.id === id);
      if (idx === -1) throw new Error(`资源不存在: ${resource}/${id}`);
      all[idx] = { ...all[idx], ...data, id, updatedAt: new Date().toISOString() };
      storageWrite(resource, all);
      return all[idx];
    },

    async delete(id: string): Promise<void> {
      await delay(100);
      const all = storageRead<T>(resource);
      storageWrite(resource, all.filter((item) => item.id !== id));
    },

    async batchDelete(ids: string[]): Promise<void> {
      await delay(150);
      const all = storageRead<T>(resource);
      storageWrite(resource, all.filter((item) => !ids.includes(item.id)));
    },

    /** 直接读写（供种子数据装载 / 联调更新使用） */
    async replaceAll(data: T[]): Promise<void> {
      storageWrite(resource, data);
    },

    async all(): Promise<T[]> {
      await delay(50);
      return storageRead<T>(resource);
    },
  };
}

/** 随机 ID */
function cryptoRandomId(): string {
  return `id_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export { ok as wrapResponse };
export type { ApiResponse };
