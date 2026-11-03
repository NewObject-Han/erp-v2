/**
 * 枚举中文标签映射
 */
import {
  AR_STATUS,
  ARRIVAL_STATUS,
  ALERT_STATUS,
  ALERT_TYPE,
  BOOKING_STATUS,
  COMPARE_STATUS,
  CUSTOMER_STATUS,
  CUSTOMS_STATUS,
  DOC_STATUS,
  DOC_TYPE,
  EXCEPTION_STATUS,
  EXCEPTION_TYPE,
  EXPENSE_STATUS,
  EXPENSE_TYPE,
  FX_STATUS,
  INBOUND_STATUS,
  INQUIRY_SOURCE,
  INQUIRY_STATUS,
  LC_DOC_STATUS,
  LC_STATUS,
  NODE_STATUS,
  OPPORTUNITY_STAGE,
  ORDER_STATUS,
  ORDER_SOURCE,
  PAYMENT_TERMS_OPTIONS,
  PI_STATUS,
  PO_STATUS,
  PUR_INQUIRY_STATUS,
  QUOTATION_STATUS,
  REFUND_STATUS,
  SAMPLE_STATUS,
  STOCKTAKE_STATUS,
  SUPPLIER_LEVEL,
  SUPPLIER_STATUS,
  TRANSFER_STATUS,
  TRACKING_STATUS,
  TRACKING_NODE_TYPE,
  USER_STATUS,
  VAT_STATUS,
  VAT_TYPE,
  WAREHOUSE_TYPE,
} from './enums';

type Dict = Record<string, string>;

/** 客户状态 */
export const CUSTOMER_STATUS_LABELS: Dict = {
  potential: '潜在客户',
  active: '活跃客户',
  inactive: '休眠客户',
  blacklist: '黑名单',
};

/** 付款方式 */
export const PAYMENT_TERMS_LABELS: Dict = Object.fromEntries(
  PAYMENT_TERMS_OPTIONS.map((v) => [v, v]),
);

/** 询盘来源 */
export const INQUIRY_SOURCE_LABELS: Dict = {
  exhibition: '展会',
  b2b: 'B2B 平台',
  email: '邮件',
  referral: '客户转介绍',
  other: '其他',
};

/** 询盘状态 */
export const INQUIRY_STATUS_LABELS: Dict = {
  pending: '待处理',
  quoted: '已报价',
  in_progress: '跟进中',
  converted: '已转订单',
  closed: '已关闭',
};

/** 报价状态 */
export const QUOTATION_STATUS_LABELS: Dict = {
  draft: '草稿',
  pending_approval: '待审批',
  approved: '已审批',
  sent: '已发送',
  accepted: '已接受',
  rejected: '已拒绝',
  expired: '已过期',
};

/** 样品状态 */
export const SAMPLE_STATUS_LABELS: Dict = {
  pending: '待制作',
  producing: '制作中',
  shipped: '已寄送',
  confirmed: '已确认',
  converted: '已转大货',
  cancelled: '已取消',
};

/** PI 状态 */
export const PI_STATUS_LABELS: Dict = {
  draft: '草稿',
  issued: '已签发',
  confirmed: '已确认',
  cancelled: '已取消',
};

/** 订单状态 */
export const ORDER_STATUS_LABELS: Dict = {
  draft: '草稿',
  confirmed: '已确认',
  in_production: '生产中',
  ready_to_ship: '待出运',
  shipped: '已出运',
  completed: '已完成',
  cancelled: '已取消',
};

/** 订单来源 */
export const ORDER_SOURCE_LABELS: Dict = {
  pi: 'PI 转化',
  sample: '样品转化',
  direct: '直接下单',
  reorder: '返单',
};

/** 供应商等级 */
export const SUPPLIER_LEVEL_LABELS: Dict = {
  strategic: '战略供应商',
  preferred: '优选供应商',
  regular: '普通供应商',
  temporary: '临时供应商',
};

/** 供应商状态 */
export const SUPPLIER_STATUS_LABELS: Dict = {
  active: '启用',
  inactive: '停用',
  pending: '待审核',
  blacklist: '黑名单',
};

/** 采购询价状态 */
export const PUR_INQUIRY_STATUS_LABELS: Dict = {
  draft: '草稿',
  quoted: '已报价',
  comparing: '比价中',
  completed: '已完成',
  cancelled: '已取消',
};

/** 比价状态 */
export const COMPARE_STATUS_LABELS: Dict = {
  draft: '草稿',
  comparing: '比价中',
  completed: '已完成',
};

