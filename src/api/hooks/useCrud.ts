/**
 * 通用 CRUD React Query hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { PageQuery } from '../../types/common';
import { createStorageCrud } from '../client';

/** 通用 list hook */
export function useList<T extends { id: string }>(resource: string, params?: PageQuery) {
  return useQuery({
    queryKey: ['list', resource, params],
    queryFn: async () => {
      const client = createStorageCrud<T>(resource);
      return client.list(params);
    },
  });
}

/** 通用 get hook */
export function useGet<T extends { id: string }>(resource: string, id: string | undefined) {
  return useQuery({
    queryKey: ['get', resource, id],
    queryFn: async () => {
      const client = createStorageCrud<T>(resource);
      return client.get(id as string);
    },
    enabled: !!id,
  });
}

/** 通用 create hook */
export function useCreate<T extends { id: string }>(resource: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const client = createStorageCrud<T>(resource);
      return client.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['list', resource] });
    },
  });
}

/** 通用 update hook */
export function useUpdate<T extends { id: string }>(resource: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const client = createStorageCrud<T>(resource);
      return client.update(id, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['list', resource] });
      qc.invalidateQueries({ queryKey: ['get', resource] });
    },
  });
}

/** 通用 delete hook */
export function useDelete<T extends { id: string }>(resource: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const client = createStorageCrud<T>(resource);
      return client.delete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['list', resource] });
    },
  });
}

/** 通用 batchDelete hook */
export function useBatchDelete<T extends { id: string }>(resource: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const client = createStorageCrud<T>(resource);
      return client.batchDelete(ids);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['list', resource] });
    },
  });
}
