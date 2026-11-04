/**
 * 单据明细行编辑器
 *
 * 通用行内编辑表格：选择商品自动带出 SKU/HS 编码/单位，
 * 数量与单价联动计算小计，底部实时汇总合计金额。
 */
import { Button, InputNumber, Select, Table, theme as antdTheme } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

/** 通用明细行（宽松结构，兼容报价/PI/订单/样品明细） */
export interface LineItemRow {
  productId?: string;
  productName?: string;
  sku?: string;
  hsCode?: string;
  unit?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  costPrice?: number;
  profit?: number;
  profitRate?: number;
  remark?: string;
}

/** 商品元信息（选择后自动带出字段；Product 结构兼容） */
export interface ProductMeta {
  id: string;
  name?: string;
  sku?: string;
  hsCode?: string;
  unit?: string;
  salePrice?: number;
  costPrice?: number;
}

interface LineItemsEditorProps {
  items: LineItemRow[];
  onChange: (items: LineItemRow[]) => void;
  products?: ProductMeta[];
  /** 是否显示成本价列（报价单） */
  showCost?: boolean;
  currency?: string;
}

const fmt = (v: number) =>
  v.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function LineItemsEditor({
  items,
  onChange,
  products = [],
  showCost = false,
  currency,
}: LineItemsEditorProps) {
  const { token } = antdTheme.useToken();

  const updateRow = (idx: number, patch: Partial<LineItemRow>) => {
    onChange(items.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const removeRow = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const costCol: NonNullable<TableProps<LineItemRow>['columns']>[number] = {
    title: '成本价',
    dataIndex: 'costPrice',
    width: 100,
    render: (_, row, idx) => (
      <InputNumber
        size="small"
        variant="borderless"
        min={0}
        step={0.01}
        style={{ width: '100%' }}
        value={row.costPrice}
        onChange={(v) => updateRow(idx, { costPrice: v ?? 0 })}
      />
    ),
  };

  const columns: TableProps<LineItemRow>['columns'] = [
    {
      title: '商品',
      dataIndex: 'productId',
      width: 200,
      render: (_, row, idx) => (
        <Select
          size="small"
          variant="borderless"
          showSearch
          optionFilterProp="label"
          placeholder="选择商品"
          style={{ width: '100%' }}
          value={row.productId}
          options={products.map((p) => ({ value: p.id, label: p.name ?? p.sku ?? p.id }))}
          onChange={(pid) => {
            const p = products.find((x) => x.id === pid);
            updateRow(idx, {
              productId: pid,
              productName: p?.name,
              sku: p?.sku,
              hsCode: p?.hsCode,
              unit: p?.unit,
              unitPrice: row.unitPrice ?? p?.salePrice,
            });
          }}
        />
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 110,
      ellipsis: true,
      render: (v) => String(v ?? '—'),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 95,
      render: (_, row, idx) => (
        <InputNumber
          size="small"
          variant="borderless"
          min={0}
          style={{ width: '100%' }}
          value={row.quantity}
          onChange={(v) =>
            updateRow(idx, {
              quantity: v ?? 0,
              totalPrice: (v ?? 0) * Number(row.unitPrice ?? 0),
            })
          }
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 105,
      render: (_, row, idx) => (
        <InputNumber
          size="small"
          variant="borderless"
          min={0}
          step={0.01}
          style={{ width: '100%' }}
          value={row.unitPrice}
          onChange={(v) =>
            updateRow(idx, {
              unitPrice: v ?? 0,
              totalPrice: Number(row.quantity ?? 0) * (v ?? 0),
            })
          }
        />
      ),
    },
    ...(showCost ? [costCol] : []),
    {
      title: '小计',
      key: '__subtotal',
      width: 110,
      align: 'right',
      render: (_, row) => (
        <span style={{ fontWeight: 600 }}>
          {fmt(Number(row.quantity ?? 0) * Number(row.unitPrice ?? 0))}
        </span>
      ),
    },
    {
      title: '',
      key: '__op',
      width: 40,
      render: (_, __, idx) => (
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(idx)}
        />
      ),
    },
  ];

  const grandTotal = items.reduce(
    (s, it) => s + Number(it.quantity ?? 0) * Number(it.unitPrice ?? 0),
    0,
  );

  return (
    <div>
      <Table<LineItemRow>
        size="small"
        rowKey={(_, i) => String(i)}
        columns={columns}
        dataSource={items}
        pagination={false}
        locale={{ emptyText: '暂无明细，点击下方按钮添加' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onChange([...items, { quantity: 1 }])}
        >
          添加明细行
        </Button>
        <span style={{ fontSize: 13, color: token.colorTextSecondary }}>
          共 {items.length} 行，合计{' '}
          <b style={{ color: token.colorPrimary, fontSize: 15 }}>
            {fmt(grandTotal)} {currency}
          </b>
        </span>
      </div>
    </div>
  );
}