/** 采购订单状态 */
export const PO_STATUS_LABELS: Dict = {
  draft: '草稿',
  sent: '已发送',
  confirmed: '已确认',
  in_production: '生产中',
  shipped: '已发货',
  received: '已到货',
  closed: '已关闭',
  cancelled: '已取消',
};

/** 到货状态 */
export const ARRIVAL_STATUS_LABELS: Dict = {
  pending: '待到货',
  partial: '部分到货',
  completed: '已到货',
  defective: '有不良',
  cancelled: '已取消',
};

/** 跟单节点类型 */
export const TRACKING_NODE_TYPE_LABELS: Dict = {
  purchase: '采购备货',
  production: '生产',
  inspection: '验货',
  packing: '装箱',
  booking: '订舱',
  customs: '报关',
  shipping: '出运',
  document: '单证',
  delivery: '交付',
};

/** 节点状态 */
export const NODE_STATUS_LABELS: Dict = {
  pending: '未开始',
  in_progress: '进行中',
  done: '已完成',
  delayed: '已延期',
  exception: '异常',
};

/** 跟单状态 */
export const TRACKING_STATUS_LABELS: Dict = {
  init: '初始化',
  in_progress: '进行中',
  delayed: '已延期',
  completed: '已完成',
  exception: '有异常',
};

/** 异常类型 */
export const EXCEPTION_TYPE_LABELS: Dict = {
  delay: '交期延误',
  quality: '质量问题',
  logistics: '物流问题',
  payment: '付款问题',
  document: '单证问题',
  customs: '报关问题',
  supplier: '供应商问题',
  other: '其他',
};

/** 异常状态 */
export const EXCEPTION_STATUS_LABELS: Dict = {
  open: '待处理',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭',
};

/** 单证类型 */
export const DOC_TYPE_LABELS: Dict = {
  commercial_invoice: '商业发票',
  packing_list: '装箱单',
  certificate_of_origin: '产地证',
  bill_of_lading: '提单',
  customs_declaration: '报关单',
  other: '其他',
};

/** 单证状态 */
export const DOC_STATUS_LABELS: Dict = {
  draft: '草稿',
  generating: '生成中',
  ready: '就绪',
  submitted: '已提交',
  audited: '已审核',
  approved: '已通过',
  rejected: '已驳回',
};

/** 订舱状态 */
export const BOOKING_STATUS_LABELS: Dict = {
  draft: '草稿',
  booked: '已订舱',
  confirmed: '已确认',
  shipped: '已出运',
  closed: '已关闭',
  cancelled: '已取消',
};

/** 报关状态 */
export const CUSTOMS_STATUS_LABELS: Dict = {
  draft: '草稿',
  submitted: '已申报',
  inspection: '查验中',
  released: '已放行',
  rejected: '已退单',
  closed: '已结关',
};

/** 仓库类型 */
export const WAREHOUSE_TYPE_LABELS: Dict = {
  finished: '成品仓',
  pending_shipment: '待运仓',
  material: '物料仓',
  overseas: '海外仓',
};

