/**
 * 销售域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  inquiries,
  quotations,
  sampleOrders,
  piDocs,
  salesOrders,
} from '../repository';
import type {
  Inquiry,
  Quotation,
  SampleOrder,
  PiDoc,
  SalesOrder,
} from '../../types';

// ===== 询盘 =====
export function useInquiries(params?: { keyword?: string; status?: string }) {
  return useQuery({
    queryKey: ['inquiries', params],
    queryFn: async () => {
      const res = await inquiries.list({ keyword: params?.keyword });
      if (params?.status) {
        res.list = res.list.filter((i) => i.status === params.status);
      }
      return res;
    },
  });
}

export function useInquiry(id?: string) {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => (id ? inquiries.get(id) : null),
    enabled: !!id,
  });
}

export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Inquiry>) => inquiries.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  });
}

export function useUpdateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inquiry> }) =>
      inquiries.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  });
}

export function useDeleteInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inquiries.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  });
}

// ===== 报价 =====
export function useQuotations(params?: { keyword?: string; status?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['quotations', params],
    queryFn: async () => {
      const res = await quotations.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((q) => q.status === params.status);
      if (params?.customerId) list = list.filter((q) => q.customerId === params.customerId);
      return { ...res, list };
    },
  });
}

export function useQuotation(id?: string) {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => (id ? quotations.get(id) : null),
    enabled: !!id,
  });
}

export function useCreateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Quotation>) => quotations.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
}

export function useUpdateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quotation> }) =>
      quotations.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
}

export function useDeleteQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quotations.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
}

// ===== 样品 =====
export function useSampleOrders(params?: { keyword?: string }) {
  return useQuery({
    queryKey: ['sampleOrders', params],
    queryFn: () => sampleOrders.list({ keyword: params?.keyword }),
  });
}

export function useCreateSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SampleOrder>) => sampleOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sampleOrders'] }),
  });
}

export function useUpdateSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SampleOrder> }) =>
      sampleOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sampleOrders'] }),
  });
}

export function useDeleteSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sampleOrders.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sampleOrders'] }),
  });
}

// ===== PI =====
export function usePiDocs(params?: { keyword?: string }) {
  return useQuery({
    queryKey: ['piDocs', params],
    queryFn: () => piDocs.list({ keyword: params?.keyword }),
  });
}

export function useCreatePi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PiDoc>) => piDocs.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['piDocs'] }),
  });
}

export function useUpdatePi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PiDoc> }) =>
      piDocs.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['piDocs'] }),
  });
}

export function useDeletePi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => piDocs.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['piDocs'] }),
  });
}

// ===== 销售订单 =====
export function useSalesOrders(params?: { keyword?: string; status?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['salesOrders', params],
    queryFn: async () => {
      const res = await salesOrders.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((o) => o.status === params.status);
      if (params?.customerId) list = list.filter((o) => o.customerId === params.customerId);
      return { ...res, list };
    },
  });
}

export function useSalesOrder(id?: string) {
  return useQuery({
    queryKey: ['salesOrder', id],
    queryFn: async () => (id ? salesOrders.get(id) : null),
    enabled: !!id,
  });
}

export function useCreateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SalesOrder>) => salesOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salesOrders'] }),
  });
}

export function useUpdateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesOrder> }) =>
      salesOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salesOrders'] }),
  });
}

export function useDeleteSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesOrders.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salesOrders'] }),
  });
}
