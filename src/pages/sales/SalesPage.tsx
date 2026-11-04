import { useState } from 'react';
import { Card, Tabs, Input, Button, Form, InputNumber, Select, Row, Col, Space, Popconfirm, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import {
  useInquiries, useQuotations, useSalesOrders, useSampleOrders, usePiDocs,
  useCreateInquiry, useUpdateInquiry, useDeleteInquiry,
  useCreateQuotation, useUpdateQuotation, useDeleteQuotation,
  useCreateSample, useUpdateSample, useDeleteSample,
  useCreatePi, useUpdatePi, useDeletePi,
  useCreateSalesOrder, useUpdateSalesOrder, useDeleteSalesOrder,
  useLookups,
} from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import WorkflowGuide from '../../components/common/WorkflowGuide';
import { INQUIRY_STATUS_LABELS, QUOTATION_STATUS_LABELS, ORDER_STATUS_LABELS } from '../../data/constants/labels';
import { exportTableCsv } from '../../utils/exportCsv';
import type { TableProps } from 'antd';

const workflowSteps = [
  { label: '询盘', to: '/sales' },
  { label: '报价', to: '/sales' },
  { label: '样品', to: '/sales' },
  { label: 'PI', to: '/sales' },
  { label: '订单', to: '/sales' },
  { label: '采购', to: '/purchase' },
  { label: '跟单', to: '/tracking' },
];

type AnyRow = Record<string, unknown>;

const CURRENCY_OPTIONS = [{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'CNY', value: 'CNY' }];
const INCOTERM_OPTIONS = [{ label: 'FOB', value: 'FOB' }, { label: 'CIF', value: 'CIF' }, { label: 'EXW', value: 'EXW' }, { label: 'DDP', value: 'DDP' }];

const SAMPLE_STATUS_OPTIONS = [
  { label: '待寄送', value: 'pending' },
  { label: '已寄送', value: 'sent' },
  { label: '客户确认', value: 'confirmed' },
];
const PI_STATUS_OPTIONS = [
  { label: '草稿', value: 'draft' },
  { label: '已发送', value: 'sent' },
  { label: '已确认', value: 'confirmed' },
];

interface TabConfig {
  label: string;
  codePrefix: string;
  statusOptions: { label: string; value: string }[];
}

const TAB_CONFIGS: TabConfig[] = [
  {
    label: '询盘', codePrefix: 'INQ', statusOptions: Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    label: '报价', codePrefix: 'QT', statusOptions: Object.entries(QUOTATION_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    label: '样品', codePrefix: 'SMP', statusOptions: SAMPLE_STATUS_OPTIONS,
  },
  {
    label: 'PI', codePrefix: 'PI', statusOptions: PI_STATUS_OPTIONS,
  },
  {
    label: '销售订单', codePrefix: 'SO', statusOptions: Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
];

export default function SalesPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const [form] = Form.useForm();

  const { data: inquiriesData } = useInquiries({ keyword: kw });
  const { data: quotationsData } = useQuotations({ keyword: kw });
  const { data: ordersData } = useSalesOrders({ keyword: kw });
  const { data: samplesData } = useSampleOrders({ keyword: kw });
  const { data: piData } = usePiDocs({ keyword: kw });

  const createInquiry = useCreateInquiry();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();
  const createQuotation = useCreateQuotation();
  const updateQuotation = useUpdateQuotation();
  const deleteQuotation = useDeleteQuotation();
  const createSample = useCreateSample();
  const updateSample = useUpdateSample();
  const deleteSample = useDeleteSample();
  const createPi = useCreatePi();
  const updatePi = useUpdatePi();
  const deletePi = useDeletePi();
  const createOrder = useCreateSalesOrder();
  const updateOrder = useUpdateSalesOrder();
  const deleteOrder = useDeleteSalesOrder();
  const lookups = useLookups();

  const inquiries = (inquiriesData as { list: AnyRow[] })?.list ?? [];
  const quotations = (quotationsData as { list: AnyRow[] })?.list ?? [];
  const orders = (ordersData as { list: AnyRow[] })?.list ?? [];
  const samples = (samplesData as { list: AnyRow[] })?.list ?? [];
  const piDocs = (piData as { list: AnyRow[] })?.list ?? [];

  const config = TAB_CONFIGS[tab];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: config.statusOptions[0]?.value, currency: 'USD' });
    setDialogOpen(true);
  };
  const openEdit = (row: AnyRow) => {
    setEditing(row);
    form.resetFields();
    form.setFieldsValue(row);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    if (editing) {
      const payload = { id: String(editing.id), data: values as never };
      if (tab === 0) updateInquiry.mutate(payload);
      else if (tab === 1) updateQuotation.mutate(payload);
      else if (tab === 2) updateSample.mutate(payload);
      else if (tab === 3) updatePi.mutate(payload);
      else updateOrder.mutate(payload);
      setDialogOpen(false);
      return;
    }
    const now = Date.now();
    const base = { ...values, id: `${config.codePrefix.toLowerCase()}_${now}`, code: `${config.codePrefix}-${String(now).slice(-6)}`, createdAt: new Date().toISOString() } as never;
    if (tab === 0) createInquiry.mutate(base);
    else if (tab === 1) createQuotation.mutate(base);
    else if (tab === 2) createSample.mutate(base);
    else if (tab === 3) createPi.mutate(base);
    else createOrder.mutate(base);
    setDialogOpen(false);
  };

  const handleDelete = (row: AnyRow) => {
    const id = String(row.id);
    if (tab === 0) deleteInquiry.mutate(id);
    else if (tab === 1) deleteQuotation.mutate(id);
    else if (tab === 2) deleteSample.mutate(id);
    else if (tab === 3) deletePi.mutate(id);
    else deleteOrder.mutate(id);
  };

  const handleExport = () => {
    exportTableCsv(`销售管理-${config.label}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  const actionCol: TableProps<AnyRow>['columns'][number] = {
    title: '操作',
    key: '__actions',
    width: 110,
    render: (_, row) => (
      <Space size={0}>
        <Button type="link" size="small" style={{ padding: '0 4px', fontSize: 12 }} onClick={() => openEdit(row)}>编辑</Button>
        <Popconfirm title="确认删除该记录？" onConfirm={() => handleDelete(row)} okText="删除" cancelText="取消">
          <Button type="link" size="small" danger style={{ padding: '0 4px', fontSize: 12 }}>删除</Button>
        </Popconfirm>
      </Space>
    ),
  };

  const inquiryCols: TableProps<AnyRow>['columns'] = [
    { title: '编号', dataIndex: 'code', width: 100, render: (v, r) => String(v ?? r.id) },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '商品', dataIndex: 'productId', width: 140, render: (v) => lookups.productName(v) },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '目标价', dataIndex: 'targetPrice', width: 100, render: (v, r) => `${Number(v)} ${r.currency}` },
    { title: '来源', dataIndex: 'source', width: 90 },
    { title: '状态', dataIndex: 'status', width: 90, render: (v) => <StatusBadge status={String(v)} label={INQUIRY_STATUS_LABELS[String(v)] ?? String(v)} /> },
    { title: '跟进人', dataIndex: 'owner', width: 80 },
    actionCol,
  ];
  const quotationCols: TableProps<AnyRow>['columns'] = [
    { title: '报价单号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '版本', dataIndex: 'version', width: 70 },
    { title: '总价', dataIndex: 'totalAmount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '利润率', dataIndex: 'profitRate', width: 80, render: (v) => `${Number(v)}%` },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={QUOTATION_STATUS_LABELS[String(v)] ?? String(v)} /> },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
    actionCol,
  ];
  const orderCols: TableProps<AnyRow>['columns'] = [
    { title: '订单号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '总金额', dataIndex: 'totalAmount', width: 120, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '贸易术语', dataIndex: 'incoterm', width: 90 },
    { title: '交期', dataIndex: 'deliveryDate', width: 110 },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={ORDER_STATUS_LABELS[String(v)] ?? String(v)} /> },
    { title: '关联采购', dataIndex: 'hasPurchase', width: 100, render: (v) => v ? '是' : '否' },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
    actionCol,
  ];
  const sampleCols: TableProps<AnyRow>['columns'] = [
    { title: '样品单号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '样品费', dataIndex: 'sampleFee', width: 100, render: (v, r) => `${Number(v)} ${r.currency}` },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
    actionCol,
  ];
  const piCols: TableProps<AnyRow>['columns'] = [
    { title: 'PI 号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '总金额', dataIndex: 'totalAmount', width: 120, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '状态', dataIndex: 'status', width: 90, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
    actionCol,
  ];

  const colsMap = [inquiryCols, quotationCols, sampleCols, piCols, orderCols];
  const rowsMap = [inquiries, quotations, samples, piDocs, orders];
  const tabLabels = TAB_CONFIGS.map((c) => c.label);

  return (
    <div>
      <PageHeader
        title="销售管理"
        subtitle="询盘 → 报价 → 样品 → PI → 订单 全流程管理"
        actions={
          <Space>
            <Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} size="small" onClick={openCreate}>新增</Button>
          </Space>
        }
      />
      <WorkflowGuide steps={workflowSteps} current={tabLabels[tab]} />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs
          activeKey={String(tab)}
          onChange={(k) => setTab(Number(k))}
          items={tabLabels.map((label, i) => ({ key: String(i), label }))}
          style={{ minHeight: 36 }}
        />
        <Input
          prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
          placeholder="搜索..."
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          style={{ width: 200, marginBottom: 12 }}
          variant="borderless"
        />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
      <FormDialog open={dialogOpen} title={editing ? `编辑${config.label}` : `新增${config.label}`} onClose={() => setDialogOpen(false)} onSave={handleSave} width={640}>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="customerId" label="客户" rules={[{ required: true, message: '请选择客户' }]}><Select size="small" allowClear showSearch optionFilterProp="label" options={lookups.customerOptions} /></Form.Item></Col>
            <Col span={12}><Form.Item name="productId" label="商品"><Select size="small" allowClear showSearch optionFilterProp="label" options={lookups.productOptions} /></Form.Item></Col>
            {tab === 0 && <Col span={12}><Form.Item name="quantity" label="数量"><InputNumber size="small" style={{ width: '100%' }} min={0} /></Form.Item></Col>}
            {tab === 0 && <Col span={12}><Form.Item name="targetPrice" label="目标价"><InputNumber size="small" style={{ width: '100%' }} min={0} /></Form.Item></Col>}
            {(tab === 1 || tab === 3 || tab === 4) && <Col span={12}><Form.Item name="totalAmount" label="总金额"><InputNumber size="small" style={{ width: '100%' }} min={0} /></Form.Item></Col>}
            {tab === 1 && <Col span={12}><Form.Item name="profitRate" label="利润率 %"><InputNumber size="small" style={{ width: '100%' }} min={0} max={100} /></Form.Item></Col>}
            {tab === 1 && <Col span={12}><Form.Item name="version" label="版本"><InputNumber size="small" style={{ width: '100%' }} min={1} /></Form.Item></Col>}
            {tab === 2 && <Col span={12}><Form.Item name="sampleFee" label="样品费"><InputNumber size="small" style={{ width: '100%' }} min={0} /></Form.Item></Col>}
            <Col span={12}><Form.Item name="currency" label="币种"><Select size="small" options={CURRENCY_OPTIONS} /></Form.Item></Col>
            {(tab === 0 || tab === 4) && <Col span={12}><Form.Item name="incoterm" label="贸易术语"><Select size="small" allowClear options={INCOTERM_OPTIONS} /></Form.Item></Col>}
            <Col span={12}><Form.Item name="status" label="状态"><Select size="small" options={config.statusOptions} /></Form.Item></Col>
            <Col span={12}><Form.Item name="owner" label="跟进人"><Select size="small" allowClear options={[{ label: '李经理', value: '李经理' }, { label: '王跟单', value: '王跟单' }, { label: '陈销售', value: '陈销售' }]} /></Form.Item></Col>
          </Row>
        </Form>
      </FormDialog>
    </div>
  );
}
