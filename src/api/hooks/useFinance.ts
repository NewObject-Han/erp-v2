/**
 * 财务域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  arInvoices,
  apInvoices,
  costAnalyses,
  expenseRecords,
} from '../repository';
import type {
  ARInvoice,
  APInvoice,
  CostAnalysis,
  ExpenseRecord,
} from '../../types';

export function useReceivables(params?: { keyword?: string; status?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['receivables', params],
    queryFn: async () => {
      const res = await arInvoices.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((a) => a.status === params.status);
      if (params?.customerId) list = list.filter((a) => a.customerId === params.customerId);
      return { ...res, list };
    },
  });
}

export function useCreateReceivable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ARInvoice>) => arInvoices.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receivables'] }),
  });
}

export function useUpdateReceivable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ARInvoice> }) =>
      arInvoices.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receivables'] }),
  });
}

export function useDeleteReceivable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => arInvoices.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receivables'] }),
  });
}

export function usePayables(params?: { keyword?: string; status?: string; supplierId?: string }) {
  return useQuery({
    queryKey: ['payables', params],
    queryFn: async () => {
      const res = await apInvoices.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((a) => a.status === params.status);
      if (params?.supplierId) list = list.filter((a) => a.supplierId === params.supplierId);
      return { ...res, list };
    },
  });
}

export function useCreatePayable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<APInvoice>) => apInvoices.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payables'] }),
  });
}

export function useUpdatePayable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<APInvoice> }) =>
      apInvoices.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payables'] }),
  });
}

export function useDeletePayable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apInvoices.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payables'] }),
  });
}

export function useCostAnalyses(salesOrderId?: string) {
  return useQuery({
    queryKey: ['costAnalyses', salesOrderId],
    queryFn: async () => {
      const res = await costAnalyses.list();
      if (salesOrderId) {
        return res.list.filter((c) => c.salesOrderId === salesOrderId);
      }
      return res.list;
    },
  });
}

export function useCreateCostAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CostAnalysis>) => costAnalyses.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['costAnalyses'] }),
  });
}

export function useUpdateCostAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CostAnalysis> }) =>
      costAnalyses.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['costAnalyses'] }),
  });
}

export function useExpenses(params?: { keyword?: string; status?: string }) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const res = await expenseRecords.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((e) => e.status === params.status);
      return { ...res, list };
    },
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExpenseRecord>) => expenseRecords.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseRecord> }) =>
      expenseRecords.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseRecords.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}
