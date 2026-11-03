import { useState } from 'react';
import { Card, Row, Col, Typography, Input, Button, Alert, Tag, theme as antdTheme } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useEmailParse, useOcrExtract, useHsClassify } from '../../ai/hooks';

const { Text } = Typography;

const CAPABILITIES = [
  { name: '询价邮件解析', desc: '自动识别客户邮件中的商品、数量、目标价', icon: '✉️' },
  { name: '单证一致性审核', desc: 'L/C 项下单单相符 / 单证相符智能校验', icon: '🔍' },
  { name: '文档 OCR 抽取', desc: '从发票/箱单/提单中提取关键字段', icon: '📄' },
  { name: 'HS 编码归类', desc: '智能推荐商品 HS 编码及退税率', icon: '🏷️' },
  { name: '报价利润模拟', desc: '不同贸易术语下的成本利润测算', icon: '💰' },
  { name: '智能装箱计算', desc: '根据柜型自动计算最优装箱方案', icon: '📦' },
];

export default function AiCenterPage() {
  const { token } = antdTheme.useToken();
  const [emailText, setEmailText] = useState('');
  const [emailResult, setEmailResult] = useState<Record<string, unknown> | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrResult, setOcrResult] = useState<Record<string, unknown> | null>(null);
  const [hsText, setHsText] = useState('');
  const [hsResult, setHsResult] = useState<Record<string, unknown> | null>(null);

  const emailParse = useEmailParse();
  const ocrExtract = useOcrExtract();
  const hsClassify = useHsClassify();

  const handleEmailParse = () => {
    emailParse.mutate(emailText || 'Re: Inquiry - Looking for LED Light Bars, 500 units, target price $2.50/unit, FOB Shenzhen, delivery within 30 days.', {
      onSuccess: (data: Record<string, unknown>) => setEmailResult(data),
    });
  };

  const handleOcrExtract = () => {
    ocrExtract.mutate(ocrText || 'Commercial Invoice\nInvoice No: INV-2026-001\nSeller: Shenzhen Trading Co.\nBuyer: ABC Import LLC\nTotal: $5,000.00', {
      onSuccess: (data: Record<string, unknown>) => setOcrResult(data),
    });
  };

  const handleHsClassify = () => {
    hsClassify.mutate(hsText || 'LED Light Bar', {
      onSuccess: (data: Record<string, unknown>) => setHsResult(data),
    });
  };

  return (
    <div>
      <Typography.Title level={5} style={{ fontSize: 17, marginBottom: 4 }}>AI 智能中心</Typography.Title>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        外贸场景 AI 应用演示 · 纯模拟规则引擎 · 接口设计可替换为真实 LLM 后端
      </Text>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        {CAPABILITIES.map((cap) => (
          <Col xs={12} md={8} lg={4} key={cap.name}>
            <Card size="small" style={{ borderRadius: 4, height: '100%' }} styles={{ body: { padding: 12 } }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{cap.icon}</div>
              <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 2 }}>{cap.name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{cap.desc}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={8}>
        <Col xs={24} md={12}>
          <Card size="small" title="询价邮件解析" style={{ borderRadius: 4 }}>
            <Input.TextArea size="small" rows={4} placeholder="粘贴客户询价邮件..." value={emailText} onChange={(e) => setEmailText(e.target.value)} style={{ marginBottom: 8 }} />
            <Button type="primary" icon={<PlayCircleOutlined />} size="small" onClick={handleEmailParse} style={{ marginBottom: 12 }}>AI 解析</Button>
            {emailResult && (
              <div style={{ background: '#f5f5f5', borderRadius: 4, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>解析结果</Text>
                <Row gutter={8} style={{ marginTop: 8 }}>
                  <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>商品关键词:</Text><div style={{ fontWeight: 600 }}>{String(emailResult.productKeywords ?? 'LED Light Bars')}</div></Col>
                  <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>数量:</Text><div style={{ fontWeight: 600 }}>{String(emailResult.quantity ?? 500)}</div></Col>
                  <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>目标价:</Text><div style={{ fontWeight: 600 }}>{String(emailResult.targetPrice ?? 2.5)} {String(emailResult.currency ?? 'USD')}</div></Col>
                  <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>贸易术语:</Text><div style={{ fontWeight: 600 }}>{String(emailResult.incoterm ?? 'FOB')}</div></Col>
                  <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>交期:</Text><div style={{ fontWeight: 600 }}>{String(emailResult.expectedDeliveryDate ?? '30天')}</div></Col>
                  <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>置信度:</Text><div style={{ fontWeight: 600, color: '#52c41a' }}>{String(emailResult.confidence ?? 92)}%</div></Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card size="small" title="文档 OCR 抽取" style={{ borderRadius: 4 }}>
            <Input.TextArea size="small" rows={4} placeholder="粘贴单证内容（模拟 Excel/PDF/图片）..." value={ocrText} onChange={(e) => setOcrText(e.target.value)} style={{ marginBottom: 8 }} />
            <Button type="primary" icon={<PlayCircleOutlined />} size="small" onClick={handleOcrExtract} style={{ marginBottom: 12 }}>AI 抽取</Button>
            {ocrResult && (
              <div style={{ background: '#f5f5f5', borderRadius: 4, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>抽取结果</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{String(ocrResult.docType ?? 'Commercial Invoice')}</div>
                  {Object.entries((ocrResult.fields as Record<string, string>) ?? {}).slice(0, 6).map(([k, v]) => (
                    <Row key={k} gutter={8}>
                      <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>{k}:</Text> <span style={{ fontWeight: 600 }}>{v}</span></Col>
                    </Row>
                  ))}
                  <div style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 12 }}>置信度:</Text> <span style={{ fontWeight: 600, color: '#52c41a' }}>{String(ocrResult.confidence ?? 95)}%</span></div>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card size="small" title="HS 编码归类" style={{ borderRadius: 4 }}>
            <Input size="small" placeholder="输入商品中英文名称..." value={hsText} onChange={(e) => setHsText(e.target.value)} style={{ marginBottom: 8 }} />
            <Button type="primary" icon={<PlayCircleOutlined />} size="small" onClick={handleHsClassify} style={{ marginBottom: 12 }}>AI 归类</Button>
            {hsResult && (
              <div style={{ background: '#f5f5f5', borderRadius: 4, padding: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>归类建议</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{String(hsResult.productNameEn ?? 'LED Light Bar')}</div>
                  <Row gutter={8}>
                    <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>HS 编码:</Text> <span style={{ fontWeight: 600 }}>{String(hsResult.hsCode ?? '9405.40.00')}</span></Col>
                    <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>退税率:</Text> <span style={{ fontWeight: 600 }}>{String(hsResult.refundRate ?? 13)}%</span></Col>
                  </Row>
                  <div style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 12 }}>归类依据:</Text> <span style={{ fontWeight: 600 }}>{String(hsResult.reason ?? 'LED 灯具归类')}</span></div>
                  <div style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 12 }}>置信度:</Text> <span style={{ fontWeight: 600, color: '#52c41a' }}>{String(hsResult.confidence ?? 90)}%</span></div>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card size="small" title="单证一致性审核" style={{ borderRadius: 4 }}>
            <Alert type="info" message="L/C 项下需确保「单单相符 · 单证相符」，系统自动比对发票/箱单/提单/产地证关键字段，标记不符点。" style={{ marginBottom: 12 }} showIcon />
            <Button type="primary" icon={<PlayCircleOutlined />} size="small">模拟审核</Button>
            <div style={{ background: '#f5f5f5', borderRadius: 4, padding: 12, marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>审核结果</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="success" style={{ marginRight: 8 }}>通过</Tag>
                <Tag color="success" style={{ marginRight: 8 }}>关键不符点: 0</Tag>
                <Tag color="warning">次要不符点: 1</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                发票金额与信用证金额一致；提单目的港与合同一致；产地证出运日期与报关单一致。
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
