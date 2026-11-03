/**
 * 跟单域类型：跟单节点 / 异常
 */
import type { BaseEntity } from './common';

/** 跟单节点类型 */
export type TrackingNodeType =
  | 'purchase'
  | 'production'
  | 'inspection'
  | 'packing'
  | 'booking'
  | 'customs'
  | 'shipping'
  | 'document'
  | 'delivery';

/** 节点状态 */
export type NodeStatus = 'pending' | 'in_progress' | 'done' | 'delayed' | 'exception';

/** 跟单节点 */
export interface TrackingNode extends BaseEntity {
  orderId: string;
  nodeType: TrackingNodeType;
  nodeName: string;
  plannedDate: string;
  actualDate?: string | null;
  /** 进度 0-100 */
  progress: number;
  status: NodeStatus;
  responsible: string;
  remark: string;
}

/** 跟单状态 */
export type TrackingStatus =
  | 'init'
  | 'in_progress'
  | 'delayed'
  | 'completed'
  | 'exception';

/** 跟单单 */
export interface TrackingOrder extends BaseEntity {
  salesOrderId: string;
  purchaseOrderId?: string | null;
  nodes: TrackingNode[];
  status: TrackingStatus;
  /** 总进度 */
  overallProgress: number;
  /** 跟单员 */
  owner: string;
}

/** 异常类型 */
export type ExceptionType =
  | 'delay'
  | 'quality'
  | 'logistics'
  | 'payment'
  | 'document'
  | 'customs'
  | 'supplier'
  | 'other';

/** 异常状态 */
export type ExceptionStatus =
  | 'open'
  | 'processing'
  | 'resolved'
  | 'closed';

/** 跟单异常 */
export interface TrackingException extends BaseEntity {
  nodeId?: string | null;
  orderId: string;
  type: ExceptionType;
  description: string;
  /** 报告时间 */
  reportedAt: string;
  status: ExceptionStatus;
  /** 处理方案 */
  resolution?: string | null;
  /** 处理人 */
  handler?: string | null;
  /** 处理时间 */
  resolvedAt?: string | null;
}
