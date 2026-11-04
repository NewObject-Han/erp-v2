/**
 * CSV 导出工具
 */

import type { TableProps } from 'antd';

/** 将二维数组导出为 CSV 文件并触发浏览器下载 */
export function exportCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
): void {
  const escapeCell = (cell: string | number | null | undefined): string => {
    const text = cell === null || cell === undefined ? '' : String(cell);
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [headers.map(escapeCell).join(',')];
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(','));
  }

  // 添加 BOM 以兼容 Excel 中文
  const csv = `﻿${lines.join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 按 antd 表格列定义导出当前表格数据为 CSV
 *
 * 仅导出含 dataIndex 的列（操作列等自动跳过），取原始值而非 render 结果
 */
export function exportTableCsv<T extends Record<string, unknown>>(
  filename: string,
  columns: TableProps<T>['columns'],
  rows: T[],
): void {
  const cols = (columns ?? []).filter(
    (c): c is { dataIndex: unknown; title: React.ReactNode } => 'dataIndex' in c && c.dataIndex != null,
  );
  const headers = cols.map((c) => String(typeof c.title === 'string' ? c.title : ''));
  const dataRows = rows.map((row) =>
    cols.map((c) => {
      const key = c.dataIndex as string | string[];
      const value = Array.isArray(key)
        ? key.reduce<unknown>((acc, k) => (acc == null ? acc : (acc as Record<string, unknown>)[k]), row)
        : row[key as string];
      if (value == null || typeof value === 'object') return '';
      return value as string | number;
    }),
  );
  exportCsv(filename, headers, dataRows);
}
