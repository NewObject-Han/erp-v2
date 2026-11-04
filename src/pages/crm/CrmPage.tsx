import { useState } from 'react';
import { Card, Tabs, Input, Button, Form, Row, Col, Select, InputNumber, Space, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useCustomers, useSuppliers, useCustomerCredits, useCreateCustomer, useCreateSupplier, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import ImportWizard, { type TargetField } from '../../components/common/ImportWizard';
import { exportTableCsv } from '../../utils/exportCsv';
import { translateEnum } from '../../utils/labels';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

/** 客户导入目标字段 */
const CUSTOMER_FIELDS: TargetField[] = [
  { name: 'code', label: '编码' },
  { name: 'name', label: '名称', required: true },
  { name: 'country', label: '国别' },
  { name: 'contactPerson', label: '联系人' },
  { name: 'paymentTerms', label: '付款方式' },
  { name: 'creditLimit', label: '信用额度', validate: (v) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? null : '必须是非负数字') },
  { name: 'level', label: '等级' },
];

/** 供应商导入目标字段 */
const SUPPLIER_FIELDS: TargetField[] = [
  { name: 'code', label: '编码' },
  { name: 'name', label: '名称', required: true },
  { name: 'country', label: '国别' },
  { name: 'mainCategory', label: '主营品类' },
  { name: 'level', label: '等级' },
  { name: 'onTimeRate', label: '准交率', validate: (v) => (Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 100 ? null : '需为 0-100 的数字') },
];

export default function CrmPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: cusData } = useCustomers({ keyword: kw });
  const { data: supData } = useSuppliers({ keyword: kw });
  const { data: creditData } = useCustomerCredits();
  const createCustomer = useCreateCustomer();
  const createSupplier = useCreateSupplier();
  const lookups = useLookups();

  const customers = (cusData as unknown as { list: AnyRow[] })?.list ?? [];
  const suppliers = (supData as unknown as { list: AnyRow[] })?.list ?? [];
  const credits = (creditData as unknown as AnyRow[]) ?? [];

  const handleSave = () => {
    const values = form.getFieldsValue();
    if (tab === 0) createCustomer.mutate({ ...values, id: `cus_${Date.now()}`, createdAt: new Date().toISOString() } as never);
    else createSupplier.mutate({ ...values, id: `sup_${Date.now()}`, createdAt: new Date().toISOString() } as never);
    setDialogOpen(false);
    form.resetFields();
  };

  /** Excel 导入：逐行写入当前 tab 对应的资源 */
  const handleImportRows = async (rows: Record<string, unknown>[]) => {
    for (let i = 0; i < rows.length; i++) {
      const data = {
        ...rows[i],
        id: `${tab === 0 ? 'cus' : 'sup'}_${Date.now()}_${i}`,
        createdAt: new Date().toISOString(),
        status: rows[i].status ?? 'active',
      };
      if (tab === 0) await createCustomer.mutateAsync(data as never);
      else await createSupplier.mutateAsync(data as never);
    }
    return rows.length;
  };

  const cusCols: TableProps<AnyRow>['columns'] = [
    { title: '编码', dataIndex: 'code', width: 100 },
    { title: '客户名称', dataIndex: 'name', width: 150 },
    { title: '国别', dataIndex: 'country', width: 80 },
    { title: '联系人', dataIndex: 'contactPerson', width: 90 },
    { title: '付款方式', dataIndex: 'paymentTerms', width: 90 },
    { title: '信用额度', dataIndex: 'creditLimit', width: 110, render: (v) => `$${Number(v).toLocaleString()}` },
    { title: '等级', dataIndex: 'level', width: 70, render: (v) => translateEnum(v) },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const supCols: TableProps<AnyRow>['columns'] = [
    { title: '编码', dataIndex: 'code', width: 100 },
    { title: '供应商', dataIndex: 'name', width: 150 },
    { title: '国别', dataIndex: 'country', width: 80 },
    { title: '主营品类', dataIndex: 'mainCategory', width: 120 },
    { title: '等级', dataIndex: 'level', width: 100, render: (v) => translateEnum(v) },
    { title: '准交率', dataIndex: 'onTimeRate', width: 80, render: (v) => `${Number(v)}%` },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const creditCols: TableProps<AnyRow>['columns'] = [
    { title: '客户', dataIndex: 'customerId', width: 160, render: (v) => lookups.customerName(v) },
    { title: '信用额度', dataIndex: 'creditLimit', width: 110, render: (v) => `$${Number(v).toLocaleString()}` },
    { title: '已用', dataIndex: 'usedAmount', width: 110, render: (v) => `$${Number(v).toLocaleString()}` },
    { title: '可用', dataIndex: 'availableAmount', width: 110, render: (v) => `$${Number(v).toLocaleString()}` },
    { title: '账期', dataIndex: 'creditDays', width: 70 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];

  const colsMap = [cusCols, supCols, creditCols];
  const rowsMap = [customers, suppliers, credits];
  const tabLabels = ['客户', '供应商', '客户信用'];

  const handleExport = () => {
    exportTableCsv(`客户与供应商-${tabLabels[tab]}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  return (
    <div>
      <PageHeader title="客户与供应商" subtitle="客户档案 / 供应商档案 / 客户信用管理" actions={<Space>
        {tab < 2 && <Button icon={<UploadOutlined />} size="small" onClick={() => setImportOpen(true)}>导入</Button>}
        <Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => { form.resetFields(); form.setFieldsValue({ status: 'active', paymentTerms: 'T/T', creditLimit: 50000, creditDays: 30 }); setDialogOpen(true); }}>新增</Button>
      </Space>} />
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
            <Col span={12}><Form.Item name="contactPerson" label="联系人"><Input size="small" /></Form.Item></Col>
            <Col span={12}><Form.Item name="paymentTerms" label="付款方式"><Select size="small" options={[{ label: 'T/T', value: 'T/T' }, { label: 'L/C', value: 'L/C' }, { label: 'OA', value: 'OA' }]} /></Form.Item></Col>
            <Col span={12}><Form.Item name="creditLimit" label="信用额度"><InputNumber size="small" style={{ width: '100%' }} min={0} /></Form.Item></Col>
          </Row>
        </Form>
      </FormDialog>
      <ImportWizard
        open={importOpen}
        onClose={() => setImportOpen(false)}
        targetLabel={tabLabels[tab]}
        fields={tab === 0 ? CUSTOMER_FIELDS : SUPPLIER_FIELDS}
        onImport={handleImportRows}
      />
    </div>
  );
}
