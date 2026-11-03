/**
 * AI 智能装箱计算（规则引擎）
 *
 * 根据商品体积、重量与柜型容量计算最优装箱方案
 */

import type { PackingPlan } from '../types/ai';
import { mockDelay } from './engine';

/** 柜型容量（长×宽×高 cm，容积 m³，最大载重 kg） */
const CONTAINER_CAPACITY: Record<string, { volume: number; maxWeight: number }> = {
  '20GP': { volume: 33.2, maxWeight: 21700 },
  '40GP': { volume: 67.7, maxWeight: 26700 },
  '40HQ': { volume: 76.3, maxWeight: 26500 },
};

interface ProductPackInfo {
  /** 单件体积 m³ */
  volume: number;
  /** 单件重量 kg */
  weight: number;
  quantity: number;
}

/**
 * 计算最优装箱方案
 */
export async function calculatePacking(
  containerType: string,
  items: ProductPackInfo[],
): Promise<PackingPlan> {
  await mockDelay(600);

  const capacity = CONTAINER_CAPACITY[containerType] ?? CONTAINER_CAPACITY['40GP'];
  const totalVolume = items.reduce((sum, i) => sum + i.volume * i.quantity, 0);
  const totalWeight = items.reduce((sum, i) => sum + i.weight * i.quantity, 0);

  const containerQtyByVolume = Math.ceil(totalVolume / capacity.volume);
  const containerQtyByWeight = Math.ceil(totalWeight / capacity.maxWeight);
  const containerQty = Math.max(containerQtyByVolume, containerQtyByWeight, 1);

  const loadedVolume = Math.min(totalVolume, capacity.volume * containerQty);
  const utilizationRate = containerQty > 0
    ? Math.round((loadedVolume / (capacity.volume * containerQty)) * 100)
    : 0;

  const totalLoadedQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    containerType,
    containerQty,
    totalLoadedQty,
    totalVolume: Math.round(loadedVolume * 100) / 100,
    totalWeight: Math.round(totalWeight * 100) / 100,
    utilizationRate,
    note: utilizationRate >= 85
      ? '装载率优秀，方案经济高效'
      : utilizationRate >= 70
        ? '装载率良好，可考虑优化'
        : '装载率偏低，建议合并订单或更换柜型',
  };
}

/** 推荐柜型 */
export function recommendContainer(totalVolume: number, totalWeight: number): string {
  const byVolume = Object.entries(CONTAINER_CAPACITY)
    .filter(([, c]) => totalVolume <= c.volume)
    .map(([k]) => k);
  const candidates = byVolume.length
    ? byVolume
    : Object.keys(CONTAINER_CAPACITY);
  return candidates[0] ?? '40GP';
}
