import { Table, type TableProps } from 'antd';
import type { Key } from 'react';

interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[];
  columns: TableProps<T>['columns'];
  rowHeight?: number;
  loading?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  loading,
}: DataTableProps<T>) {
  return (
    <Table<T>
      columns={columns as TableProps<T>['columns']}
      dataSource={rows}
      rowKey="id"
      size="small"
      loading={loading}
      pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
      scroll={{ x: 'max-content' }}
      style={{ fontSize: 12 }}
    />
  );
}

export type { Key };
