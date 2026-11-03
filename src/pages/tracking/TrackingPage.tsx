import { useMemo } from 'react';
import { Card, Row, Col, Typography, Tag, Progress, Timeline, Alert, Table, theme as antdTheme } from 'antd';
import { useSalesOrders, useTrackingNodes, useTrackingExceptions, useLookups } from '../../api/hooks';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { ORDER_STATUS_LABELS } from '../../data/constants/labels';
import type { TableProps } from 'antd';

const { Text } = Typography;
type AnyRow = Record<string, unknown>;

export default function TrackingPage() {
  const { token } = antdTheme.useToken();
  const { data: soData } = useSalesOrders();
  const { data: nodeData } = useTrackingNodes();
  const { data: excData } = useTrackingExceptions();
  const lookups = useLookups();

  const orders = useMemo(() => (soData as { list: AnyRow[] })?.list ?? [], [soData]);
  const nodes = useMemo(() => (nodeData as AnyRow[]) ?? [], [nodeData]);
  const exceptions = useMemo(() => (excData as AnyRow[]) ?? [], [excData]);

  const inProgress = orders.filter((o) => ['confirmed', 'in_production', 'ready_to_ship'].includes(String(o.status)));
  const exceptionCount = exceptions.filter((e) => (e as AnyRow).status === 'open').length;

  const orderCols: TableProps<AnyRow>['columns'] = [
    { title: '订单号', dataIndex: 'code', width: 100 },
    { title: '客户', dataIndex: 'customerId', width: 120, render: (v) => lookups.customerName(v) },
    { title: '交期', dataIndex: 'deliveryDate', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <StatusBadge status={String(v)} label={ORDER_STATUS_LABELS[String(v)] ?? String(v)} /> },
    { title: '进度', dataIndex: 'progress', width: 100, render: (v) => <Progress percent={Number(v) || 0} size="small" /> },
  ];

  return (
    <div>
      <PageHeader title="订单跟单" subtitle="订单进度跟踪 · 交期管理 · 异常预警" />
      {exceptionCount > 0 && (
        <Alert type="error" message={`${exceptionCount} 条跟单异常待处理`} description="请关注逾期交期、质量异常、供应商延期等风险" style={{ marginBottom: 16, borderRadius: 4 }} showIcon />
      )}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}><Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: 12 } }}><Text type="secondary" style={{ fontSize: 12 }}>进行中订单</Text><div style={{ fontSize: 20, fontWeight: 600 }}>{inProgress.length}</div></Card></Col>
        <Col xs={24} md={8}><Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: 12 } }}><Text type="secondary" style={{ fontSize: 12 }}>跟单节点</Text><div style={{ fontSize: 20, fontWeight: 600 }}>{nodes.length}</div></Card></Col>
        <Col xs={24} md={8}><Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: 12 } }}><Text type="secondary" style={{ fontSize: 12 }}>异常预警</Text><div style={{ fontSize: 20, fontWeight: 600, color: exceptionCount > 0 ? token.colorError : '#52c41a' }}>{exceptionCount}</div></Card></Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} md={12}>
          <Card size="small" title="订单跟单列表" style={{ borderRadius: 4, height: '100%' }}>
            <Table size="small" columns={orderCols} dataSource={orders} rowKey="id" pagination={{ pageSize: 10, size: 'small' }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="跟单节点时间线" style={{ borderRadius: 4, height: '100%' }}>
            <Timeline items={nodes.map((n) => ({
              color: n.status === 'done' ? 'green' : n.status === 'delayed' ? 'red' : 'blue',
              children: (
                <div>
                  <Text style={{ fontSize: 13 }}>{String(n.nodeName ?? n.name ?? n.id)}</Text>
                  <div style={{ fontSize: 12, color: token.colorTextSecondary }}>{String(n.plannedDate ?? '')} → {String(n.actualDate ?? '待完成')}</div>
                  {n.status === 'delayed' && <Tag color="red" style={{ marginTop: 4 }}>延期</Tag>}
                </div>
              ),
            }))} />
          </Card>
        </Col>
      </Row>
      <Card size="small" title="跟单异常" style={{ borderRadius: 4, marginTop: 16 }}>
        {exceptions.length === 0 ? <Text type="secondary">暂无异常</Text> : exceptions.map((e) => {
          const exc = e as AnyRow;
          return <Alert key={String(exc.id)} type={exc.level === 'high' ? 'error' : exc.level === 'medium' ? 'warning' : 'info'} message={String(exc.title ?? exc.message ?? exc.id)} description={`订单 ${String(exc.salesOrderCode ?? '')} · ${String(exc.detail ?? '')} · 处理人: ${String(exc.owner ?? '—')}`} showIcon style={{ borderRadius: 4, marginBottom: 8 }} />;
        })}
      </Card>
    </div>
  );
}
