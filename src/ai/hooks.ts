/**
 * AI 能力 React Query hooks
 */

import { useMutation } from '@tanstack/react-query';
import { parseEmail } from './emailParser';
import { extractDocument } from './ocrExtractor';
import { classifyHs } from './hsClassifier';
import { simulateProfit } from './profitSimulator';
import { calculatePacking } from './packingCalculator';
import { auditDocuments } from './documentAudit';

/** 询价邮件解析 hook */
export function useEmailParse() {
  return useMutation({
    mutationFn: (text: string) => parseEmail(text),
  });
}

/** OCR 文档抽取 hook */
export function useOcrExtract() {
  return useMutation({
    mutationFn: (text: string) => extractDocument(text),
  });
}

/** HS 编码归类 hook */
export function useHsClassify() {
  return useMutation({
    mutationFn: (text: string) => classifyHs(text),
  });
}

/** 报价利润模拟 hook */
export function useProfitSimulation() {
  return useMutation({
    mutationFn: (params: { revenue: number; currency: string; incoterm: string }) =>
      simulateProfit(params),
  });
}

/** 智能装箱计算 hook */
export function usePackingCalc() {
  return useMutation({
    mutationFn: (params: { productName: string; quantity: number; containerType: string }) =>
      calculatePacking(params),
  });
}

/** 单证一致性审核 hook */
export function useDocumentAudit() {
  return useMutation({
    mutationFn: (params: { documents: Record<string, unknown>[] }) =>
      auditDocuments(params),
  });
}
