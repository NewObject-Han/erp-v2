/**
 * 仓储域 hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  warehouses,
  inventories,
  inboundOrders,
  outboundOrders,
  transferOrders,
  stocktakeOrders,
  stockAlerts,
} from '../repository';
import type {
  Warehouse,
  Inventory,
  InboundOrder,
  OutboundOrder,
  TransferOrder,
  StocktakeOrder,
  StockAlert,
} from '../../types';

export function useWarehouses() {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouses.all(),
  });
}

export function useInventories(params?: { warehouseId?: string; productId?: string }) {
  return useQuery({
    queryKey: ['inventories', params],
    queryFn: async () => {
      const res = await inventories.list();
      let list = res.list;
      if (params?.warehouseId) list = list.filter((i) => i.warehouseId === params.warehouseId);
      if (params?.productId) list = list.filter((i) => i.productId === params.productId);
      return list;
    },
  });
}

export function useCreateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Inventory>) => inventories.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventories'] }),
  });
}

export function useUpdateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inventory> }) =>
      inventories.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventories'] }),
  });
}

export function useInboundOrders() {
  return useQuery({
    queryKey: ['inboundOrders'],
    queryFn: () => inboundOrders.list(),
  });
}

export function useCreateInbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<InboundOrder>) => inboundOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inboundOrders'] }),
  });
}

export function useUpdateInbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InboundOrder> }) =>
      inboundOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inboundOrders'] }),
  });
}

export function useOutboundOrders() {
  return useQuery({
    queryKey: ['outboundOrders'],
    queryFn: () => outboundOrders.list(),
  });
}

export function useCreateOutbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<OutboundOrder>) => outboundOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outboundOrders'] }),
  });
}

export function useUpdateOutbound() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OutboundOrder> }) =>
      outboundOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outboundOrders'] }),
  });
}

export function useTransferOrders() {
  return useQuery({
    queryKey: ['transferOrders'],
    queryFn: () => transferOrders.list(),
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TransferOrder>) => transferOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transferOrders'] }),
  });
}

export function useUpdateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransferOrder> }) =>
      transferOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transferOrders'] }),
  });
}

export function useStocktakeOrders() {
  return useQuery({
    queryKey: ['stocktakeOrders'],
    queryFn: () => stocktakeOrders.list(),
  });
}

export function useCreateStocktake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<StocktakeOrder>) => stocktakeOrders.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stocktakeOrders'] }),
  });
}

export function useUpdateStocktake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StocktakeOrder> }) =>
      stocktakeOrders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stocktakeOrders'] }),
  });
}

export function useStockAlerts(warehouseId?: string) {
  return useQuery({
    queryKey: ['stockAlerts', warehouseId],
    queryFn: async () => {
      const res = await stockAlerts.list();
      if (warehouseId) {
        return res.list.filter((a) => a.warehouseId === warehouseId);
      }
      return res.list;
    },
  });
}

export function useCreateStockAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<StockAlert>) => stockAlerts.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stockAlerts'] }),
  });
}

export function useUpdateStockAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockAlert> }) =>
      stockAlerts.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stockAlerts'] }),
  });
}
