/**
 * AI 中心类型
 */

/** AI 能力项 */
export interface AiCapability {
  id: string;
  /** 能力名称 */
  name: string;
  /** 能力描述 */
  description: string;
  /** 分类：邮件解析 / OCR / 归类 / 审核 / 模拟 / 装箱 */
  category: 'email' | 'ocr' | 'classify' | 'audit' | 'simulator' | 'packing';
  /** 是否已启用 */
  enabled: boolean;
  /** 模拟置信度（0-100） */
  confidence: number;
  /** 调用次数 */
  callCount: number;
  /** 图标 key */
  icon: string;
}

/** AI 调用记录 */
export interface AiCallLog {
  id: string;
  capabilityId: string;
  capabilityName: string;
  /** 输入摘要 */
  inputSummary: string;
  /** 输出摘要 */
  outputSummary: string;
  /** 耗时 ms */
  durationMs: number;
  /** 是否成功 */
  success: boolean;
  /** 调用时间 */
  at: string;
  /** 调用用户 */
  user: string;
}

/** 邮件解析结果 */
export interface EmailParseResult {
  /** 发件人 */
  sender: string;
  /** 客户公司名（从邮件推断） */
  company: string;
  /** 国别（从邮件推断） */
  country: string;
  /** 商品关键词 */
  productKeywords: string[];
  /** 数量 */
  quantity: number;
  /** 目标单价 */
  targetPrice: number;
  /** 币种 */
  currency: string;
  /** 贸易术语 */
  incoterm: string;
  /** 交期要求 */
  expectedDeliveryDate: string;
  /** 识别置信度 0-100 */
  confidence: number;
  /** 原始解析说明 */
  notes: string[];
}

/** OCR 抽取结果 */
export interface OcrExtractResult {
  /** 单证类型 */
  docType: string;
  /** 关键字段 */
  fields: Record<string, string>;
  /** 识别置信度 0-100 */
  confidence: number;
  /** 字段说明 */
  fieldNotes: Record<string, string>;
}

/** HS 归类建议 */
export interface HsClassifySuggestion {
  productName: string;
  productNameEn: string;
  /** 推荐 HS 编码 */
  hsCode: string;
  /** 归类依据 */
  reason: string;
  /** 退税率 */
  refundRate: number;
  /** 监管条件 */
  regulatory: string;
  /** 置信度 0-100 */
  confidence: number;
}

/** 利润模拟结果 */
export interface ProfitSimulationResult {
  incoterm: string;
  currency: string;
  revenue: number;
  /** 各成本项 */
  costs: { name: string; amount: number; note: string }[];
  totalCost: number;
  /** 退税金额 */
  refundAmount: number;
  /** 净利润 */
  netProfit: number;
  /** 净利率 % */
  profitRate: number;
}

/** 装箱方案 */
export interface PackingPlan {
  /** 柜型 */
  containerType: string;
  /** 建议柜数 */
  containerQty: number;
  /** 总装载数量 */
  totalLoadedQty: number;
  /** 总装载体积 m³ */
  totalVolume: number;
  /** 总装载重量 kg */
  totalWeight: number;
  /** 装载率 % */
  utilizationRate: number;
  /** 方案说明 */
  note: string;
}

/** 业务数据助手对话消息 */
export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** 关联数据快照 */
  dataSnapshot?: Record<string, unknown>;
  at: string;
}
