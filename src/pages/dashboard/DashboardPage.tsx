import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Progress, List, Typography, Tag, Space, Button, theme as antdTheme } from 'antd';
import {
  ShoppingCartOutlined,
  AccountBookOutlined,
  FieldTimeOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  DollarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useSalesOrders, useReceivables, useInquiries, useStockAlerts, useQuotations, usePiDocs, useCustomers } from '../../api/hooks';
import { useT } from '../../i18n';

const { Text } = Typography;

const STATUS_COLORS: Record<string, string> = {
  draft: '#8c8c8c',
  confirmed: '#1668dc',
  in_production: '#faad14',
  ready_to_ship: '#52c41a',
  shipped: '#1668dc',
  completed: '#52c41a',
  cancelled: '#ff4d4f',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { token } = antdTheme.useToken();
  const t = useT();
  const { data: ordersData } = useSalesOrders();
  const { data: arData } = useReceivables();
  const { data: inquiryData } = useInquiries();
  const { data: alertData } = useStockAlerts();

  const orders = useMemo(() => (ordersData as unknown as { list: Record<string, unknown>[] })?.list ?? [], [ordersData]);
  const arList = useMemo(() => (arData as unknown as { list: Record<string, unknown>[] })?.list ?? [], [arData]);
  const inquiries = useMemo(() => (inquiryData as unknown as { list: Record<string, unknown>[] })?.list ?? [], [inquiryData]);
  const alerts = useMemo(() => (alertData as unknown as { status?: string }[]) ?? [], [alertData]);

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOutstanding = arList
    .filter((a) => ['open', 'partial', 'overdue'].includes(String(a.status)))
    .reduce((sum, a) => sum + (Number(a.amountCny) || 0), 0);
  const overdueCount = arList.filter((a) => a.status === 'overdue').length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'pending' || i.status === 'in_progress').length;
  const alertCount = alerts.filter((a) => a.status === 'open').length;

  const statusDist = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => { const s = String(o.status); map[s] = (map[s] || 0) + 1; });
    return map;
  }, [orders]);

  const pieData = useMemo(
    () => Object.entries(statusDist).map(([name, value]) => ({ name, value })),
    [statusDist],
  );

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    orders.forEach((o) => {
      const d = new Date(String(o.createdAt));
      if (d) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[key] = (months[key] || 0) + (Number(o.totalAmount) || 0);
      }
    });
    return Object.entries(months).map(([month, amount]) => ({ month, amount: Math.round(amount) }));
  }, [orders]);

  // ===== 经营分析：漏斗 / 客户 TOP / 国家分布 =====
  const { data: quotationData } = useQuotations();
  const { data: piData } = usePiDocs();
  const { data: customerData } = useCustomers();
  const quotations = useMemo(() => (quotationData as unknown as { list: Record<string, unknown>[] })?.list ?? [], [quotationData]);
  const piDocs = useMemo(() => (piData as unknown as { list: Record<string, unknown>[] })?.list ?? [], [piData]);
  const customerList = useMemo(() => (customerData as { list: { id: string; name: string; country: string }[] })?.list ?? [], [customerData]);

  const funnelData = useMemo(
    () => [
      { name: '询盘', value: inquiries.length },
      { name: '报价', value: quotations.length },
      { name: 'PI', value: piDocs.length },
      { name: '订单', value: orders.length },
    ],
    [inquiries, quotations, piDocs, orders],
  );

  const topCustomers = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    orders.forEach((o) => {
      const cid = String(o.customerId ?? '—');
      const cur = map.get(cid) ?? { total: 0, count: 0 };
      map.set(cid, { total: cur.total + (Number(o.totalAmount) || 0), count: cur.count + 1 });
    });
    return [...map.entries()]
      .map(([cid, v]) => {
        const c = customerList.find((x) => x.id === cid);
        return { name: c?.name ?? cid, country: c?.country ?? '—', total: Math.round(v.total), count: v.count };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [orders, customerList]);

  const countryDist = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const c = customerList.find((x) => x.id === String(o.customerId ?? ''));
      const country = c?.country ?? '未知';
      map.set(country, (map.get(country) ?? 0) + (Number(o.totalAmount) || 0));
    });
    return [...map.entries()].map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [orders, customerList]);

  const workflowSteps = [
    { label: '询盘', count: pendingInquiries, path: '/sales' },
    { label: '报价', path: '/sales' },
    { label: '订单', count: orders.length, path: '/sales' },
    { label: '采购', path: '/purchase' },
    { label: '跟单', path: '/tracking' },
    { label: '出货', path: '/logistics' },
    { label: '收款', count: overdueCount, path: '/finance' },
  ];

  return (
    <div>
      {/* 欢迎横幅 */}
      <div style={{
        marginBottom: 16,
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #1668dc 0%, #3b7bff 100%)',
        color: '#fff',
        borderRadius: 6,
      }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t('外贸 ERP 工作台')}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          {t('B2B 贸易全流程管理 · 询价 → 报价 → 订单 → 采购 → 跟单 → 出货 → 收款 → 退税')}
        </div>
      </div>

      {/* 业务全流程导航：一行 7 个等宽卡片 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {workflowSteps.map((step) => (
          <Card
            key={step.label}
            size="small"
            hoverable
            style={{ flex: 1, textAlign: 'center', borderRadius: 4, position: 'relative', minWidth: 0 }}
            onClick={() => step.path && navigate(step.path)}
            styles={{ body: { padding: '12px 8px' } }}
          >
            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{step.label}</div>
            {typeof step.count === 'number' && (
              <Tag color={step.count > 0 ? token.colorPrimary : 'default'} style={{ margin: 0, position: 'absolute', top: 4, right: 4, fontSize: 10 }}>
                {step.count}
              </Tag>
            )}
          </Card>
        ))}
      </div>

      {/* 统计卡片 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col xs={12} md={6}>
          <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '12px 16px' } }}>
            <Statistic title={t('订单总额 (USD)')} value={totalRevenue.toLocaleString()} prefix={<DollarOutlined style={{ color: token.colorPrimary }} />} valueStyle={{ fontSize: 20, color: token.colorPrimary }} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '12px 16px' } }}>
            <Statistic title={t('应收余额 (CNY)')} value={totalOutstanding.toLocaleString()} valueStyle={{ fontSize: 20, color: '#ff4d4f' }} suffix={<span style={{ fontSize: 11, color: '#ff4d4f' }}>{overdueCount} {t('笔逾期')}</span>} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '12px 16px' } }}>
            <Statistic title={t('待处理询价')} value={pendingInquiries} prefix={<FieldTimeOutlined style={{ color: token.colorWarning }} />} valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '12px 16px' } }}>
            <Statistic title={t('库存预警')} value={alertCount} prefix={<AlertOutlined style={{ color: token.colorError }} />} valueStyle={{ fontSize: 20, color: token.colorWarning }} />
          </Card>
        </Col>
      </Row>

      {/* 图表区 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col xs={24} md={14}>
          <Card size="small" title={t('月度销售趋势')} style={{ borderRadius: 4, height: 280 }} styles={{ body: { padding: '8px 12px 0' } }}>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                grid: { left: 40, right: 16, top: 16, bottom: 28 },
                xAxis: { type: 'category', data: monthlyData.map((m) => m.month), axisLabel: { fontSize: 11 } },
                yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
                series: [{ name: '销售额', type: 'bar', data: monthlyData.map((m) => m.amount), itemStyle: { color: token.colorPrimary, borderRadius: [4, 4, 0, 0] } }],
              }}
              style={{ height: 232 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card size="small" title={t('订单状态分布')} style={{ borderRadius: 4, height: 280 }} styles={{ body: { padding: '8px 12px 0' } }}>
            <ReactECharts
              option={{
                tooltip: { trigger: 'item' },
                legend: { bottom: 0, textStyle: { fontSize: 11 } },
                series: [{
                  type: 'pie',
                  radius: ['35%', '70%'],
                  center: ['50%', '45%'],
                  data: pieData,
                  label: { fontSize: 11 },
                }],
                color: pieData.map((e) => STATUS_COLORS[e.name] ?? '#8c8c8c'),
              }}
              style={{ height: 232 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 经营分析：转化漏斗 / 客户 TOP / 国家分布 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card size="small" title={t('订单转化漏斗')} style={{ borderRadius: 4, height: 280 }} styles={{ body: { padding: '8px 12px 0' } }}>
            <ReactECharts
              option={{
                tooltip: { trigger: 'item', formatter: '{b}: {c} 单' },
                series: [{
                  type: 'funnel',
                  left: 10, right: 10, top: 12, bottom: 12,
                  minSize: '28%',
                  sort: 'descending',
                  gap: 3,
                  label: { show: true, position: 'inside', formatter: '{b}  {c}', fontSize: 11.5 },
                  itemStyle: { borderWidth: 0 },
                  data: funnelData,
                }],
              }}
              style={{ height: 232 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={9}>
          <Card size="small" title={t('客户 TOP 5（订单金额）')} style={{ borderRadius: 4, height: 280 }} styles={{ body: { padding: '8px 12px 0' } }}>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' },
                  formatter: (ps: { dataIndex: number }[]) => {
                    const c = topCustomers[ps[0]?.dataIndex];
                    return c ? `${c.name}（${c.country}）<br/>订单 ${c.count} 笔 · 金额 ${c.total.toLocaleString()}` : '';
                  },
                },
                grid: { left: 8, right: 56, top: 10, bottom: 4, containLabel: true },
                xAxis: { type: 'value', axisLabel: { fontSize: 11 } },
                yAxis: {
                  type: 'category',
                  data: [...topCustomers].reverse().map((c) => c.name),
                  axisLabel: { fontSize: 11, width: 96, overflow: 'truncate' },
                },
                series: [{
                  type: 'bar',
                  barWidth: 14,
                  data: [...topCustomers].reverse().map((c) => c.total),
                  itemStyle: { color: token.colorPrimary, borderRadius: [0, 4, 4, 0] },
                  label: { show: true, position: 'right', fontSize: 11, formatter: (p: { value: number }) => p.value.toLocaleString() },
                }],
              }}
              style={{ height: 232 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={7}>
          <Card size="small" title={t('国家 / 地区分布')} style={{ borderRadius: 4, height: 280 }} styles={{ body: { padding: '8px 12px 0' } }}>
            <ReactECharts
              option={{
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 11 } },
                series: [{
                  type: 'pie',
                  radius: ['40%', '66%'],
                  center: ['50%', '44%'],
                  data: countryDist,
                  label: { formatter: '{b}\n{d}%', fontSize: 11 },
                }],
              }}
              style={{ height: 232 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 待办与预警 */}
      <Row gutter={8}>
        <Col xs={24} md={12}>
          <Card size="small" title="待办任务" style={{ borderRadius: 4, height: '100%' }}>
            <List
              size="small"
              dataSource={[
                { icon: <FieldTimeOutlined style={{ color: token.colorPrimary }} />, text: `跟进 ${pendingInquiries} 条待处理询价`, sub: '销售管理', action: '去处理', path: '/sales' },
                { icon: <AlertOutlined style={{ color: token.colorWarning }} />, text: `${alertCount} 条库存预警待处理`, sub: '仓储管理', action: '查看', path: '/warehouse' },
                { icon: <WarningOutlined style={{ color: token.colorError }} />, text: `${overdueCount} 笔应收逾期`, sub: '财务管理', action: '催收', path: '/finance' },
                { icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />, text: `${orders.length} 笔订单进行中`, sub: '订单跟单', action: '跟踪', path: '/tracking' },
              ]}
              renderItem={(item) => (
                <List.Item actions={[<Button type="link" size="small" onClick={() => navigate(item.path)}>{item.action}</Button>]} style={{ padding: '8px 0' }}>
                  <List.Item.Meta avatar={item.icon} title={<Text style={{ fontSize: 13 }}>{item.text}</Text>} description={<Text type="secondary" style={{ fontSize: 12 }}>{item.sub}</Text>} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="最近订单" style={{ borderRadius: 4, height: '100%' }}>
            <List
              size="small"
              dataSource={orders.slice(-5).reverse()}
              renderItem={(o) => (
                <List.Item actions={[<Button type="link" size="small" onClick={() => navigate('/sales')}>{String(o.code)}</Button>]} style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    avatar={<ShoppingCartOutlined style={{ fontSize: 16, color: token.colorPrimary }} />}
                    title={<Text style={{ fontSize: 13 }}>{String(o.code)} - {String(o.currency)} {Number(o.totalAmount).toLocaleString()}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{String(o.createdAt ?? '').split('T')[0]}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
