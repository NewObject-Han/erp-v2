import { useState } from 'react';
import { Card, Tabs, Input, Button, theme as antdTheme } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useReceivables, usePayables, useCostAnalyses, useExpenses, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { exportTableCsv } from '../../utils/exportCsv';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function FinancePage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');

  const { data: arData } = useReceivables({ keyword: kw });
  const { data: apData } = usePayables({ keyword: kw });
  const { data: costData } = useCostAnalyses();
  const { data: expData } = useExpenses({ keyword: kw });
  const lookups = useLookups();

  const arList = (arData as { list: AnyRow[] })?.list ?? [];
  const apList = (apData as { list: AnyRow[] })?.list ?? [];
  const costs = (costData as unknown[]) ?? [];
  const expenses = (expData as { list: AnyRow[] })?.list ?? [];

  const arCols: TableProps<AnyRow>['columns'] = [
    { title: '应收单号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '金额', dataIndex: 'amount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '折合CNY', dataIndex: 'amountCny', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '已收', dataIndex: 'paidAmount', width: 100, render: (v) => `${Number(v).toLocaleString()}` },
    { title: '到期日', dataIndex: 'dueDate', width: 110 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const apCols: TableProps<AnyRow>['columns'] = [
    { title: '应付单号', dataIndex: 'code', width: 110 },
    { title: '供应商', dataIndex: 'supplierId', width: 140, render: (v) => lookups.supplierName(v) },
    { title: '金额', dataIndex: 'amount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '折合CNY', dataIndex: 'amountCny', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '已付', dataIndex: 'paidAmount', width: 100, render: (v) => `${Number(v).toLocaleString()}` },
    { title: '到期日', dataIndex: 'dueDate', width: 110 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const costCols: TableProps<AnyRow>['columns'] = [
    { title: '销售订单', dataIndex: 'salesOrderId', width: 120, render: (v) => lookups.salesOrderCode(v) },
    { title: '总成本', dataIndex: 'totalCost', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '收入CNY', dataIndex: 'revenueCny', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '毛利', dataIndex: 'grossProfit', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '毛利率', dataIndex: 'profitRate', width: 80, render: (v) => `${Number(v)}%` },
  ];
  const expCols: TableProps<AnyRow>['columns'] = [
    { title: '费用单号', dataIndex: 'code', width: 110 },
    { title: '类型', dataIndex: 'type', width: 90 },
    { title: '部门', dataIndex: 'department', width: 100 },
    { title: '金额', dataIndex: 'amount', width: 100, render: (v, r) => `${Number(v)} ${r.currency}` },
    { title: '折合CNY', dataIndex: 'amountCny', width: 110, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '日期', dataIndex: 'date', width: 110 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];

  const colsMap = [arCols, apCols, costCols, expCols];
  const rowsMap = [arList, apList, costs, expenses];
  const tabLabels = ['应收', '应付', '成本', '费用'];

  const handleExport = () => {
    exportTableCsv(`财务管理-${tabLabels[tab]}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  return (
    <div>
      <PageHeader
        title="财务管理"
        subtitle="应收 · 应付 · 成本 · 费用"
        actions={<Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button>}
      />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <Input prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />} placeholder="搜索..." value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 200, marginBottom: 12 }} variant="borderless" />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
    </div>
  );
}
