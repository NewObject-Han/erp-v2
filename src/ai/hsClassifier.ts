/**
 * AI HS 编码归类（规则引擎）
 *
 * 根据商品名称与材质/用途关键词推荐 HS 编码
 */

import type { HsClassifySuggestion } from '../types/ai';
import { mockDelay, mockConfidence } from './engine';

/** HS 编码规则库（简化版） */
const HS_RULES: { keywords: string[]; hsCode: string; reason: string; refundRate: number; regulatory: string }[] = [
  { keywords: ['led', 'lamp', 'light', 'lighting'], hsCode: '9405.42.0000', reason: 'LED 灯具归入 9405 照明器具', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['cable', 'wire', 'cord'], hsCode: '8544.42.0000', reason: '电线电缆归入 8544', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['furniture', 'chair', 'table', 'sofa'], hsCode: '9401.79.0000', reason: '家具归入 9401/9403', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['textile', 'fabric', 'garment', 'clothing', 'shirt', 'pants'], hsCode: '6205.20.0000', reason: '纺织品服装归入 61/62 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['bag', 'handbag'], hsCode: '4202.22.0000', reason: '箱包归入 4202', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['shoe', 'footwear'], hsCode: '6404.11.0000', reason: '鞋类归入 64 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['plastic', 'tableware'], hsCode: '3924.10.0000', reason: '塑料制品归入 39 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['steel', 'stainless'], hsCode: '7221.0000', reason: '钢材归入 72 章', refundRate: 13, regulatory: '出口许可证: 部分需要' },
  { keywords: ['glass', 'glassware'], hsCode: '7013.49.0000', reason: '玻璃制品归入 70 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['ceramic', 'porcelain'], hsCode: '6912.00.1000', reason: '陶瓷归入 69 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['wood', 'wooden'], hsCode: '4414.00.0000', reason: '木制品归入 44 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['electronic', 'circuit', 'board'], hsCode: '8541.30.0000', reason: '电子元件归入 85 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['motor', 'engine'], hsCode: '8407.21.0000', reason: '电机归入 84 章', refundRate: 13, regulatory: '出口许可证: 部分需要' },
  { keywords: ['tool', 'hand tool'], hsCode: '8204.11.0000', reason: '工具归入 82 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['pump', 'valve'], hsCode: '8413.11.0000', reason: '泵阀归入 84 章', refundRate: 13, regulatory: '出口许可证: 部分需要' },
  { keywords: ['toy'], hsCode: '9503.00.0000', reason: '玩具归入 95 章', refundRate: 13, regulatory: '出口许可证: 否' },
  { keywords: ['cosmetic', 'skincare'], hsCode: '3304.99.0000', reason: '化妆品归入 33 章', refundRate: 13, regulatory: '出口许可证: 部分需要' },
  { keywords: ['paper', 'cardboard', 'packaging'], hsCode: '4819.10.0000', reason: '纸制品归入 48 章', refundRate: 13, regulatory: '出口许可证: 否' },
];

/**
 * HS 归类推荐
 */
export async function classifyHs(
  productName: string,
  productNameEn: string,
): Promise<HsClassifySuggestion> {
  await mockDelay(600);

  const text = `${productName} ${productNameEn}`.toLowerCase();
  let matched = HS_RULES[0];
  let bestScore = 0;
  for (const rule of HS_RULES) {
    const score = rule.keywords.filter((k) => text.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      matched = rule;
    }
  }

  return {
    productName,
    productNameEn,
    hsCode: bestScore > 0 ? matched.hsCode : '9999.99.9999',
    reason: bestScore > 0 ? matched.reason : '未匹配到明确归类规则，请人工确认',
    refundRate: matched.refundRate,
    regulatory: matched.regulatory,
    confidence: bestScore > 0 ? mockConfidence(88) : 45,
  };
}

/** 批量归类 */
export async function classifyHsBatch(
  items: { productName: string; productNameEn: string; hsCode: string }[],
): Promise<HsClassifySuggestion[]> {
  const results: HsClassifySuggestion[] = [];
  for (const item of items) {
    const r = await classifyHs(item.productName, item.productNameEn);
    if (item.hsCode) {
      r.hsCode = item.hsCode;
    }
    results.push(r);
  }
  return results;
}
