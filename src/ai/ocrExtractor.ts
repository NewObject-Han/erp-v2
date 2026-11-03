/**
 * AI 单证 OCR 抽取（规则引擎）
 *
 * 模拟从上传的单证图片/扫描件中抽取关键字段
 */

import type { OcrExtractResult } from '../types/ai';
import { mockDelay, mockConfidence } from './engine';

const DOC_TYPE_HINTS: Record<string, string[]> = {
  commercial_invoice: ['commercial invoice', 'proforma invoice', 'invoice'],
  packing_list: ['packing list', 'packing statement', 'weight list'],
  certificate_of_origin: ['certificate of origin', 'form a', 'form e', 'co'],
  bill_of_lading: ['bill of lading', 'b/l', 'bol', "mate's receipt"],
  customs_declaration: ['customs declaration', 'export declaration', '报关单'],
};

/**
 * 抽取单证字段
 */
export async function extractDocument(
  docTypeHint: string,
  fileName: string,
): Promise<OcrExtractResult> {
  await mockDelay(800);

  const lowerName = (fileName || docTypeHint).toLowerCase();
  let detectedType = docTypeHint;
  for (const [type, hints] of Object.entries(DOC_TYPE_HINTS)) {
    if (hints.some((h) => lowerName.includes(h))) {
      detectedType = type;
      break;
    }
  }

  // 模拟抽取字段（demo 固定返回示例数据）
  const fields: Record<string, string> = {
    issuer: '深圳华盛进出口贸易有限公司',
    buyer: 'ABC Trading Co., Ltd.',
    invoiceNo: `INV${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
    date: new Date().toISOString().slice(0, 10),
    amount: '12,800.00',
    currency: 'USD',
    quantity: '1,000',
    unit: 'pcs',
    hsCode: '8539.52.0000',
    productName: 'LED Panel Light 36W',
    portOfLoading: 'Shenzhen',
    portOfDischarge: 'Los Angeles',
  };

  const fieldNotes: Record<string, string> = {
    amount: '金额字段识别置信度较低，建议人工复核',
    quantity: '数量单位可能为 pcs/sets，请确认',
    hsCode: 'HS 编码建议通过归类功能二次校验',
  };

  return {
    docType: detectedType,
    fields,
    confidence: mockConfidence(78),
    fieldNotes,
  };
}

/**
 * 批量抽取
 */
export async function extractDocuments(
  items: { docType: string; fileName: string }[],
): Promise<OcrExtractResult[]> {
  const results: OcrExtractResult[] = [];
  for (const item of items) {
    results.push(await extractDocument(item.docType, item.fileName));
  }
  return results;
}
