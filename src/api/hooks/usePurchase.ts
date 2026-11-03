/**
 * 采购域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  suppliers,
  supplierQualifications,
  purchaseInquiries,
  priceCompares,
  purchaseOrders,
  poArrivals,
} from '../repository';
import type {
  Supplier,
  SupplierQualification,
  PurchaseInquiry,
  PriceCompare,
  PurchaseOrder,
  PoArrival,
} from '../../types';

// ===== 供应商 =====
export function useSuppliers(params?: { keyword?: string }) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => suppliers.list({ keyword: params?.keyword }),
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Supplier>) => suppliers.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      suppliers.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suppliers.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useSupplierQualifications(supplierId?: string) {
  return useQuery({
    queryKey: ['supplierQualifications', supplierId],
    queryFn: async () => {
      const res = await supplierQualifications.list();
      if (supplierId) {
        res.list = res.list.filter((q) => q.supplierId === supplierId);
      }
      return res.list;
    },
    enabled: !!supplierId,
  });
}

// ===== 采购询价 =====
export function usePurchaseInquiries(params?: { keyword?: string }) {
  return useQuery({
    queryKey: ['purchaseInquiries', params],
    queryFn: () => purchaseInquiries.list({ keyword: params?.keyword }),
  });
}

export function useCreatePurchaseInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PurchaseInquiry>) => purchaseInquiries.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseInquiries'] }),
  });
}

export function useUpdatePurchaseInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseInquiry> }) =>
      purchaseInquiries.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseInquiries'] }),
  });
}

// ===== 比价 =====
export function usePriceCompares(inquiryId?: string) {
  return useQuery({
    queryKey: ['priceCompares', inquiryId],
    queryFn: async () => {
      const res = await priceCompares.list();
      if (inquiryId) {
        return res.list.filter((p) => p.inquiryId === inquiryId);
      }
      return res.list;
    },
    enabled: !!inquiryId,
  });
}

export function useCreatePriceCompare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PriceCompare>) => priceCompares.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['priceCompares'] }),
  });
}

// ===== 采购订单 =====
export function usePurchaseOrders(params?: { keyword?: string; status?: string; supplierId?: string }) {
  return useQuery({
    queryKey: ['purchaseOrders', params],
    queryFn: async () => {
      const res = await purchaseOrders.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((o) => o.status === params.status);
      if (params?.supplierId) list = list.filter((o) => o.supplierId === params.supplierId);
      return { ...res, list };
    },
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PurchaseOrder>) => purchaseOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });
}

export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseOrder> }) =>
      purchaseOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });
}

export function useDeletePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseOrders.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseOrders'] }),
  });
}

// ===== 到货 =====
export function usePoArrivals(poId?: string) {
  return useQuery({
    queryKey: ['poArrivals', poId],
    queryFn: async () => {
      const res = await poArrivals.list();
      if (poId) {
        return res.list.filter((a) => a.poId === poId);
      }
      return res.list;
    },
    enabled: !!poId,
  });
}

export function useCreateArrival() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PoArrival>) => poArrivals.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['poArrivals'] }),
  });
}

export function useUpdateArrival() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PoArrival> }) =>
      poArrivals.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['poArrivals'] }),
  });
}
