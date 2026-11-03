/**
 * ID 生成器
 *
 * 规则：业务前缀 + 日期 + 序号，例如 INV20261103-001
 */

let counter: Record<string, number> = {};

/** 生成业务单号：prefix + yyyymmdd + '-' + 3 位序号 */
export function genBizNo(prefix: string, date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dayKey = `${prefix}-${y}${m}${d}`;
  counter[dayKey] = (counter[dayKey] || 0) + 1;
  const seq = String(counter[dayKey]).padStart(3, '0');
  return `${prefix}${y}${m}${d}-${seq}`;
}

/** 生成简单 UUID（用于实体 ID） */
export function genId(prefix = 'id'): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${ts}${rand}`;
}

/** 重置计数器（种子数据装载时使用） */
export function resetCounter(): void {
  counter = {};
}
