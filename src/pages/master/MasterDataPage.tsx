import { useState } from 'react';
import { Card, Tabs, Input, Button, Form, Row, Col, theme as antdTheme } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useCategories, useProducts, useIncoterms, useCurrencies, useExchangeRates, usePriceList, useLookups } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import FormDialog from '../../components/common/FormDialog';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function MasterDataPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [kw, setKw] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: catData } = useCategories();
  const { data: prodData } = useProducts({ keyword: kw });
  const { data: incoData } = useIncoterms();
  const { data: curData } = useCurrencies();
  const { data: fxData } = useExchangeRates();
  const { data: priceData } = usePriceList({ keyword: kw });
  const lookups = useLookups();

  const categories = (catData as unknown[]) ?? [];
  const products = (prodData as { list: AnyRow[] })?.list ?? [];
  const incoterms = (incoData as unknown[]) ?? [];
  const currencies = (curData as unknown[]) ?? [];
  const exchangeRates = (fxData as unknown[]) ?? [];
  const priceItems = (priceData as { list: AnyRow[] })?.list ?? [];

  const prodCols: TableProps<AnyRow>['columns'] = [
    { title: 'SKU', dataIndex: 'sku', width: 100 },
    { title: '品名', dataIndex: 'name', width: 130 },
    { title: '英文品名', dataIndex: 'nameEn', width: 150 },
    { title: 'HS 编码', dataIndex: 'hsCode', width: 120 },
    { title: '单位', dataIndex: 'unit', width: 60 },
    { title: '成本价', dataIndex: 'costPrice', width: 90, render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '售价', dataIndex: 'salePrice', width: 90, render: (v) => `$${Number(v).toLocaleString()}` },
    { title: '退税率', dataIndex: 'refundRate', width: 70, render: (v) => `${Number(v)}%` },
    { title: '启用', dataIndex: 'active', width: 60, render: (v) => v ? '是' : '否' },
  ];
  const catCols: TableProps<AnyRow>['columns'] = [
    { title: '编码', dataIndex: 'code', width: 120 },
    { title: '名称', dataIndex: 'name', width: 150 },
  ];
  const incoCols: TableProps<AnyRow>['columns'] = [
    { title: '代码', dataIndex: 'code', width: 100 },
    { title: '名称', dataIndex: 'name', width: 100 },
    { title: '中文名', dataIndex: 'nameZh', width: 120 },
    { title: '说明', dataIndex: 'description', width: 200 },
    { title: '启用', dataIndex: 'active', width: 60, render: (v) => v ? '是' : '否' },
  ];
  const curCols: TableProps<AnyRow>['columns'] = [
    { title: '代码', dataIndex: 'code', width: 80 },
    { title: '名称', dataIndex: 'name', width: 100 },
    { title: '符号', dataIndex: 'symbol', width: 60 },
    { title: '基础币种', dataIndex: 'isBase', width: 80, render: (v) => v ? '是' : '否' },
    { title: '小数位', dataIndex: 'decimals', width: 70 },
  ];
  const fxCols: TableProps<AnyRow>['columns'] = [
    { title: '原币种', dataIndex: 'fromCurrency', width: 100 },
    { title: '目标币种', dataIndex: 'toCurrency', width: 100 },
    { title: '汇率', dataIndex: 'rate', width: 100, render: (v) => Number(v).toFixed(4) },
    { title: '日期', dataIndex: 'date', width: 110 },
    { title: '来源', dataIndex: 'source', width: 100 },
  ];
  const priceCols: TableProps<AnyRow>['columns'] = [
    { title: '商品', dataIndex: 'productId', width: 160, render: (v) => lookups.productName(v) },
    { title: '客户', dataIndex: 'customerId', width: 160, render: (v) => lookups.customerName(v) },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单价', dataIndex: 'unitPrice', width: 100, render: (v, r) => `${Number(v)} ${r.currency}` },
    { title: '生效期', dataIndex: 'validFrom', width: 110 },
    { title: '失效期', dataIndex: 'validTo', width: 110 },
  ];

  const colsMap = [prodCols, catCols, incoCols, curCols, fxCols, priceCols];
  const rowsMap = [products, categories, incoterms, currencies, exchangeRates, priceItems];
  const tabLabels = ['商品', '分类', '贸易术语', '币种', '汇率', '价格矩阵'];

  return (
    <div>
      <PageHeader title="主数据" subtitle="商品 / 分类 / 贸易术语 / 币种汇率 / 价格矩阵" actions={<Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => { form.resetFields(); setDialogOpen(true); }}>新增</Button>} />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <Input prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />} placeholder="搜索..." value={kw} onChange={(e) => setKw(e.target.value)} style={{ width: 200, marginBottom: 12 }} variant="borderless" />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
      <FormDialog open={dialogOpen} title="新增主数据" onClose={() => setDialogOpen(false)} width={640}>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="code" label="编码"><Input size="small" /></Form.Item></Col>
            <Col span={12}><Form.Item name="name" label="名称"><Input size="small" /></Form.Item></Col>
          </Row>
        </Form>
      </FormDialog>
    </div>
  );
}
