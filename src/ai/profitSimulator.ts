/**
 * AI 报价利润模拟（规则引擎）
 *
 * 根据贸易术语、收入、各项成本、退税计算净利润
 */

import type { ProfitSimulationResult } from '../types/ai';
import { mockDelay } from './engine';

/** 贸易术语运费/保险占比规则（简化） */
const INCOTERM_FREIGHT_RATIO: Record<string, number> = {
  EXW: 0,
  FCA: 0.05,
  FOB: 0,
  CFR: 0.1,
  CIF: 0.12,
  DAP: 0.18,
  DDP: 0.2,
};

const INCOTERM_INSURANCE_RATIO: Record<string, number> = {
  EXW: 0,
  FCA: 0,
  FOB: 0,
  CFR: 0,
  CIF: 0.02,
  DAP: 0.03,
  DDP: 0.03,
};

/**
 * 利润模拟
 */
export async function simulateProfit(
  params: {
    incoterm: string;
    currency: string;
    revenue: number;
    productCost: number;
    freight?: number;
    insurance?: number;
    commissionRate?: number; // 佣金占收入比例
    vatRate?: number; // 增值税率
    refundRate?: number; // 退税率
  },
): Promise<ProfitSimulationResult> {
  await mockDelay(400);

  const { incoterm, currency, revenue } = params;
  const freightRate = INCOTERM_FREIGHT_RATIO[incoterm] ?? 0.1;
  const insuranceRate = INCOTERM_INSURANCE_RATIO[incoterm] ?? 0;
  const commissionRate = params.commissionRate ?? 0.03;
  const vatRate = params.vatRate ?? 0.13;
  const refundRate = params.refundRate ?? 0.13;

  const freight = params.freight ?? revenue * freightRate;
  const insurance = params.insurance ?? revenue * insuranceRate;
  const commission = revenue * commissionRate;

  // 退税金额 = FOB 收入 * 退税率 / (1 + 增值税率)
  const fobRevenue = incoterm === 'FOB' || incoterm === 'EXW' || incoterm === 'FCA' ? revenue : revenue - freight - insurance;
  const refundAmount = Math.max(0, fobRevenue * refundRate / (1 + vatRate));

  const costs = [
    { name: '产品成本', amount: params.productCost, note: '采购/生产成本' },
    { name: '运费', amount: freight, note: `按 ${incoterm} 条款计算` },
    { name: '保险费', amount: insurance, note: `按 ${incoterm} 条款计算` },
    { name: '佣金', amount: commission, note: `佣金率 ${commissionRate * 100}%` },
  ];

  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);
  const netProfit = revenue - totalCost + refundAmount;
  const profitRate = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return {
    incoterm,
    currency,
    revenue,
    costs,
    totalCost,
    refundAmount,
    netProfit,
    profitRate: Math.round(profitRate * 10) / 10,
  };
}
