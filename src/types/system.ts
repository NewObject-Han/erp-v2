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

// ===== 审批工作流 =====

/** 审批业务类型 */
export type ApprovalBizType = 'quotation' | 'payment';

/** 审批状态 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

/** 审批时间线节点 */
export interface ApprovalNode {
  at: string;
  /** 动作：发起 / 通过 / 驳回 */
  action: 'apply' | 'approve' | 'reject';
  operator: string;
  comment: string;
}

/** 审批记录（独立于业务单据，含完整时间线） */
export interface ApprovalRecord extends BaseEntity {
  bizType: ApprovalBizType;
  bizId: string;
  bizCode: string;
  /** 单据标题，如：报价单 QT-20261002-001 */
  title: string;
  amount: number;
  currency: string;
  /** 发起人 */
  applicant: string;
  /** 指定审批人 */
  approver: string;
  status: ApprovalStatus;
  /** 发起说明 / 最近审批意见 */
  remark: string;
  timeline: ApprovalNode[];
}