/** 入库状态 */
export const INBOUND_STATUS_LABELS: Dict = {
  draft: '草稿',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

/** 出库状态 */
export const OUTBOUND_STATUS_LABELS: Dict = {
  draft: '草稿',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

/** 调拨状态 */
export const TRANSFER_STATUS_LABELS: Dict = {
  draft: '草稿',
  confirmed: '已确认',
  in_transit: '在途',
  completed: '已完成',
  cancelled: '已取消',
};

/** 盘点状态 */
export const STOCKTAKE_STATUS_LABELS: Dict = {
  draft: '草稿',
  counting: '盘点中',
  completed: '已完成',
  adjusted: '已调整',
  cancelled: '已取消',
};

/** 预警类型 */
export const ALERT_TYPE_LABELS: Dict = {
  low_stock: '低于安全库存',
  overstock: '超储',
  expiry: '临期',
  no_movement: '呆滞',
  other: '其他',
};

/** 预警状态 */
export const ALERT_STATUS_LABELS: Dict = {
  open: '未处理',
  processing: '处理中',
  resolved: '已处理',
  ignored: '已忽略',
};

/** 应收状态 */
export const AR_STATUS_LABELS: Dict = {
  open: '未收汇',
  partial: '部分收汇',
  overdue: '逾期',
  paid: '已结清',
  written_off: '已核销',
  cancelled: '已取消',
};

/** 应付状态 */
export const AP_STATUS_LABELS: Dict = {
  open: '未付款',
  partial: '部分付款',
  overdue: '逾期',
  paid: '已结清',
  cancelled: '已取消',
};

/** 费用类型 */
export const EXPENSE_TYPE_LABELS: Dict = {
  freight: '运费',
  commission: '佣金',
  travel: '差旅',
  office: '办公',
  bank: '银行费用',
  other: '其他',
};

/** 费用状态 */
export const EXPENSE_STATUS_LABELS: Dict = {
  draft: '草稿',
  pending: '待审批',
  approved: '已审批',
  paid: '已支付',
  rejected: '已驳回',
};

/** 退税状态 */
export const REFUND_STATUS_LABELS: Dict = {
  pending: '待归集',
  collecting: '数据归集中',
  submitted: '已申报',
  approved: '已审核',
  received: '已到账',
  rejected: '已退回',
};

/** 增值税类型 */
export const VAT_TYPE_LABELS: Dict = {
  input: '进项',
  output: '销项',
};

/** 增值税状态 */
export const VAT_STATUS_LABELS: Dict = {
  draft: '草稿',
  declared: '已申报',
  paid: '已缴纳',
  refunded: '已退税',
};

/** 外汇核销状态 */
export const FX_STATUS_LABELS: Dict = {
  pending: '待核销',
  verified: '已核销',
  rejected: '已退回',
  closed: '已关闭',
};

/** 信用证状态 */
export const LC_STATUS_LABELS: Dict = {
  draft: '草稿',
  issued: '已开证',
  amended: '已改证',
  presented: '已交单',
  negotiated: '已议付',
  settled: '已结算',
  closed: '已关闭',
  cancelled: '已取消',
};

/** 信用证交单状态 */
export const LC_DOC_STATUS_LABELS: Dict = {
  pending: '待交单',
  presented: '已交单',
  accepted: '已接受',
  rejected: '已拒付',
  negotiated: '已议付',
};

/** 用户状态 */
export const USER_STATUS_LABELS: Dict = {
  active: '启用',
  inactive: '停用',
  disabled: '禁用',
};

/** 商机阶段 */
export const OPPORTUNITY_STAGE_LABELS: Dict = {
  lead: '线索',
  inquiry: '询盘',
  quotation: '报价',
  sample: '样品',
  negotiation: '谈判',
  won: '赢单',
  lost: '输单',
};

/** 导出标签映射：按命名空间 */
export const ALL_LABELS = {
  customer: CUSTOMER_STATUS_LABELS,
  payment: PAYMENT_TERMS_LABELS,
  inquiry: INQUIRY_STATUS_LABELS,
  inquirySource: INQUIRY_SOURCE_LABELS,
  quotation: QUOTATION_STATUS_LABELS,
  sample: SAMPLE_STATUS_LABELS,
  pi: PI_STATUS_LABELS,
  order: ORDER_STATUS_LABELS,
  orderSource: ORDER_SOURCE_LABELS,
  supplierLevel: SUPPLIER_LEVEL_LABELS,
  supplierStatus: SUPPLIER_STATUS_LABELS,
  purInquiry: PUR_INQUIRY_STATUS_LABELS,
  compare: COMPARE_STATUS_LABELS,
  po: PO_STATUS_LABELS,
  arrival: ARRIVAL_STATUS_LABELS,
  nodeType: TRACKING_NODE_TYPE_LABELS,
  nodeStatus: NODE_STATUS_LABELS,
  tracking: TRACKING_STATUS_LABELS,
  exceptionType: EXCEPTION_TYPE_LABELS,
  exceptionStatus: EXCEPTION_STATUS_LABELS,
  docType: DOC_TYPE_LABELS,
  docStatus: DOC_STATUS_LABELS,
  booking: BOOKING_STATUS_LABELS,
  customs: CUSTOMS_STATUS_LABELS,
  warehouse: WAREHOUSE_TYPE_LABELS,
  inbound: INBOUND_STATUS_LABELS,
  outbound: OUTBOUND_STATUS_LABELS,
  transfer: TRANSFER_STATUS_LABELS,
  stocktake: STOCKTAKE_STATUS_LABELS,
  alertType: ALERT_TYPE_LABELS,
  alertStatus: ALERT_STATUS_LABELS,
  ar: AR_STATUS_LABELS,
  ap: AP_STATUS_LABELS,
  expenseType: EXPENSE_TYPE_LABELS,
  expenseStatus: EXPENSE_STATUS_LABELS,
  refund: REFUND_STATUS_LABELS,
  vatType: VAT_TYPE_LABELS,
  vatStatus: VAT_STATUS_LABELS,
  fx: FX_STATUS_LABELS,
  lc: LC_STATUS_LABELS,
  lcDoc: LC_DOC_STATUS_LABELS,
  user: USER_STATUS_LABELS,
  opportunity: OPPORTUNITY_STAGE_LABELS,
} as const;

export type LabelMap = Dict;
