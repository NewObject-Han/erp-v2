import { useState } from 'react';
import { Card, Tabs, Input, theme as antdTheme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRefunds, useVatRecords, useFxVerifications, useLcDocs, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function TaxPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');

  const { data: refundData } = useRefunds({ keyword: kw });
  const { data: vatData } = useVatRecords();
  const { data: fxData } = useFxVerifications({ keyword: kw });
  const { data: lcData } = useLcDocs({ keyword: kw });
  const lookups = useLookups();

  const refunds = (refundData as { list: AnyRow[] })?.list ?? [];
  const vats = (vatData as unknown[]) ?? [];
  const fvs = (fxData as { list: AnyRow[] })?.list ?? [];
  const lcs = (lcData as { list: AnyRow[] })?.list ?? [];

  const refundCols: TableProps<AnyRow>['columns'] = [
    { title: '申报单号', dataIndex: 'code', width: 110 },
    { title: '销售订单', dataIndex: 'salesOrderId', width: 120, render: (v) => lookups.salesOrderCode(v) },
    { title: '申报金额', dataIndex: 'declareAmount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '退税率', dataIndex: 'taxRate', width: 70, render: (v) => `${Number(v)}%` },
    { title: '应退税额', dataIndex: 'refundAmount', width: 100, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '申报期间', dataIndex: 'period', width: 90 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const vatCols: TableProps<AnyRow>['columns'] = [
    { title: '单号', dataIndex: 'code', width: 110 },
    { title: '类型', dataIndex: 'type', width: 70, render: (v) => v === 'input' ? '进项' : '销项' },
    { title: '金额', dataIndex: 'amount', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '税率', dataIndex: 'taxRate', width: 70, render: (v) => `${Number(v)}%` },
    { title: '税额', dataIndex: 'taxAmount', width: 100, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '期间', dataIndex: 'period', width: 90 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const fxCols: TableProps<AnyRow>['columns'] = [
    { title: '核销单号', dataIndex: 'code', width: 110 },
    { title: '收汇水单号', dataIndex: 'receiptNo', width: 130 },
    { title: '收汇金额', dataIndex: 'amount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '收汇日期', dataIndex: 'receiptDate', width: 110 },
    { title: '核销金额', dataIndex: 'verifiedAmount', width: 110, render: (v) => `${Number(v).toLocaleString()}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const lcCols: TableProps<AnyRow>['columns'] = [
    { title: '信用证号', dataIndex: 'lcNo', width: 130 },
    { title: '销售订单', dataIndex: 'salesOrderId', width: 120, render: (v) => lookups.salesOrderCode(v) },
    { title: '金额', dataIndex: 'amount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '开证日期', dataIndex: 'issueDate', width: 110 },
    { title: '效期', dataIndex: 'expiryDate', width: 110 },
    { title: '开证行', dataIndex: 'issuingBank', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];

  const colsMap = [refundCols, vatCols, fxCols, lcCols];
  const rowsMap = [refunds, vats, fvs, lcs];
  const tabLabels = ['出口退税', '增值税', '外汇核销', '信用证'];

  return (
    <div>
      <PageHeader title="税务外汇" subtitle="出口退税 · 增值税 · 外汇核销 · 信用证" />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <Input prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />} placeholder="搜索..." value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 200, marginBottom: 12 }} variant="borderless" />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
    </div>
  );
}
