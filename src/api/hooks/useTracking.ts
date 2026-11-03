/**
 * 跟单域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  trackingOrders,
  trackingNodes,
  trackingExceptions,
} from '../repository';
import type { TrackingOrder, TrackingNode, TrackingException } from '../../types';

export function useTrackingOrders(salesOrderId?: string) {
  return useQuery({
    queryKey: ['trackingOrders', salesOrderId],
    queryFn: async () => {
      const res = await trackingOrders.list();
      if (salesOrderId) {
        return res.list.filter((o) => o.salesOrderId === salesOrderId);
      }
      return res.list;
    },
    enabled: !!salesOrderId,
  });
}

export function useTrackingNodes(orderId?: string) {
  return useQuery({
    queryKey: ['trackingNodes', orderId],
    queryFn: async () => {
      const res = await trackingNodes.list();
      if (orderId) {
        return res.list.filter((n) => n.orderId === orderId);
      }
      return res.list;
    },
  });
}

export function useCreateTrackingNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrackingNode>) => trackingNodes.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trackingNodes'] }),
  });
}

export function useUpdateTrackingNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrackingNode> }) =>
      trackingNodes.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trackingNodes'] }),
  });
}

export function useCreateTrackingOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrackingOrder>) => trackingOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trackingOrders'] }),
  });
}

export function useUpdateTrackingOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrackingOrder> }) =>
      trackingOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trackingOrders'] }),
  });
}

export function useTrackingExceptions(orderId?: string) {
  return useQuery({
    queryKey: ['trackingExceptions', orderId],
    queryFn: async () => {
      const res = await trackingExceptions.list();
      if (orderId) {
        return res.list.filter((e) => e.orderId === orderId);
      }
      return res.list;
    },
  });
}

export function useCreateException() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrackingException>) => trackingExceptions.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trackingExceptions'] }),
  });
}

export function useUpdateException() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrackingException> }) =>
      trackingExceptions.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trackingExceptions'] }),
  });
}
