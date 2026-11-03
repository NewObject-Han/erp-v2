/**
 * 系统域类型：用户 / 角色 / 权限 / 操作日志
 */
import type { BaseEntity } from './common';

/** 用户状态 */
export type UserStatus = 'active' | 'inactive' | 'disabled';

/** 用户 */
export interface User extends BaseEntity {
  username: string;
  displayName: string;
  email: string;
  phone: string;
  roleIds: string[];
  status: UserStatus;
  /** 是否管理员 */
  isAdmin: boolean;
  /** 最后登录时间 */
  lastLoginAt?: string | null;
}

/** 角色 */
export interface Role extends BaseEntity {
  code: string;
  name: string;
  description: string;
  permissionIds: string[];
  /** 内置角色不可删除 */
  builtin: boolean;
}

/** 权限 */
export interface Permission extends BaseEntity {
  /** 所属模块 */
  module: string;
  /** 操作：view / create / edit / delete / approve / export */
  action: string;
  description: string;
}

/** 操作日志 */
export interface OperationLog extends BaseEntity {
  userId: string;
  action: string;
  resource: string;
  detail: string;
  at: string;
}
