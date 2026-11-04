/**
 * 全局搜索数据：客户 / 商品 / 供应商 / 销售订单 / 采购订单
 * 供 Header 全局搜索与 Ctrl+K 命令面板共用
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customers, products, suppliers, salesOrders, purchaseOrders } from '../repository';

export interface SearchItem {
  /** 实体 id（选中值） */
  value: string;
  /** 展示文案，如：客户 · ABC Trading */
  label: string;
  /** 点击跳转路径 */
  path: string;
}

async function fetchAll<T extends { id: string }>(repo: { all: () => Promise<T[]> }): Promise<T[]> {
  try {
    return await repo.all();
  } catch {
    return [];
  }
}

/** 关键词 → 匹配条目（空关键词返回空数组） */
export function useSearchItems(keyword: string): SearchItem[] {
  const kw = keyword.trim().toLowerCase();

  const { data: cusList } = useQuery({ queryKey: ['gsearch', 'customers'], queryFn: () => fetchAll(customers), staleTime: 60_000 });
  const { data: prodList } = useQuery({ queryKey: ['gsearch', 'products'], queryFn: () => fetchAll(products), staleTime: 60_000 });
  const { data: supList } = useQuery({ queryKey: ['gsearch', 'suppliers'], queryFn: () => fetchAll(suppliers), staleTime: 60_000 });
  const { data: soList } = useQuery({ queryKey: ['gsearch', 'salesOrders'], queryFn: () => fetchAll(salesOrders), staleTime: 60_000 });
  const { data: poList } = useQuery({ queryKey: ['gsearch', 'purchaseOrders'], queryFn: () => fetchAll(purchaseOrders), staleTime: 60_000 });

  return useMemo(() => {
    if (!kw) return [];
    const match = (s: unknown) => String(s ?? '').toLowerCase().includes(kw);

    const items: SearchItem[] = [];
    (cusList ?? []).forEach((c: { id: string; name?: string }) => {
      if (match(c.name)) items.push({ value: c.id, label: `客户 · ${c.name}`, path: '/crm' });
    });
    (prodList ?? []).forEach((p: { id: string; name?: string; sku?: string }) => {
      if (match(p.name) || match(p.sku)) items.push({ value: p.id, label: `商品 · ${p.name}${p.sku ? ` (${p.sku})` : ''}`, path: '/master' });
    });
    (supList ?? []).forEach((s: { id: string; name?: string }) => {
      if (match(s.name)) items.push({ value: s.id, label: `供应商 · ${s.name}`, path: '/crm' });
    });
    (soList ?? []).forEach((o: { id: string; code?: string }) => {
      if (match(o.code)) items.push({ value: o.id, label: `销售订单 · ${o.code}`, path: '/sales' });
    });
    (poList ?? []).forEach((o: { id: string; code?: string }) => {
      if (match(o.code)) items.push({ value: o.id, label: `采购订单 · ${o.code}`, path: '/purchase' });
    });
    return items.slice(0, 12);
  }, [kw, cusList, prodList, supList, soList, poList]);
}
