import { useState } from 'react';
import { Card, Tabs, Input, Button, theme as antdTheme } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useInventories, useInboundOrders, useOutboundOrders, useTransferOrders, useStocktakeOrders, useStockAlerts, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import { exportTableCsv } from '../../utils/exportCsv';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function WarehousePage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');

  const { data: invData } = useInventories();
  const { data: inData } = useInboundOrders();
  const { data: outData } = useOutboundOrders();
  const { data: trData } = useTransferOrders();
  const { data: stData } = useStocktakeOrders();
  const { data: alData } = useStockAlerts();
  const lookups = useLookups();

  const inventories = (invData as unknown[]) ?? [];
  const inbounds = (inData as { list: AnyRow[] })?.list ?? [];
  const outbounds = (outData as { list: AnyRow[] })?.list ?? [];
  const transfers = (trData as { list: AnyRow[] })?.list ?? [];
  const stocktakes = (stData as { list: AnyRow[] })?.list ?? [];
  const alerts = (alData as unknown[]) ?? [];

  const invCols: TableProps<AnyRow>['columns'] = [
    { title: '商品', dataIndex: 'productId', width: 160, render: (v) => lookups.productName(v) },
    { title: '仓库', dataIndex: 'warehouseId', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '现有量', dataIndex: 'onHand', width: 80 },
    { title: '在途', dataIndex: 'onOrder', width: 70 },
    { title: '已预留', dataIndex: 'allocated', width: 80 },
    { title: '安全库存', dataIndex: 'safetyStock', width: 90 },
    { title: '单位成本', dataIndex: 'unitCost', width: 100, render: (v, r) => `${Number(v)} ${r.currency}` },
    { title: '批次', dataIndex: 'batchNo', width: 100 },
  ];
  const inCols: TableProps<AnyRow>['columns'] = [
    { title: '入库单号', dataIndex: 'code', width: 110 },
    { title: '仓库', dataIndex: 'warehouseId', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '关联采购', dataIndex: 'poId', width: 110, render: (v) => lookups.purchaseOrderCode(v) },
    { title: '入库日期', dataIndex: 'inboundDate', width: 110 },
    { title: '经办人', dataIndex: 'operator', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const outCols: TableProps<AnyRow>['columns'] = [
    { title: '出库单号', dataIndex: 'code', width: 110 },
    { title: '仓库', dataIndex: 'warehouseId', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '关联销售', dataIndex: 'soId', width: 110, render: (v) => lookups.salesOrderCode(v) },
    { title: '出库日期', dataIndex: 'outboundDate', width: 110 },
    { title: '经办人', dataIndex: 'operator', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const trCols: TableProps<AnyRow>['columns'] = [
    { title: '调拨单号', dataIndex: 'code', width: 110 },
    { title: '调出仓', dataIndex: 'fromWarehouse', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '调入仓', dataIndex: 'toWarehouse', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '调拨日期', dataIndex: 'transferDate', width: 110 },
    { title: '经办人', dataIndex: 'operator', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const stCols: TableProps<AnyRow>['columns'] = [
    { title: '盘点单号', dataIndex: 'code', width: 110 },
    { title: '仓库', dataIndex: 'warehouseId', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '盘点日期', dataIndex: 'stocktakeDate', width: 110 },
    { title: '调整金额', dataIndex: 'adjustAmount', width: 100, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '经办人', dataIndex: 'operator', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const alCols: TableProps<AnyRow>['columns'] = [
    { title: '商品', dataIndex: 'productId', width: 160, render: (v) => lookups.productName(v) },
    { title: '仓库', dataIndex: 'warehouseId', width: 100, render: (v) => lookups.warehouseName(v) },
    { title: '预警类型', dataIndex: 'type', width: 100 },
    { title: '消息', dataIndex: 'message', width: 200 },
    { title: '触发日期', dataIndex: 'triggeredAt', width: 110 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];

  const colsMap = [invCols, inCols, outCols, trCols, stCols, alCols];
  const rowsMap = [inventories, inbounds, outbounds, transfers, stocktakes, alerts];
  const tabLabels = ['库存', '入库', '出库', '调拨', '盘点', '预警'];

  const handleExport = () => {
    exportTableCsv(`仓储管理-${tabLabels[tab]}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  return (
    <div>
      <PageHeader title="仓储管理" subtitle="国内仓：成品仓 / 待运仓 / 物料仓 · 出入库 / 调拨 / 盘点 / 预警" actions={<Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button>} />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <Input prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />} placeholder="搜索..." value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 200, marginBottom: 12 }} variant="borderless" />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
    </div>
  );
}
