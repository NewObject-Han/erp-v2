import { useState } from 'react';
import { Card, Tabs, Input, Button, Form, InputNumber, Select, Row, Col, Space, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useInquiries, useQuotations, useSalesOrders, useSampleOrders, usePiDocs, useCreateInquiry, useCreateQuotation, useCreateSalesOrder, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import WorkflowGuide from '../../components/common/WorkflowGuide';
import { INQUIRY_STATUS_LABELS, QUOTATION_STATUS_LABELS, ORDER_STATUS_LABELS } from '../../data/constants/labels';
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
  const createQuotation = useCreateQuotation();
  const createOrder = useCreateSalesOrder();
  const lookups = useLookups();

  const inquiries = (inquiriesData as { list: AnyRow[] })?.list ?? [];
  const quotations = (quotationsData as { list: AnyRow[] })?.list ?? [];
  const orders = (ordersData as { list: AnyRow[] })?.list ?? [];
  const samples = (samplesData as { list: AnyRow[] })?.list ?? [];
  const piDocs = (piData as { list: AnyRow[] })?.list ?? [];

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: 'pending', currency: 'USD', source: 'email' }); setDialogOpen(true); };
  const openEdit = (row: AnyRow) => { setEditing(row); form.setFieldsValue(row); setDialogOpen(true); };
  const handleSave = () => {
    const values = form.getFieldsValue();
    if (editing) { setDialogOpen(false); return; }
    if (tab === 0) createInquiry.mutate({ ...values, id: `inq_${Date.now()}`, code: `INQ-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString() } as never);
    else if (tab === 1) createQuotation.mutate({ ...values, id: `quot_${Date.now()}`, code: `QT-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString() } as never);
    else if (tab === 4) createOrder.mutate({ ...values, id: `so_${Date.now()}`, code: `SO-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString() } as never);
    setDialogOpen(false);
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
  ];
  const quotationCols: TableProps<AnyRow>['columns'] = [
    { title: '报价单号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '版本', dataIndex: 'version', width: 70 },
    { title: '总价', dataIndex: 'totalAmount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '利润率', dataIndex: 'profitRate', width: 80, render: (v) => `${Number(v)}%` },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={QUOTATION_STATUS_LABELS[String(v)] ?? String(v)} /> },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
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
  ];
  const sampleCols: TableProps<AnyRow>['columns'] = [
    { title: '样品单号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '样品费', dataIndex: 'sampleFee', width: 100, render: (v, r) => `${Number(v)} ${r.currency}` },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
  ];
  const piCols: TableProps<AnyRow>['columns'] = [
    { title: 'PI 号', dataIndex: 'code', width: 110 },
    { title: '客户', dataIndex: 'customerId', width: 140, render: (v) => lookups.customerName(v) },
    { title: '总金额', dataIndex: 'totalAmount', width: 120, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '状态', dataIndex: 'status', width: 90, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
    { title: '跟单人', dataIndex: 'owner', width: 80 },
  ];

  const colsMap = [inquiryCols, quotationCols, sampleCols, piCols, orderCols];
  const rowsMap = [inquiries, quotations, samples, piDocs, orders];
  const tabLabels = ['询盘', '报价', '样品', 'PI', '销售订单'];

  return (
    <div>
      <PageHeader
        title="销售管理"
        subtitle="询盘 → 报价 → 样品 → PI → 订单 全流程管理"
        actions={<Button type="primary" icon={<PlusOutlined />} size="small" onClick={openCreate}>新增</Button>}
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
      <FormDialog open={dialogOpen} title={editing ? '编辑' : '新增'} onClose={() => setDialogOpen(false)} onSave={handleSave} width={640}>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="customerId" label="客户"><Select size="small" allowClear options={[]} /></Form.Item></Col>
            <Col span={12}><Form.Item name="productId" label="商品"><Select size="small" allowClear options={[]} /></Form.Item></Col>
            <Col span={12}><Form.Item name="quantity" label="数量"><InputNumber size="small" style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={12}><Form.Item name="currency" label="币种"><Select size="small" options={[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'CNY', value: 'CNY' }]} /></Form.Item></Col>
            <Col span={12}><Form.Item name="incoterm" label="贸易术语"><Select size="small" allowClear options={[{ label: 'FOB', value: 'FOB' }, { label: 'CIF', value: 'CIF' }, { label: 'EXW', value: 'EXW' }, { label: 'DDP', value: 'DDP' }]} /></Form.Item></Col>
            <Col span={12}><Form.Item name="status" label="状态"><Select size="small" options={[{ label: '待处理', value: 'pending' }, { label: '已报价', value: 'quoted' }, { label: '已确认', value: 'confirmed' }]} /></Form.Item></Col>
          </Row>
        </Form>
      </FormDialog>
    </div>
  );
}
