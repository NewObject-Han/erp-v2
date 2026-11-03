/**
 * 日期格式化工具
 */
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

/** 格式化为 YYYY-MM-DD */
export function formatDate(input: string | Date | undefined | null): string {
  if (!input) return '-';
  return dayjs(input).format(DATE_FORMAT);
}

/** 格式化为 YYYY-MM-DD HH:mm */
export function formatDateTime(input: string | Date | undefined | null): string {
  if (!input) return '-';
  return dayjs(input).format(DATETIME_FORMAT);
}

/** 格式化为 YYYYMMDD（用于单号拼接） */
export function formatDateCompact(input: Date = new Date()): string {
  return dayjs(input).format('YYYYMMDD');
}

/** 相对天数：距今天数（负数为已过期） */
export function daysFromToday(input: string | Date | undefined | null): number {
  if (!input) return 0;
  return dayjs(input).startOf('day').diff(dayjs().startOf('day'), 'day');
}

/** 距今天还有 N 天（文案辅助） */
export function daysLeftText(input: string | Date | undefined | null): string {
  const d = daysFromToday(input);
  if (d < 0) return `已过期 ${Math.abs(d)} 天`;
  if (d === 0) return '今天到期';
  return `还剩 ${d} 天`;
}

export { dayjs, DATE_FORMAT, DATETIME_FORMAT };
