import { useState } from 'react';
import { Card, Tabs, Button, Input, Form, InputNumber, Select, Space, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useBookings, useCustoms, useDocuments, useLogisticsTrack, useCreateBooking, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import { exportTableCsv } from '../../utils/exportCsv';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function LogisticsPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form] = Form.useForm();
  const lookups = useLookups();

  const { data: bookingData } = useBookings();
  const { data: customsData } = useCustoms();
  const { data: docsData } = useDocuments();
  const { data: trackingData } = useLogisticsTrack();
  const createBooking = useCreateBooking();

  const bookings = (bookingData as AnyRow[]) ?? [];
  const customs = (customsData as AnyRow[]) ?? [];
  const docs = (docsData as AnyRow[]) ?? [];
  const trackings = (trackingData as AnyRow[]) ?? [];

  const handleSave = () => {
    const values = form.getFieldsValue();
    createBooking.mutate({ ...values, id: `bk_${Date.now()}`, code: `BK-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString() } as never);
    setDialogOpen(false);
    form.resetFields();
  };

  const DOC_TYPE_LABEL: Record<string, string> = {
    commercial_invoice: '商业发票',
    packing_list: '装箱单',
    certificate_of_origin: '原产地证',
    bill_of_lading: '提单',
    customs_declaration: '报关单',
    other: '其他',
  };
  const bookingCols: TableProps<AnyRow>['columns'] = [
    { title: '订舱号', dataIndex: 'code', width: 130 },
    { title: '船名/航次', width: 150, render: (_, r) => `${r.vessel ?? '-'} / ${r.voyage ?? '-'}` },
    { title: '起运港', dataIndex: 'portOfLoading', width: 100 },
    { title: '目的港', dataIndex: 'portOfDischarge', width: 110 },
    { title: 'ETD', dataIndex: 'etd', width: 100 },
    { title: 'ETA', dataIndex: 'eta', width: 100 },
    { title: '柜型/柜量', width: 90, render: (_, r) => `${r.containerType ?? '-'} × ${r.containerQty ?? '-'}` },
    { title: '货代', dataIndex: 'forwarder', width: 100 },
    { title: '状态', dataIndex: 'status', width: 90, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const customsCols: TableProps<AnyRow>['columns'] = [
    { title: '报关单号', dataIndex: 'code', width: 130 },
    { title: '订单号', dataIndex: 'salesOrderId', width: 110, render: (v) => lookups.salesOrderCode(v) },
    { title: '商品名称', dataIndex: 'productName', width: 160 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '申报金额', dataIndex: 'declareValue', width: 110, render: (v, r) => `${Number(v ?? 0).toLocaleString()} ${r.currency ?? ''}` },
    { title: '出口日期', dataIndex: 'exportDate', width: 100 },
    { title: '状态', dataIndex: 'status', width: 90, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const docsCols: TableProps<AnyRow>['columns'] = [
    { title: '单据编号', dataIndex: 'code', width: 150 },
    { title: '类型', dataIndex: 'type', width: 100, render: (v) => DOC_TYPE_LABEL[String(v)] ?? String(v) },
    { title: '订单号', dataIndex: 'salesOrderId', width: 110, render: (v) => lookups.salesOrderCode(v) },
    { title: '金额', width: 120, render: (_, r) => { const c = (r.content ?? {}) as AnyRow; return c.totalAmount != null ? `${Number(c.totalAmount).toLocaleString()} ${c.currency ?? ''}` : '-'; } },
    { title: '签发日期', dataIndex: 'issueDate', width: 100 },
    { title: '状态', dataIndex: 'status', width: 90, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const trackingCols: TableProps<AnyRow>['columns'] = [
    { title: '当前状态', dataIndex: 'currentStatus', width: 100 },
    { title: '当前位置', width: 160, render: (_, r) => { const pts = (r.points ?? []) as AnyRow[]; return pts.length ? `${pts[pts.length - 1].location ?? '-'}` : '-'; } },
    { title: '最新动态', width: 220, render: (_, r) => { const pts = (r.points ?? []) as AnyRow[]; return pts.length ? `${pts[pts.length - 1].event ?? ''} · ${pts[pts.length - 1].description ?? ''}` : '-'; } },
    { title: '预计到港', dataIndex: 'eta', width: 100 },
    { title: '异常', dataIndex: 'hasException', width: 70, render: (v) => (v ? <StatusBadge status="overdue" label="异常" /> : <StatusBadge status="done" label="正常" />) },
    { title: '最后更新', dataIndex: 'updatedAt', width: 150, render: (v) => (v ? String(v).slice(0, 10) : '-') },
  ];

  const colsMap = [bookingCols, customsCols, docsCols, trackingCols];
  const rowsMap = [bookings, customs, docs, trackings];
  const tabLabels = ['订舱管理', '报关管理', '单证管理', '物流轨迹'];

  const handleExport = () => {
    exportTableCsv(`物流单证-${tabLabels[tab]}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  return (
    <div>
      <PageHeader title="物流单证" subtitle="订舱 · 报关 · 装箱单证 · 物流追踪" actions={<Space><Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button>{tab === 0 ? <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => { form.resetFields(); setDialogOpen(true); }}>新增订舱</Button> : null}</Space>} />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <Input prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />} placeholder="搜索..." value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 200, marginBottom: 12 }} variant="borderless" />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
      <FormDialog open={dialogOpen} title="新增订舱" onClose={() => setDialogOpen(false)} onSave={handleSave} width={640}>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
          <Form.Item name="vessel" label="船名"><Input size="small" /></Form.Item>
          <Form.Item name="voyage" label="航次"><Input size="small" /></Form.Item>
          <Form.Item name="portOfLoading" label="起运港"><Input size="small" /></Form.Item>
          <Form.Item name="portOfDischarge" label="目的港"><Input size="small" /></Form.Item>
          <Form.Item name="etd" label="ETD"><Input size="small" placeholder="YYYY-MM-DD" /></Form.Item>
          <Form.Item name="eta" label="ETA"><Input size="small" placeholder="YYYY-MM-DD" /></Form.Item>
          <Form.Item name="currency" label="币种"><Select size="small" options={[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'CNY', value: 'CNY' }]} /></Form.Item>
        </Form>
      </FormDialog>
    </div>
  );
}
