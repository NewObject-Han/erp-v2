import { useState } from 'react';
import { Card, Tabs, Input, Button, Form, InputNumber, Select, Row, Col, Space, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useSuppliers, usePurchaseInquiries, usePurchaseOrders, useCreateSupplier, useCreatePurchaseOrder, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import { translateEnum } from '../../utils/labels';
import { exportTableCsv } from '../../utils/exportCsv';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function PurchasePage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: supData } = useSuppliers({ keyword: kw });
  const { data: pInqData } = usePurchaseInquiries({ keyword: kw });
  const { data: pOrderData } = usePurchaseOrders({ keyword: kw });
  const createSupplier = useCreateSupplier();
  const createPO = useCreatePurchaseOrder();
  const lookups = useLookups();

  const suppliers = (supData as { list: AnyRow[] })?.list ?? [];
  const pInquiries = (pInqData as { list: AnyRow[] })?.list ?? [];
  const pOrders = (pOrderData as { list: AnyRow[] })?.list ?? [];

  const handleSave = () => {
    const values = form.getFieldsValue();
    if (tab === 0) createSupplier.mutate({ ...values, id: `sup_${Date.now()}`, createdAt: new Date().toISOString() } as never);
    else if (tab === 2) createPO.mutate({ ...values, id: `po_${Date.now()}`, code: `PO-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString() } as never);
    setDialogOpen(false);
    form.resetFields();
  };

  const supplierCols: TableProps<AnyRow>['columns'] = [
    { title: '编码', dataIndex: 'code', width: 100 },
    { title: '供应商', dataIndex: 'name', width: 150 },
    { title: '国别', dataIndex: 'country', width: 80 },
    { title: '主营品类', dataIndex: 'mainCategory', width: 120 },
    { title: '等级', dataIndex: 'level', width: 100, render: (v) => translateEnum(v) },
    { title: '准交率', dataIndex: 'onTimeRate', width: 90, render: (v) => `${Number(v)}%` },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const pInqCols: TableProps<AnyRow>['columns'] = [
    { title: '询价单号', dataIndex: 'code', width: 110 },
    { title: '供应商', dataIndex: 'supplierId', width: 140, render: (v) => lookups.supplierName(v) },
    { title: '总金额', dataIndex: 'totalAmount', width: 110, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '要求交期', dataIndex: 'expectedDeliveryDate', width: 110 },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
    { title: '采购员', dataIndex: 'owner', width: 80 },
  ];
  const pOrderCols: TableProps<AnyRow>['columns'] = [
    { title: '采购单号', dataIndex: 'code', width: 110 },
    { title: '供应商', dataIndex: 'supplierId', width: 140, render: (v) => lookups.supplierName(v) },
    { title: '总金额', dataIndex: 'totalAmount', width: 120, render: (v, r) => `${Number(v).toLocaleString()} ${r.currency}` },
    { title: '交期', dataIndex: 'deliveryDate', width: 110 },
    { title: '税率', dataIndex: 'taxRate', width: 70, render: (v) => `${Number(v)}%` },
    { title: '状态', dataIndex: 'status', width: 100, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
    { title: '采购员', dataIndex: 'owner', width: 80 },
  ];

  const colsMap = [supplierCols, pInqCols, pOrderCols];
  const rowsMap = [suppliers, pInquiries, pOrders];
  const tabLabels = ['供应商', '采购询价', '采购订单'];

  const handleExport = () => {
    exportTableCsv(`采购管理-${tabLabels[tab]}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  return (
    <div>
      <PageHeader
        title="采购管理"
        subtitle="供应商管理 · 采购询价 · 采购订单"
        actions={
          <Space>
            <Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => { form.resetFields(); setDialogOpen(true); }}>新增</Button>
          </Space>
        }
      />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <Input prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />} placeholder="搜索..." value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 200, marginBottom: 12 }} variant="borderless" />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
      <FormDialog open={dialogOpen} title="新增" onClose={() => setDialogOpen(false)} onSave={handleSave} width={640}>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="code" label="编码"><Input size="small" /></Form.Item></Col>
            <Col span={12}><Form.Item name="name" label="名称"><Input size="small" /></Form.Item></Col>
            <Col span={12}><Form.Item name="country" label="国别"><Input size="small" /></Form.Item></Col>
            <Col span={12}><Form.Item name="status" label="状态"><Select size="small" options={[{ label: '草稿', value: 'draft' }, { label: '启用', value: 'active' }]} /></Form.Item></Col>
          </Row>
        </Form>
      </FormDialog>
    </div>
  );
}
