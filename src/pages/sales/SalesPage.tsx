import { useState } from 'react';
import { Card, Tabs, Input, Button, Form, InputNumber, Select, Row, Col, Space, Popconfirm, Segmented, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import {
  useInquiries, useQuotations, useSalesOrders, useSampleOrders, usePiDocs,
  useCreateInquiry, useUpdateInquiry, useDeleteInquiry,
  useCreateQuotation, useUpdateQuotation, useDeleteQuotation,
  useCreateSample, useUpdateSample, useDeleteSample,
  useCreatePi, useUpdatePi, useDeletePi,
  useCreateSalesOrder, useUpdateSalesOrder, useDeleteSalesOrder,
  useBatchDelete,
  useLookups,
} from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import AdvancedFilter, { type FilterField, type FilterValue } from '../../components/common/AdvancedFilter';
import PageHeader from '../../components/common/PageHeader';
import KanbanBoard from '../../components/common/KanbanBoard';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import DocumentDetailDrawer, { type DetailField } from '../../components/common/DocumentDetailDrawer';
import ApprovalDrawer from '../../components/common/ApprovalDrawer';
import type { LineItemRow } from '../../components/common/LineItemsEditor';
import { printDocument, type PrintDocType } from '../../utils/printDocument';
import WorkflowGuide from '../../components/common/WorkflowGuide';
import { INQUIRY_STATUS_LABELS, QUOTATION_STATUS_LABELS, ORDER_STATUS_LABELS } from '../../data/constants/labels';
import { exportTableCsv } from '../../utils/exportCsv';
import type { TableProps } from 'antd';
import type { Key } from 'react';

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

/** 看板列颜色（询盘状态） */
const INQUIRY_STATUS_COLORS: Record<string, string> = {
  pending: 'orange',
  quoted: 'geekblue',
  in_progress: 'blue',
  converted: 'green',
  closed: 'default',
};

/** 批量删除对应的资源名（与 TAB_CONFIGS 对齐） */
const BATCH_RESOURCES = ['inquiries', 'quotations', 'sampleOrders', 'piDocs', 'salesOrders'];

export default function SalesPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<{ tab: number; row: AnyRow } | null>(null);
  const [approvalRow, setApprovalRow] = useState<AnyRow | null>(null);
  const [selKeys, setSelKeys] = useState<Key[]>([]);
  const [adv, setAdv] = useState<FilterValue>({});
  const [draftItems, setDraftItems] = useState<LineItemRow[] | null>(null);
  const [inquiryView, setInquiryView] = useState<'table' | 'kanban'>('table');

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
  const batchDelete = useBatchDelete<{ id: string }>(BATCH_RESOURCES[tab]);

  const inquiries = (inquiriesData as unknown as { list: AnyRow[] })?.list ?? [];
  const quotations = (quotationsData as unknown as { list: AnyRow[] })?.list ?? [];
  const orders = (ordersData as unknown as { list: AnyRow[] })?.list ?? [];
  const samples = (samplesData as unknown as { list: AnyRow[] })?.list ?? [];
  const piDocs = (piData as unknown as { list: AnyRow[] })?.list ?? [];

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

  const openDetail = (row: AnyRow) => {
    setDetail({ tab, row });
    setDraftItems(Array.isArray(row.items) ? (row.items as LineItemRow[]) : null);
  };

  const closeDetail = () => {
    setDetail(null);
    setDraftItems(null);
  };

  const handleSaveItems = () => {
    if (!detail || !draftItems) return;
    const priced = detail.tab === 1 || detail.tab === 3 || detail.tab === 4;
    const payload: AnyRow = { items: draftItems };
    if (priced) {
      payload.totalAmount = draftItems.reduce(
        (s, it) => s + Number(it.quantity ?? 0) * Number(it.unitPrice ?? 0),
        0,
      );
    }
    const p = { id: String(detail.row.id), data: payload as never };
    if (detail.tab === 1) updateQuotation.mutate(p);
    else if (detail.tab === 2) updateSample.mutate(p);
    else if (detail.tab === 3) updatePi.mutate(p);
    else if (detail.tab === 4) updateOrder.mutate(p);
    closeDetail();
  };

  const money = (v: unknown, cur: unknown) => `${Number(v ?? 0).toLocaleString()} ${String(cur ?? '')}`;

  const handlePrint = (kind: PrintDocType) => {
    if (!detail) return;
    const row = detail.row;
    const items = (draftItems ?? (Array.isArray(row.items) ? row.items : [])) as never[];
    const terms: [string, string][] = [];
    if (kind === 'quotation') {
      terms.push(
        ['贸易术语', String(row.incoterm ?? 'FOB')],
        ['付款方式', '30% T/T deposit, 70% against B/L copy'],
        ['有效期', String(row.validTo ?? '—')],
        ['交货期', '30 days after receipt of deposit'],
      );
    } else if (kind === 'pi') {
      terms.push(
        ['贸易术语', String(row.incoterm ?? 'FOB')],
        ['付款方式', '30% T/T deposit, 70% before shipment'],
        ['交货期', '30 days after receipt of deposit'],
      );
      if (row.contractNo) terms.push(['合同号', String(row.contractNo)]);
    } else {
      terms.push(['原产地', 'China']);
    }
    printDocument({
      docType: kind,
      docNo: String(row.code ?? row.id),
      date: String(row.issueDate ?? row.createdAt ?? '').slice(0, 10),
      customerName: lookups.customerName(row.customerId),
      items,
      currency: String(row.currency ?? 'USD'),
      terms,
      note: kind === 'packingList'
        ? 'Country of Origin: China. Weights are estimated for reference only.'
        : undefined,
    });
  };

  const buildDetailFields = (tabIdx: number, row: AnyRow): DetailField[] => {
    switch (tabIdx) {
      case 0:
        return [
          { label: '编号', value: String(row.code ?? row.id) },
          { label: '客户', value: lookups.customerName(row.customerId) },
          { label: '商品', value: lookups.productName(row.productId) },
          { label: '数量', value: String(row.quantity ?? '—') },
          { label: '目标价', value: `${Number(row.targetPrice ?? 0)} ${String(row.currency ?? '')}` },
          { label: '贸易术语', value: String(row.incoterm ?? '—') },
          { label: '来源', value: String(row.source ?? '—') },
          { label: 'AI 解析', value: row.aiParsed ? '是' : '否' },
          { label: '状态', value: <StatusBadge status={String(row.status)} label={INQUIRY_STATUS_LABELS[String(row.status)] ?? String(row.status)} /> },
          { label: '跟进人', value: String(row.owner ?? '—') },
          { label: '期望交期', value: String(row.expectedDeliveryDate ?? '—') },
          { label: '备注', value: String(row.remark ?? '—') },
        ];
      case 1:
        return [
          { label: '报价单号', value: String(row.code ?? row.id) },
          { label: '客户', value: lookups.customerName(row.customerId) },
          { label: '版本', value: `V${String(row.version ?? 1)}` },
          { label: '总金额', value: money(row.totalAmount, row.currency) },
          { label: '利润率', value: `${Number(row.profitRate ?? 0)}%` },
          { label: '贸易术语', value: String(row.incoterm ?? '—') },
          { label: '有效期', value: `${String(row.validFrom ?? '—')} ~ ${String(row.validTo ?? '—')}` },
          { label: '状态', value: <StatusBadge status={String(row.status)} label={QUOTATION_STATUS_LABELS[String(row.status)] ?? String(row.status)} /> },
          { label: '审批人', value: String(row.approver ?? '—') },
          { label: '跟进人', value: String(row.owner ?? '—') },
          { label: '审批意见', value: String(row.approvalRemark ?? '—') },
          { label: '备注', value: String(row.remark ?? '—') },
        ];
      case 2:
        return [
          { label: '样品单号', value: String(row.code ?? row.id) },
          { label: '客户', value: lookups.customerName(row.customerId) },
          { label: '样品费', value: money(row.sampleFee, row.currency) },
          { label: '费用冲抵大货', value: row.feeOffset ? '是' : '否' },
          { label: '状态', value: <StatusBadge status={String(row.status)} label={String(row.status)} /> },
          { label: '跟进人', value: String(row.owner ?? '—') },
          { label: '寄送单号', value: String(row.trackingNo ?? '—') },
          { label: '寄送日期', value: row.shippedAt ? String(row.shippedAt).slice(0, 10) : '—' },
          { label: '确认日期', value: row.confirmedAt ? String(row.confirmedAt).slice(0, 10) : '—' },
          { label: '备注', value: String(row.remark ?? '—') },
        ];
      case 3:
        return [
          { label: 'PI 号', value: String(row.code ?? row.id) },
          { label: '客户', value: lookups.customerName(row.customerId) },
          { label: '总金额', value: money(row.totalAmount, row.currency) },
          { label: '贸易术语', value: String(row.incoterm ?? '—') },
          { label: '签发日期', value: String(row.issueDate ?? '—') },
          { label: '状态', value: <StatusBadge status={String(row.status)} label={String(row.status)} /> },
          { label: '合同号', value: String(row.contractNo ?? '—') },
          { label: '跟进人', value: String(row.owner ?? '—') },
          { label: '备注', value: String(row.remark ?? '—') },
        ];
      default:
        return [
          { label: '订单号', value: String(row.code ?? row.id) },
          { label: '客户', value: lookups.customerName(row.customerId) },
          { label: '总金额', value: money(row.totalAmount, row.currency) },
          { label: '贸易术语', value: String(row.incoterm ?? '—') },
          { label: '付款方式', value: String(row.paymentTerms ?? '—') },
          { label: '交期', value: String(row.deliveryDate ?? '—') },
          { label: '状态', value: <StatusBadge status={String(row.status)} label={ORDER_STATUS_LABELS[String(row.status)] ?? String(row.status)} /> },
          { label: '来源', value: String(row.source ?? '—') },
          { label: '关联采购', value: row.hasPurchase ? '是' : '否' },
          { label: '跟进人', value: String(row.owner ?? '—') },
          { label: '备注', value: String(row.remark ?? '—') },
        ];
    }
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

  /** 审批动作回写报价单状态 */
  const handleApprovalBiz = (
    phase: 'apply' | 'approve' | 'reject',
    comment: string,
    operator: string,
  ) => {
    if (!approvalRow) return;
    const patch: AnyRow =
      phase === 'apply'
        ? { status: 'pending_approval' }
        : {
            status: phase === 'approve' ? 'approved' : 'rejected',
            approver: operator,
            approvedAt: new Date().toISOString(),
            approvalRemark: comment,
          };
    updateQuotation.mutate({ id: String(approvalRow.id), data: patch as never });
  };

  const handleExport = () => {
    exportTableCsv(`销售管理-${config.label}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  const actionCol: NonNullable<TableProps<AnyRow>['columns']>[number] = {
    title: '操作',
    key: '__actions',
    width: tab === 1 ? 215 : 160,
    render: (_, row) => (
      <Space size={0}>
        {tab === 1 && (
          <Button type="link" size="small" style={{ padding: '0 4px', fontSize: 12 }} onClick={() => setApprovalRow(row)}>审批</Button>
        )}
        <Button type="link" size="small" style={{ padding: '0 4px', fontSize: 12 }} onClick={() => openDetail(row)}>详情</Button>
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

  /** 高级筛选：状态等值 / 跟进人等值 / 金额区间（总价或目标价） */
  const applyAdv = (rows: AnyRow[]) =>
    rows.filter((r) => {
      if (adv.status && String(r.status) !== adv.status) return false;
      if (adv.owner && String(r.owner) !== adv.owner) return false;
      const range = adv.amount as [number | undefined, number | undefined] | undefined;
      if (range && (range[0] != null || range[1] != null)) {
        const amt = Number(r.totalAmount ?? r.targetPrice ?? 0);
        if (range[0] != null && amt < range[0]) return false;
        if (range[1] != null && amt > range[1]) return false;
      }
      return true;
    });

  const rowsMap = [inquiries, quotations, samples, piDocs, orders].map(applyAdv);

  const ownerOptions = [...new Set(([inquiries, quotations, samples, piDocs, orders][tab] ?? [])
    .map((r) => String(r.owner ?? ''))
    .filter((o) => o && o !== '—'))]
    .map((v) => ({ label: v, value: v }));

  const filterFields: FilterField[] = [
    { name: 'status', label: '状态', type: 'select', options: config.statusOptions },
    { name: 'owner', label: '跟进人', type: 'select', options: ownerOptions },
    { name: 'amount', label: '金额区间', type: 'numberRange' },
  ];
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
          onChange={(k) => { setTab(Number(k)); setSelKeys([]); setAdv({}); }}
          items={tabLabels.map((label, i) => ({ key: String(i), label }))}
          style={{ minHeight: 36 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Input
            prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
            placeholder="搜索..."
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            style={{ width: 200 }}
            variant="borderless"
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {selKeys.length > 0 && (
              <Popconfirm
                title={`确认删除选中的 ${selKeys.length} 条记录？`}
                onConfirm={() => { batchDelete.mutate(selKeys.map(String)); setSelKeys([]); }}
              >
                <Button size="small" danger loading={batchDelete.isPending} style={{ fontSize: 12 }}>
                  批量删除 ({selKeys.length})
                </Button>
              </Popconfirm>
            )}
            <AdvancedFilter fields={filterFields} value={adv} onChange={setAdv} />
            {tab === 0 && (
              <Segmented
                size="small"
                value={inquiryView}
                onChange={(v) => setInquiryView(v as 'table' | 'kanban')}
                options={[{ label: '表格', value: 'table' }, { label: '看板', value: 'kanban' }]}
              />
            )}
          </div>
        </div>
        {tab === 0 && inquiryView === 'kanban' ? (
          <KanbanBoard
            columns={Object.entries(INQUIRY_STATUS_LABELS).map(([key, title]) => ({ key, title, color: INQUIRY_STATUS_COLORS[key] }))}
            items={inquiries.map((i) => ({
              id: String(i.id),
              column: String(i.status),
              title: String(i.code ?? i.id),
              subtitle: `${lookups.customerName(i.customerId)} · ${lookups.productName(i.productId)}`,
              extra: (
                <span style={{ color: token.colorTextSecondary }}>
                  ×{Number(i.quantity ?? 0).toLocaleString()}
                  {i.targetPrice != null && <span style={{ float: 'right' }}>{Number(i.targetPrice).toLocaleString()} {String(i.currency ?? '')}</span>}
                </span>
              ),
            }))}
            onMove={(id, _from, to) => updateInquiry.mutate({ id, data: { status: to } as never })}
            onCardClick={(id) => {
              const row = inquiries.find((x) => String(x.id) === id);
              if (row) openDetail(row);
            }}
          />
        ) : (
          <DataTable
            columns={colsMap[tab]}
            rows={rowsMap[tab]}
            settingKey={`sales-${tab}`}
            rowSelection={{ selectedRowKeys: selKeys, onChange: (keys) => setSelKeys(keys) }}
          />
        )}
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
      {detail && (
        <DocumentDetailDrawer
          open
          title={`${TAB_CONFIGS[detail.tab].label}详情`}
          fields={buildDetailFields(detail.tab, detail.row)}
          items={detail.tab === 0 ? null : draftItems}
          onItemsChange={detail.tab === 0 ? undefined : setDraftItems}
          products={lookups.productsRaw}
          showCost={detail.tab === 1}
          currency={String(detail.row.currency ?? '')}
          onClose={closeDetail}
          footer={
            <Space>
              {detail.tab === 1 && (
                <Button size="small" icon={<PrinterOutlined />} onClick={() => handlePrint('quotation')}>打印报价单</Button>
              )}
              {detail.tab === 3 && (
                <>
                  <Button size="small" icon={<PrinterOutlined />} onClick={() => handlePrint('pi')}>打印 PI</Button>
                  <Button size="small" icon={<PrinterOutlined />} onClick={() => handlePrint('packingList')}>打印装箱单</Button>
                </>
              )}
              {detail.tab === 4 && (
                <Button size="small" icon={<PrinterOutlined />} onClick={() => handlePrint('packingList')}>打印装箱单</Button>
              )}
              <Button size="small" onClick={closeDetail}>关闭</Button>
              {detail.tab !== 0 && (
                <Button type="primary" size="small" onClick={handleSaveItems}>保存明细</Button>
              )}
            </Space>
          }
          extra={
            detail.tab === 0 ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, margin: '16px 0 8px' }}>询盘邮件原文</div>
                <pre
                  style={{
                    fontSize: 12,
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    background: token.colorFillQuaternary,
                    padding: 12,
                    borderRadius: 4,
                    margin: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  {String((detail.row.emailRaw as string) ?? '—')}
                </pre>
              </div>
            ) : undefined
          }
        />
      )}
      {approvalRow && (
        <ApprovalDrawer
          open
          bizType="quotation"
          bizId={String(approvalRow.id)}
          bizCode={String(approvalRow.code ?? approvalRow.id)}
          docLabel="报价单"
          amount={Number(approvalRow.totalAmount ?? 0)}
          currency={String(approvalRow.currency ?? 'USD')}
          applicant={String(approvalRow.owner ?? '—')}
          onBizAction={handleApprovalBiz}
          onClose={() => setApprovalRow(null)}
        />
      )}
    </div>
  );
}
