import { Card, Row, Col, Typography, Alert, Tag, List, theme as antdTheme } from 'antd';
import {
  ShoppingCartOutlined,
  InboxOutlined,
  CarOutlined,
  WalletOutlined,
  AccountBookOutlined,
  MailOutlined,
  CloudOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const CONNECTORS = [
  { name: '电商平台', desc: 'Amazon / eBay / AliExpress / Shopify', icon: <ShoppingCartOutlined />, status: 'planned' },
  { name: '海外仓', desc: '第三方海外仓 WMS 对接', icon: <InboxOutlined />, status: 'planned' },
  { name: '物流', desc: '货代 API / 轨迹查询', icon: <CarOutlined />, status: 'planned' },
  { name: '支付', desc: 'PayPal / Stripe / 银行收汇', icon: <WalletOutlined />, status: 'planned' },
  { name: '财务', desc: '金蝶 / 用友 / SAP 财务凭证', icon: <AccountBookOutlined />, status: 'planned' },
  { name: '邮件', desc: '企业邮箱 / SMTP / IMAP', icon: <MailOutlined />, status: 'planned' },
  { name: '内部系统', desc: 'ERP / OA / CRM / MES', icon: <CloudOutlined />, status: 'planned' },
];

const INTERFACE_LIST = [
  { label: '电商平台', items: '拉取订单 / 同步库存 / 回传发货状态' },
  { label: '海外仓', items: '入库预报 / 出库指令 / 库存同步' },
  { label: '物流', items: '订舱指令 / 报关单回传 / 轨迹订阅' },
  { label: '支付', items: '收汇通知 / 付款指令 / 对账文件' },
  { label: '财务', items: '凭证生成 / 科目映射 / 期末结转' },
  { label: '邮件', items: '询盘邮件监听 / 自动回复 / 跟进提醒' },
];

export default function OpenPlatformPage() {
  const { token } = antdTheme.useToken();
  return (
    <div>
      <Typography.Title level={5} style={{ fontSize: 17, marginBottom: 4 }}>开放平台</Typography.Title>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        ERP 与第三方系统对接 · demo 阶段为接口清单占位 · 后端开发时实现真实对接
      </Text>

      <Alert type="info" message="当前为前端 demo，对接状态均为「规划中」。后端开发阶段将实现各连接器的真实 API 对接。" style={{ marginBottom: 16, borderRadius: 4 }} showIcon />

      <Row gutter={8} style={{ marginBottom: 16 }}>
        {CONNECTORS.map((c) => (
          <Col xs={24} sm={12} md={8} key={c.name}>
            <Card size="small" style={{ borderRadius: 4, height: '100%' }} styles={{ body: { padding: 12 } }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: token.colorPrimary, fontSize: 16 }}>{c.icon}</span>
                <Text strong style={{ fontSize: 13 }}>{c.name}</Text>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>{c.desc}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="default" style={{ margin: 0 }}>规划中</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card size="small" title="接口清单" style={{ borderRadius: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>后端开发阶段将实现以下接口：</Text>
        <List
          size="small"
          dataSource={INTERFACE_LIST}
          renderItem={(item) => (
            <List.Item>
              <Text style={{ fontSize: 13 }}><Text strong>{item.label}</Text> → {item.items}</Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
