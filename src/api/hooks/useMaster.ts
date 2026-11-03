/**
 * 主数据域 hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  categories,
  products,
  incoterms,
  currencies,
  exchangeRates,
  priceLists,
} from '../repository';
import type {
  Product,
  ProductCategory,
  Incoterm,
  Currency,
  ExchangeRate,
  PriceListItem,
} from '../../types';

// ===== 商品分类 =====
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categories.all(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProductCategory>) => categories.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductCategory> }) =>
      categories.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categories.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

// ===== 商品 =====
export function useProducts(params?: { keyword?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => products.list({ keyword: params?.keyword }),
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => (id ? products.get(id) : null),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => products.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      products.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => products.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

// ===== 贸易术语 =====
export function useIncoterms() {
  return useQuery({
    queryKey: ['incoterms'],
    queryFn: () => incoterms.all(),
  });
}

export function useCreateIncoterm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Incoterm>) => incoterms.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incoterms'] }),
  });
}

export function useUpdateIncoterm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Incoterm> }) =>
      incoterms.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incoterms'] }),
  });
}

export function useDeleteIncoterm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incoterms.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incoterms'] }),
  });
}

// ===== 币种 =====
export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: () => currencies.all(),
  });
}

export function useCreateCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Currency>) => currencies.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['currencies'] }),
  });
}

export function useUpdateCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Currency> }) =>
      currencies.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['currencies'] }),
  });
}

export function useDeleteCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => currencies.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['currencies'] }),
  });
}

// ===== 汇率 =====
export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => exchangeRates.all(),
  });
}

export function useCreateExchangeRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExchangeRate>) => exchangeRates.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exchangeRates'] }),
  });
}

export function useUpdateExchangeRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExchangeRate> }) =>
      exchangeRates.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exchangeRates'] }),
  });
}

export function useDeleteExchangeRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => exchangeRates.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exchangeRates'] }),
  });
}

// ===== 价格矩阵 =====
export function usePriceList(params?: { keyword?: string }) {
  return useQuery({
    queryKey: ['priceList', params],
    queryFn: () => priceLists.list({ keyword: params?.keyword }),
  });
}

export function useCreatePriceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PriceListItem>) => priceLists.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['priceList'] }),
  });
}

export function useUpdatePriceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PriceListItem> }) =>
      priceLists.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['priceList'] }),
  });
}

export function useDeletePriceItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceLists.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['priceList'] }),
  });
}
