/**
 * AI 询价邮件解析（规则引擎）
 *
 * 从非结构化邮件文本中提取：客户公司、国别、产品关键词、数量、目标价、币种、贸易术语、交期
 */

import type { EmailParseResult } from '../types/ai';
import { mockDelay, mockConfidence } from './engine';

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  USA: ['united states', 'usa', 'us ', 'new york', 'los angeles'],
  Germany: ['germany', 'deutschland', 'berlin', 'hamburg'],
  UK: ['united kingdom', 'uk', 'london', 'britain'],
  France: ['france', 'paris', 'marseille'],
  Italy: ['italy', 'italia', 'milan', 'rome'],
  Japan: ['japan', 'tokyo', 'osaka'],
  Canada: ['canada', 'toronto', 'vancouver'],
  Australia: ['australia', 'sydney', 'melbourne'],
  UAE: ['uae', 'dubai', 'abu dhabi', 'emirates'],
  Brazil: ['brazil', 'sao paulo'],
  Spain: ['spain', 'madrid', 'barcelona'],
};

const CURRENCY_KEYWORDS = ['usd', 'dollar', 'us$', 'eur', '€', 'gbp', '£', 'cny', '¥'];

const INCOTERM_KEYWORDS = ['fob', 'cif', 'cfr', 'exw', 'dap', 'ddp', 'fca', 'cip'];

const PRODUCT_KEYWORDS = [
  'led', 'lamp', 'light', 'fixture', 'furniture', 'chair', 'table', 'sofa',
  'textile', 'fabric', 'garment', 'clothing', 'bag', 'shoe', 'electronics',
  'cable', 'wire', 'motor', 'pump', 'valve', 'tool', 'hardware', 'plastic',
  'steel', 'aluminum', 'glass', 'ceramic', 'wood', 'paper', 'packaging',
];

/**
 * 解析询价邮件
 */
export async function parseEmail(rawText: string): Promise<EmailParseResult> {
  await mockDelay(500);

  const lower = rawText.toLowerCase();
  const result: EmailParseResult = {
    sender: '',
    company: '',
    country: '',
    productKeywords: [],
    quantity: 0,
    targetPrice: 0,
    currency: 'USD',
    incoterm: 'FOB',
    expectedDeliveryDate: '',
    confidence: mockConfidence(82),
    notes: [],
  };

  // 提取发件人邮箱
  const emailMatch = rawText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) result.sender = emailMatch[0];

  // 提取公司名（尝试从 "Dear XXX" / "Regards, XXX" / "XXX Company" 提取）
  const companyPatterns = [
    /(?:Dear|Regards|Best regards|Best regards,|Thank you|Thanks)[,\s]+([\w\s&.]+?)(?:\n|Company|Ltd|Inc|LLC|GmbH|Co\.)/i,
    /([\w\s&.]+?)\s+(?:Co\.|Ltd|Inc|LLC|GmbH|Company|Trading|Import|Export)/i,
  ];
  for (const pat of companyPatterns) {
    const m = rawText.match(pat);
    if (m && m[1]) {
      result.company = m[1].trim().slice(0, 50);
      break;
    }
  }

  // 国别匹配
  for (const [country, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      result.country = country;
      break;
    }
  }

  // 产品关键词
  for (const kw of PRODUCT_KEYWORDS) {
    if (lower.includes(kw)) {
      result.productKeywords.push(kw);
    }
  }

  // 数量
  const qtyMatch = lower.match(/(\d[\d,]*)\s*(?:pcs|pieces|units|sets|cartons|ctns|kg|tons|mt|m|meters)?/);
  if (qtyMatch) result.quantity = parseInt(qtyMatch[1].replace(/,/g, ''), 10);

  // 目标价
  const priceMatch = rawText.match(/(?:price|priced at|unit price|target price|offer|quotation)[:\s]*\$?([\d,.]+)/i);
  if (priceMatch) result.targetPrice = parseFloat(priceMatch[1].replace(/,/g, ''));

  // 币种
  if (lower.includes('eur') || rawText.includes('€')) result.currency = 'EUR';
  else if (lower.includes('gbp') || rawText.includes('£')) result.currency = 'GBP';
  else if (lower.includes('cny') || lower.includes('rmb')) result.currency = 'CNY';
  else if (CURRENCY_KEYWORDS.some((c) => lower.includes(c))) result.currency = 'USD';

  // 贸易术语
  for (const term of INCOTERM_KEYWORDS) {
    if (lower.includes(term)) {
      result.incoterm = term.toUpperCase();
      break;
    }
  }

  // 交期
  const dateMatch = rawText.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(\d{4}-\d{1,2}-\d{1,2})|(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4})/i);
  if (dateMatch) result.expectedDeliveryDate = dateMatch[0];

  if (result.productKeywords.length === 0) {
    result.notes.push('未识别到明确产品关键词，请人工补充');
    result.confidence = Math.max(40, result.confidence - 30);
  }
  if (!result.company) {
    result.notes.push('未识别到客户公司名，请人工补充');
    result.confidence = Math.max(40, result.confidence - 20);
  }

  return result;
}
