import { Tag } from 'antd';
import { translateEnum } from '../../utils/labels';

const STATUS_COLOR_MAP: Record<string, string> = {
  draft: 'default',
  pending: 'warning',
  in_progress: 'processing',
  processing: 'processing',
  done: 'success',
  completed: 'success',
  closed: 'default',
  cancelled: 'default',
  rejected: 'error',
  expired: 'error',
  overdue: 'error',
  active: 'success',
  inactive: 'default',
  disabled: 'default',
  blacklist: 'error',
  delayed: 'warning',
  exception: 'error',
  open: 'warning',
  resolved: 'success',
  verified: 'success',
  received: 'success',
  approved: 'success',
  released: 'success',
  booked: 'blue',
  sent: 'cyan',
  confirmed: 'blue',
  shipped: 'success',
  open_ar: 'warning',
  paid: 'success',
  written_off: 'default',
  verified_fx: 'success',
};

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const color = STATUS_COLOR_MAP[status] ?? 'default';
  // 调用方未单独指定文案、或文案就是原始枚举时，统一翻译成中文
  const text = label == null || label === status ? translateEnum(status) : label;
  return (
    <Tag color={color} style={{ margin: 0, fontSize: 11, borderRadius: 2, lineHeight: '18px' }}>
      {text}
    </Tag>
  );
}
