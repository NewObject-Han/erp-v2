import { useEffect, useState } from 'react';
import { Button, Checkbox, Popover, Table, Typography, type TableProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { Key } from 'react';

const { Text } = Typography;

/** 列显示配置的 localStorage 键 */
const colVisKey = (key: string) => `erp-v2:colvis:${key}`;

/** 列唯一标识（用于显隐配置） */
function colId(c: { key?: unknown; dataIndex?: unknown; title?: unknown }): string {
  return String(c.key ?? c.dataIndex ?? c.title);
}

interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[];
  columns: TableProps<T>['columns'];
  rowHeight?: number;
  loading?: boolean;
  /** 传入后启用“列显示配置”（按 key 持久化到 localStorage） */
  settingKey?: string;
  /** 行选择（批量操作用） */
  rowSelection?: TableProps<T>['rowSelection'];
}

export default function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  loading,
  settingKey,
  rowSelection,
}: DataTableProps<T>) {
  const [hidden, setHidden] = useState<string[]>(() => {
    if (!settingKey) return [];
    try {
      return JSON.parse(localStorage.getItem(colVisKey(settingKey)) ?? '[]') as string[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (settingKey) localStorage.setItem(colVisKey(settingKey), JSON.stringify(hidden));
  }, [hidden, settingKey]);

  const allCols = (columns ?? []) as NonNullable<TableProps<T>['columns']>;
  const visibleCols = settingKey
    ? allCols.filter((c) => !hidden.includes(colId(c)))
    : allCols;

  const toggleCol = (id: string, checked: boolean) => {
    setHidden((prev) => (checked ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div>
      {settingKey && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Popover
            trigger="click"
            placement="bottomRight"
            title={<Text strong style={{ fontSize: 13 }}>列显示配置</Text>}
            content={
              <div style={{ width: 200 }}>
                {allCols.map((c) => {
                  const id = colId(c);
                  return (
                    <div key={id} style={{ padding: '3px 0' }}>
                      <Checkbox
                        checked={!hidden.includes(id)}
                        onChange={(e) => toggleCol(id, e.target.checked)}
                        style={{ fontSize: 12.5 }}
                      >
                        {typeof c.title === 'string' ? c.title : id}
                      </Checkbox>
                    </div>
                  );
                })}
                <Button
                  size="small"
                  type="link"
                  style={{ padding: 0, marginTop: 6, fontSize: 12 }}
                  onClick={() => setHidden([])}
                >
                  恢复默认
                </Button>
              </div>
            }
          >
            <Button size="small" icon={<SettingOutlined />} style={{ fontSize: 12 }}>列设置</Button>
          </Popover>
        </div>
      )}
      <Table<T>
        columns={visibleCols as TableProps<T>['columns']}
        dataSource={rows}
        rowKey="id"
        size="small"
        loading={loading}
        rowSelection={rowSelection}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 'max-content' }}
        style={{ fontSize: 12 }}
      />
    </div>
  );
}

export type { Key };
