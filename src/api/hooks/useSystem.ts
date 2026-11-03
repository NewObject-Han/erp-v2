/**
 * 系统域 hooks + 客户与供应商（CRM）hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  users,
  roles,
  permissions,
  customers,
  followUps,
  opportunities,
  customerCredits,
  supplierQualifications,
} from '../repository';
import type {
  User,
  Role,
  Permission,
  Customer,
  FollowUp,
  Opportunity,
  CustomerCredit,
  SupplierQualification,
} from '../../types';

// ===== 用户 =====
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => users.all(),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => users.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      users.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => users.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// ===== 角色 =====
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => roles.all(),
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Role>) => roles.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
      roles.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roles.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
}

// ===== 权限 =====
export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissions.all(),
  });
}

// ===== 客户 =====
export function useCustomers(params?: { keyword?: string; status?: string }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const res = await customers.list({ keyword: params?.keyword });
      let list = res.list;
      if (params?.status) list = list.filter((c) => c.status === params.status);
      return { ...res, list };
    },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => customers.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customers.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customers.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

// ===== 跟进记录 =====
export function useFollowUps(customerId?: string) {
  return useQuery({
    queryKey: ['followUps', customerId],
    queryFn: async () => {
      const res = await followUps.list();
      if (customerId) {
        return res.list.filter((f) => f.customerId === customerId);
      }
      return res.list;
    },
  });
}

export function useCreateFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FollowUp>) => followUps.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['followUps'] }),
  });
}

// ===== 商机 =====
export function useOpportunities(customerId?: string) {
  return useQuery({
    queryKey: ['opportunities', customerId],
    queryFn: async () => {
      const res = await opportunities.list();
      if (customerId) {
        return res.list.filter((o) => o.customerId === customerId);
      }
      return res.list;
    },
  });
}

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Opportunity>) => opportunities.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opportunities'] }),
  });
}

// ===== 客户信用 =====
export function useCustomerCredits() {
  return useQuery({
    queryKey: ['customerCredits'],
    queryFn: () => customerCredits.all(),
  });
}

export function useUpdateCredit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerCredit> }) =>
      customerCredits.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customerCredits'] }),
  });
}

export function useCreateCredit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CustomerCredit>) => customerCredits.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customerCredits'] }),
  });
}

// ===== 供应商资质 =====
export function useSupplierQualifications(supplierId?: string) {
  return useQuery({
    queryKey: ['supplierQualifications', supplierId],
    queryFn: async () => {
      const res = await supplierQualifications.list();
      if (supplierId) {
        return res.list.filter((q) => q.supplierId === supplierId);
      }
      return res.list;
    },
  });
}

export function useCreateSupplierQualification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SupplierQualification>) => supplierQualifications.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supplierQualifications'] }),
  });
}

export function useUpdateSupplierQualification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierQualification> }) =>
      supplierQualifications.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supplierQualifications'] }),
  });
}
