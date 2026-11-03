/**
 * 全站枚举值 → 中文显示文案
 * 用于状态标签、等级列等直接展示英文枚举的场景
 */

const ENUM_LABELS: Record<string, string> = {
  // 单据通用状态
  draft: '草稿',
  pending: '待处理',
  in_progress: '进行中',
  processing: '处理中',
  in_production: '生产中',
  done: '已完成',
  completed: '已完成',
  closed: '已关闭',
  cancelled: '已取消',
  rejected: '已驳回',
  submitted: '已提交',
  approved: '已审批',
  issued: '已签发',
  ready: '已就绪',
  valid: '生效中',
  expired: '已过期',
  overdue: '逾期',
  delayed: '延期',
  exception: '异常',
  warning: '预警',
  normal: '正常',
  resolved: '已解决',
  open: '未结',
  partial: '部分',
  adjusted: '已调整',

  // 业务单据状态
  quoted: '已报价',
  quoted_sent: '报价已发',
  accepted: '已接受',
  converted: '已转订单',
  confirmed: '已确认',
  booked: '已订舱',
  declared: '已申报',
  released: '已放行',
  shipped: '已发运',
  received: '已收货',
  verified: '已核销',
  verified_fx: '已核销',
  paid: '已支付',
  written_off: '已核销',
  open_ar: '未收款',

  // 启用状态
  active: '启用',
  inactive: '停用',
  disabled: '已禁用',
  blacklist: '黑名单',

  // 客户 / 供应商等级
  strategic: '战略客户',
  preferred: '优选',
  regular: '普通',
  vip: 'VIP',
  a: 'A 级',
  b: 'B 级',
  c: 'C 级',

  // 异常等级
  high: '高',
  medium: '中',
  low: '低',

  // 常见布尔语义
  yes: '是',
  no: '否',
};

/** 把英文枚举值翻译成中文显示文案；未收录时原样返回 */
export function translateEnum(value: unknown): string {
  if (value == null || value === '') return '-';
  const key = String(value);
  return ENUM_LABELS[key] ?? key;
}

export { ENUM_LABELS };
