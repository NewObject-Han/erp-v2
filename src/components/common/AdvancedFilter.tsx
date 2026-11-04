/**
 * 高级筛选（Popover 表单）
 *
 * 由调用方声明字段（下拉等值 / 数值区间），
 * 筛选值以受控对象交还调用方自行过滤列表。
 */
import { Button, InputNumber, Popover, Select, Space, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface FilterField {
  name: string;
  label: string;
  /** select：等值匹配；numberRange：数值区间 */
  type: 'select' | 'numberRange';
  options?: { label: string; value: string }[];
}

/** 筛选值：select 存字符串，numberRange 存 [min, max] */
export type FilterValue = Record<string, string | [number | undefined, number | undefined] | undefined>;

interface AdvancedFilterProps {
  fields: FilterField[];
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

/** 判断是否有生效中的筛选项 */
export function hasActiveFilter(value: FilterValue): boolean {
  return Object.values(value).some((v) => {
    if (v == null || v === '') return false;
    if (Array.isArray(v)) return v[0] != null || v[1] != null;
    return true;
  });
}

export default function AdvancedFilter({ fields, value, onChange }: AdvancedFilterProps) {
  const active = hasActiveFilter(value);

  const set = (name: string, v: FilterValue[string]) => {
    onChange({ ...value, [name]: v });
  };

  const content = (
    <div style={{ width: 230 }}>
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        {fields.map((f) => (
          <div key={f.name}>
            <Text type="secondary" style={{ fontSize: 11.5 }}>{f.label}</Text>
            <div style={{ marginTop: 3 }}>
              {f.type === 'select' ? (
                <Select
                  size="small"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={`选择${f.label}`}
                  value={(value[f.name] as string) || undefined}
                  onChange={(v) => set(f.name, v)}
                  options={f.options}
                />
              ) : (
                <Space size={6}>
                  <InputNumber
                    size="small"
                    placeholder="最小"
                    style={{ width: 100 }}
                    value={(value[f.name] as [number | undefined, number | undefined])?.[0]}
                    onChange={(v) => set(f.name, [v ?? undefined, (value[f.name] as [number | undefined, number | undefined])?.[1]])}
                  />
                  <InputNumber
                    size="small"
                    placeholder="最大"
                    style={{ width: 100 }}
                    value={(value[f.name] as [number | undefined, number | undefined])?.[1]}
                    onChange={(v) => set(f.name, [(value[f.name] as [number | undefined, number | undefined])?.[0], v ?? undefined])}
                  />
                </Space>
              )}
            </div>
          </div>
        ))}
        <Button size="small" style={{ fontSize: 12 }} onClick={() => onChange({})}>
          重置全部筛选
        </Button>
      </Space>
    </div>
  );

  return (
    <Popover trigger="click" placement="bottomRight" title={<Text strong style={{ fontSize: 13 }}>高级筛选</Text>} content={content}>
      <Button size="small" icon={<FilterOutlined />} style={{ fontSize: 12 }} type={active ? 'primary' : 'default'}>
        筛选{active ? ' ·' : ''}
      </Button>
    </Popover>
  );
}
