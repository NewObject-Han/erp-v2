/**
 * AI 模拟引擎（规则引擎）
 *
 * 纯模拟实现，不接真实 LLM API。
 * 各 AI 能力基于规则与字典匹配完成结构化输出。
 */

import type {
  EmailParseResult,
  OcrExtractResult,
  HsClassifySuggestion,
  ProfitSimulationResult,
  PackingPlan,
} from '../types/ai';

/** 模拟延迟 */
function mockDelay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 随机置信度 */
function mockConfidence(base = 85): number {
  return Math.min(99, Math.max(60, base + Math.floor(Math.random() * 10) - 5));
}

/** 生成简短 ID */
function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export { mockDelay, mockConfidence, genId };
