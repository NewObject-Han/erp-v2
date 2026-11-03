/**
 * 物流单证域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bookings,
  customsDeclarations,
  documents,
  logisticsTracks,
} from '../repository';
import type { Booking, CustomsDeclaration, Document, LogisticsTrack } from '../../types';

export function useBookings(salesOrderId?: string) {
  return useQuery({
    queryKey: ['bookings', salesOrderId],
    queryFn: async () => {
      const res = await bookings.list();
      if (salesOrderId) {
        return res.list.filter((b) => b.salesOrderId === salesOrderId);
      }
      return res.list;
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Booking>) => bookings.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) =>
      bookings.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookings.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCustoms(salesOrderId?: string) {
  return useQuery({
    queryKey: ['customs', salesOrderId],
    queryFn: async () => {
      const res = await customsDeclarations.list();
      if (salesOrderId) {
        return res.list.filter((c) => c.salesOrderId === salesOrderId);
      }
      return res.list;
    },
  });
}

export function useCreateCustoms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CustomsDeclaration>) => customsDeclarations.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customs'] }),
  });
}

export function useUpdateCustoms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomsDeclaration> }) =>
      customsDeclarations.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customs'] }),
  });
}

export function useDocuments(salesOrderId?: string) {
  return useQuery({
    queryKey: ['documents', salesOrderId],
    queryFn: async () => {
      const res = await documents.list();
      if (salesOrderId) {
        return res.list.filter((d) => d.salesOrderId === salesOrderId);
      }
      return res.list;
    },
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Document>) => documents.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Document> }) =>
      documents.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documents.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
}

export function useLogisticsTrack(bookingId?: string) {
  return useQuery({
    queryKey: ['logisticsTrack', bookingId],
    queryFn: async () => {
      const res = await logisticsTracks.list();
      if (bookingId) {
        return res.list.filter((t) => t.bookingId === bookingId);
      }
      return res.list;
    },
  });
}

export function useCreateLogisticsTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LogisticsTrack>) => logisticsTracks.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logisticsTrack'] }),
  });
}

export function useUpdateLogisticsTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LogisticsTrack> }) =>
      logisticsTracks.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logisticsTrack'] }),
  });
}
