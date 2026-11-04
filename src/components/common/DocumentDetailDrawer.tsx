/**
 * 单据详情抽屉
 *
 * 上半部分 Descriptions 展示单据元信息，
 * 下半部分明细行（可编辑 LineItemsEditor 或只读表格），
 * 支持底部操作区（保存明细/打印等）与附加内容（如询盘邮件原文）。
 */
import { Descriptions, Divider, Drawer, Table } from 'antd';
import type { TableProps } from 'antd';
import type { ReactNode } from 'react';
import LineItemsEditor, {
  type LineItemRow,
  type ProductMeta,
} from './LineItemsEditor';

export interface DetailField {
  label: string;
  value: ReactNode;
}

interface DocumentDetailDrawerProps {
  open: boolean;
  title: string;
  width?: number;
  /** 单据元信息字段 */
  fields: DetailField[];
  /** 明细行；null/undefined 不显示明细区 */
  items?: LineItemRow[] | null;
  /** 传入则明细可编辑 */
  onItemsChange?: (items: LineItemRow[]) => void;
  products?: ProductMeta[];
  showCost?: boolean;
  currency?: string;
  /** 明细区之后的附加内容（邮件原文、备注块等） */
  extra?: ReactNode;
  onClose: () => void;
  /** 底部操作区（保存/打印按钮） */
  footer?: ReactNode;
}

const fmt = (v: number) =>
  v.toLocaleString('en-US', { maximumFractionDigits: 2 });

function ReadOnlyItems({ items, currency }: { items: LineItemRow[]; currency?: string }) {
  const total = items.reduce(
    (s, it) => s + Number(it.quantity ?? 0) * Number(it.unitPrice ?? 0),
    0,
  );
  const columns: TableProps<LineItemRow>['columns'] = [
    { title: '品名', dataIndex: 'productName', render: (v, r) => String(v ?? r.productId ?? '—') },
    { title: 'SKU', dataIndex: 'sku', width: 120, ellipsis: true, render: (v) => String(v ?? '—') },
    { title: '数量', dataIndex: 'quantity', width: 80, align: 'right', render: (v) => fmt(Number(v ?? 0)) },
    { title: '单价', dataIndex: 'unitPrice', width: 90, align: 'right', render: (v) => (v != null ? fmt(Number(v)) : '—') },
    {
      title: '小计',
      key: '__subtotal',
      width: 110,
      align: 'right',
      render: (_, r) => (
        <b>{fmt(Number(r.quantity ?? 0) * Number(r.unitPrice ?? 0))} {currency}</b>
      ),
    },
  ];
  return (
    <>
      <Table<LineItemRow>
        size="small"
        rowKey={(_, i) => String(i)}
        columns={columns}
        dataSource={items}
        pagination={false}
        locale={{ emptyText: '暂无明细' }}
      />
      <div style={{ textAlign: 'right', marginTop: 8, fontSize: 13 }}>
        合计 <b style={{ fontSize: 15 }}>{fmt(total)} {currency}</b>
      </div>
    </>
  );
}

export default function DocumentDetailDrawer({
  open,
  title,
  width = 860,
  fields,
  items,
  onItemsChange,
  products,
  showCost,
  currency,
  extra,
  onClose,
  footer,
}: DocumentDetailDrawerProps) {
  return (
    <Drawer
      open={open}
      title={title}
      width={width}
      onClose={onClose}
      footer={footer}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <Descriptions
        size="small"
        bordered
        column={2}
        items={fields.map((f) => ({
          key: f.label,
          label: f.label,
          children: f.value ?? '—',
        }))}
      />
      {items != null && (
        <>
          <Divider
            orientation="left"
            orientationMargin={0}
            style={{ fontSize: 13, margin: '16px 0 8px' }}
          >
            商品明细
          </Divider>
          {onItemsChange ? (
            <LineItemsEditor
              items={items}
              onChange={onItemsChange}
              products={products}
              showCost={showCost}
              currency={currency}
            />
          ) : (
            <ReadOnlyItems items={items} currency={currency} />
          )}
        </>
      )}
      {extra}
    </Drawer>
  );
}
