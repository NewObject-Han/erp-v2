/**
 * AI 单证一致性审核（规则引擎）
 *
 * 检查"单单相符 / 单证相符"：发票 vs 箱单 vs 提单 vs 产地证
 */

import type { AuditItem, AuditResult, Document } from '../types';
import { mockDelay, mockConfidence } from './engine';

/** 审核字段清单 */
const AUDIT_FIELDS = [
  'buyer',
  'seller',
  'productName',
  'quantity',
  'totalAmount',
  'currency',
  'incoterm',
  'portOfLoading',
  'portOfDischarge',
  'hsCode',
];

/**
 * 执行单证一致性审核
 */
export async function auditDocuments(documents: Document[]): Promise<AuditResult> {
  await mockDelay(1200);

  const discrepancies: AuditItem[] = [];
  let criticalCount = 0;
  let majorCount = 0;
  let minorCount = 0;

  // 将各单证 content 转为统一字段映射
  const docFieldMap = new Map<string, Record<string, unknown>>();
  for (const doc of documents) {
    docFieldMap.set(doc.code, doc.content as Record<string, unknown>);
  }

  // 对比各字段
  for (const field of AUDIT_FIELDS) {
    const values = new Map<string, string>();
    for (const doc of documents) {
      const content = doc.content as Record<string, unknown>;
      const v = content[field];
      if (v !== undefined && v !== null && v !== '') {
        values.set(doc.code, String(v));
      }
    }
    if (values.size <= 1) continue;

    // 检查是否一致（容忍大小写与空格差异）
    const normalized = new Set(
      Array.from(values.values()).map((v) => v.trim().toLowerCase().replace(/\s+/g, ' ')),
    );
    if (normalized.size > 1) {
      // 存在不一致
      const isCritical = ['totalAmount', 'buyer', 'productName', 'hsCode'].includes(field);
      const isMajor = ['quantity', 'currency', 'portOfLoading', 'portOfDischarge', 'incoterm'].includes(field);
      const severity = isCritical ? 'critical' : isMajor ? 'major' : 'minor';
      if (severity === 'critical') criticalCount++;
      else if (severity === 'major') majorCount++;
      else minorCount++;

      for (const [docCode, value] of values.entries()) {
        discrepancies.push({
          docType: docCode,
          field,
          expected: Array.from(values.values()).find(
            (v) => v.trim().toLowerCase().replace(/\s+/g, ' ') !== value.trim().toLowerCase().replace(/\s+/g, ' '),
          ) ?? '-',
          actual: value,
          severity,
          message: `${docCode} 字段 ${field} 与其他单证不一致`,
        });
      }
    }
  }

  // 检查 L/C 项下关键条款（简化：若存在 lcNo 字段则要求单证注明）
  const lcNoInDocs = documents.some(
    (d) => (d.content as Record<string, unknown>)?.lcNo,
  );
  if (lcNoInDocs) {
    const docsWithoutLc = documents.filter(
      (d) => !(d.content as Record<string, unknown>)?.lcNo,
    );
    for (const doc of docsWithoutLc) {
      discrepancies.push({
        docType: doc.code,
        field: 'lcNo',
        expected: '信用证号',
        actual: '未注明',
        severity: 'critical',
        message: 'L/C 项下单证需注明信用证号',
      });
      criticalCount++;
    }
  }

  return {
    passed: discrepancies.length === 0,
    discrepancies,
    criticalCount,
    majorCount,
    minorCount,
    auditedAt: new Date().toISOString(),
    summary:
      discrepancies.length === 0
        ? '所有单证单单相符、单证相符，审核通过'
        : `发现 ${discrepancies.length} 项不符点（严重 ${criticalCount} / 主要 ${majorCount} / 次要 ${minorCount}）`,
  };
}

export { mockConfidence };
