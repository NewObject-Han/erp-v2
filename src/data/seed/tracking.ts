/**
 * 种子数据：跟单域（跟单节点 / 异常）
 */

import type { TrackingOrder, TrackingNode, TrackingException } from '../../types';

export const seedTrackingOrders: TrackingOrder[] = [
  {
    id: 'trk_1',
    salesOrderId: 'so_1',
    purchaseOrderId: 'po_1',
    nodes: [],
    status: 'in_progress',
    overallProgress: 45,
    owner: '周敏',
    createdAt: '2026-10-08T10:00:00.000Z',
    updatedAt: '2026-10-28T10:00:00.000Z',
  },
  {
    id: 'trk_2',
    salesOrderId: 'so_2',
    purchaseOrderId: 'po_2',
    nodes: [],
    status: 'in_progress',
    overallProgress: 20,
    owner: '周敏',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-25T10:00:00.000Z',
  },
];

export const seedTrackingNodes: TrackingNode[] = [
  // SO-001 跟单节点
  { id: 'tn_1', orderId: 'trk_1', nodeType: 'purchase', nodeName: '采购备货', plannedDate: '2026-10-25', actualDate: '2026-10-28', progress: 100, status: 'done', responsible: '赵刚', remark: '采购订单 PO-20261011-001 已确认', createdAt: '', updatedAt: '' },
  { id: 'tn_2', orderId: 'trk_1', nodeType: 'inspection', nodeName: '来料检验', plannedDate: '2026-11-05', actualDate: '', progress: 60, status: 'in_progress', responsible: '孙丽', remark: 'IQC 检验中', createdAt: '', updatedAt: '' },
  { id: 'tn_3', orderId: 'trk_1', nodeType: 'production', nodeName: '生产组装', plannedDate: '2026-11-15', actualDate: '', progress: 0, status: 'pending', responsible: '陈志强', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_4', orderId: 'trk_1', nodeType: 'packing', nodeName: '装箱理货', plannedDate: '2026-11-25', actualDate: '', progress: 0, status: 'pending', responsible: '孙丽', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_5', orderId: 'trk_1', nodeType: 'booking', nodeName: '订舱', plannedDate: '2026-11-28', actualDate: '', progress: 0, status: 'pending', responsible: '吴强', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_6', orderId: 'trk_1', nodeType: 'shipping', nodeName: '出运', plannedDate: '2026-12-02', actualDate: '', progress: 0, status: 'pending', responsible: '吴强', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_7', orderId: 'trk_1', nodeType: 'document', nodeName: '单证制作', plannedDate: '2026-12-01', actualDate: '', progress: 0, status: 'pending', responsible: '郑洁', remark: '', createdAt: '', updatedAt: '' },
  // SO-002 跟单节点
  { id: 'tn_8', orderId: 'trk_2', nodeType: 'purchase', nodeName: '采购备货', plannedDate: '2026-11-05', actualDate: '', progress: 30, status: 'in_progress', responsible: '赵刚', remark: '电源与线材采购中', createdAt: '', updatedAt: '' },
  { id: 'tn_9', orderId: 'trk_2', nodeType: 'inspection', nodeName: '来料检验', plannedDate: '2026-11-12', actualDate: '', progress: 0, status: 'pending', responsible: '孙丽', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_10', orderId: 'trk_2', nodeType: 'production', nodeName: '生产组装', plannedDate: '2026-11-25', actualDate: '', progress: 0, status: 'pending', responsible: '黄敏', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_11', orderId: 'trk_2', nodeType: 'booking', nodeName: '订舱', plannedDate: '2026-12-10', actualDate: '', progress: 0, status: 'pending', responsible: '吴强', remark: '', createdAt: '', updatedAt: '' },
  { id: 'tn_12', orderId: 'trk_2', nodeType: 'shipping', nodeName: '出运', plannedDate: '2026-12-18', actualDate: '', progress: 0, status: 'pending', responsible: '吴强', remark: '', createdAt: '', updatedAt: '' },
];

export const seedTrackingExceptions: TrackingException[] = [
  {
    id: 'exc_1',
    nodeId: 'tn_2',
    orderId: 'trk_1',
    type: 'quality',
    description: '来料检验发现 3% 灯珠暗亮，疑似来料不良',
    reportedAt: '2026-11-03T10:00:00.000Z',
    status: 'processing',
    handler: '孙丽',
    resolution: '已通知供应商补货',
    createdAt: '', updatedAt: '',
  },
  {
    id: 'exc_2',
    orderId: 'trk_2',
    type: 'supplier',
    description: '供应商电源交期可能延误 3 天',
    reportedAt: '2026-10-26T10:00:00.000Z',
    status: 'resolved',
    resolution: '与供应商确认后可按期交货',
    handler: '赵刚',
    resolvedAt: '2026-10-27T10:00:00.000Z',
    createdAt: '', updatedAt: '',
  },
];
