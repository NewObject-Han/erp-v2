/**
 * 税务外汇域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  refundDeclarations,
  vatRecords,
  fxVerifications,
  lcDocs,
} from '../repository';
import type {
  RefundDeclaration,
  VATRecord,
  FxVerification,
  LcDoc,
} from '../../types';

export function useRefunds(params?: { keyword?: string; status?: string }) {
  return useQuery({
    queryKey: ['refunds', params],
    queryFn: async () => {
      const res = await refundDeclarations.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((r) => r.status === params.status);
      return { ...res, list };
    },
  });
}

export function useCreateRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RefundDeclaration>) => refundDeclarations.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['refunds'] }),
  });
}

export function useUpdateRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RefundDeclaration> }) =>
      refundDeclarations.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['refunds'] }),
  });
}

export function useVatRecords(params?: { type?: string; period?: string }) {
  return useQuery({
    queryKey: ['vatRecords', params],
    queryFn: async () => {
      const res = await vatRecords.list();
      let list = res.list;
      if (params?.type) list = list.filter((v) => v.type === params.type);
      if (params?.period) list = list.filter((v) => v.period === params.period);
      return list;
    },
  });
}

export function useCreateVat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<VATRecord>) => vatRecords.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vatRecords'] }),
  });
}

export function useUpdateVat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VATRecord> }) =>
      vatRecords.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vatRecords'] }),
  });
}

export function useFxVerifications(params?: { keyword?: string; status?: string }) {
  return useQuery({
    queryKey: ['fxVerifications', params],
    queryFn: async () => {
      const res = await fxVerifications.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((f) => f.status === params.status);
      return { ...res, list };
    },
  });
}

export function useCreateFx() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FxVerification>) => fxVerifications.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fxVerifications'] }),
  });
}

export function useUpdateFx() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FxVerification> }) =>
      fxVerifications.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fxVerifications'] }),
  });
}

export function useLcDocs(params?: { keyword?: string; status?: string }) {
  return useQuery({
    queryKey: ['lcDocs', params],
    queryFn: async () => {
      const res = await lcDocs.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((l) => l.status === params.status);
      return { ...res, list };
    },
  });
}

export function useCreateLc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LcDoc>) => lcDocs.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lcDocs'] }),
  });
}

export function useUpdateLc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LcDoc> }) =>
      lcDocs.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lcDocs'] }),
  });
}

export function useDeleteLc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lcDocs.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lcDocs'] }),
  });
}
