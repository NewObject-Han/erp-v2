/**
 * 货币格式化工具
 */
import dayjs from 'dayjs';

/** 币种符号表 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  HKD: 'HK$',
};

/** 获取币种符号 */
export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

/** 格式化金额（千分位） */
export function formatMoney(
  value: number | undefined | null,
  currency = 'CNY',
  digits = 2,
): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  const symbol = currencySymbol(currency);
  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

/** 格式化数字（千分位，无币种） */
export function formatNumber(value: number | undefined | null, digits = 0): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** 汇率换算（带日期的静态汇率表） */
const FX_RATES: Record<string, number> = {
  USD: 7.2,
  EUR: 7.9,
  GBP: 9.1,
  JPY: 0.048,
  HKD: 0.92,
};

/** 静态汇率换算（demo 固定汇率） */
export function convertToCny(amount: number, currency: string): number {
  if (currency === 'CNY') return amount;
  const rate = FX_RATES[currency] ?? 1;
  return Math.round(amount * rate * 100) / 100;
}

/** 汇率查表 */
export function getRate(currency: string): number {
  return FX_RATES[currency] ?? 1;
}

export { dayjs };
