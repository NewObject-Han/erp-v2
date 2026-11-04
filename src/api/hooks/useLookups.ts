/**
 * 实体名称映射 hook
 *
 * 将各页面表格中的原始 ID（customerId/productId/supplierId 等）
 * 映射为可读名称，避免 UI 出现 "cus_abc" 这类技术 ID。
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  customers,
  products,
  suppliers,
  salesOrders,
  purchaseOrders,
  warehouses,
} from '../repository';
import type { Product } from '../../types';

export interface LookupOption {
  value: string;
  label: string;
}

export interface EntityLookups {
  customerName: (id: unknown) => string;
  productName: (id: unknown) => string;
  supplierName: (id: unknown) => string;
  salesOrderCode: (id: unknown) => string;
  purchaseOrderCode: (id: unknown) => string;
  warehouseName: (id: unknown) => string;
  /** 下拉选项（供表单 Select 使用） */
  customerOptions: LookupOption[];
  productOptions: LookupOption[];
  supplierOptions: LookupOption[];
  salesOrderOptions: LookupOption[];
  warehouseOptions: LookupOption[];
  /** 商品原始列表（明细行编辑器带出 SKU/HS 编码等字段） */
  productsRaw: Product[];
}

async function fetchAll<T extends { id: string }>(
  repo: { all: () => Promise<T[]> },
): Promise<T[]> {
  try {
    return await repo.all();
  } catch {
    return [];
  }
}

/** 全局名称映射（一次加载，各页面共用） */
export function useLookups(): EntityLookups {
  const { data: cusList } = useQuery({
    queryKey: ['lookups', 'customers'],
    queryFn: () => fetchAll(customers),
    staleTime: 60_000,
  });
  const { data: prodList } = useQuery({
    queryKey: ['lookups', 'products'],
    queryFn: () => fetchAll(products),
    staleTime: 60_000,
  });
  const { data: supList } = useQuery({
    queryKey: ['lookups', 'suppliers'],
    queryFn: () => fetchAll(suppliers),
    staleTime: 60_000,
  });
  const { data: soList } = useQuery({
    queryKey: ['lookups', 'salesOrders'],
    queryFn: () => fetchAll(salesOrders),
    staleTime: 60_000,
  });
  const { data: poList } = useQuery({
    queryKey: ['lookups', 'purchaseOrders'],
    queryFn: () => fetchAll(purchaseOrders),
    staleTime: 60_000,
  });
  const { data: whList } = useQuery({
    queryKey: ['lookups', 'warehouses'],
    queryFn: () => fetchAll(warehouses),
    staleTime: 60_000,
  });

  return useMemo(() => {
    const nameMap = <T extends { id: string; name?: string; code?: string }>(
      list: T[] | undefined,
      fallback: string,
    ) => {
      const map = new Map<string, string>();
      (list ?? []).forEach((item) => {
        map.set(item.id, item.name ?? item.code ?? item.id);
      });
      return (id: unknown): string => {
        if (id == null || id === '') return '—';
        return map.get(String(id)) ?? `${String(id)}${fallback}`;
      };
    };

    const codeMap = <T extends { id: string; code?: string }>(list: T[] | undefined) => {
      const map = new Map<string, string>();
      (list ?? []).forEach((item) => {
        if (item.code) map.set(item.id, item.code);
      });
      return (id: unknown): string => {
        if (id == null || id === '') return '—';
        return map.get(String(id)) ?? String(id);
      };
    };

    const toOptions = <T extends { id: string; name?: string; code?: string }>(
      list: T[] | undefined,
    ): LookupOption[] =>
      (list ?? []).map((item) => ({
        value: item.id,
        label: item.name ?? item.code ?? item.id,
      }));

    const toCodeOptions = <T extends { id: string; code?: string }>(
      list: T[] | undefined,
    ): LookupOption[] =>
      (list ?? []).filter((item) => item.code).map((item) => ({
        value: item.id,
        label: item.code as string,
      }));

    return {
      customerName: nameMap(cusList, ''),
      productName: nameMap(prodList, ''),
      supplierName: nameMap(supList, ''),
      salesOrderCode: codeMap(soList),
      purchaseOrderCode: codeMap(poList),
      warehouseName: nameMap(whList, ''),
      customerOptions: toOptions(cusList),
      productOptions: toOptions(prodList),
      supplierOptions: toOptions(supList),
      salesOrderOptions: toCodeOptions(soList),
      warehouseOptions: toOptions(whList),
      productsRaw: (prodList ?? []) as Product[],
    };
  }, [cusList, prodList, supList, soList, poList, whList]);
}
