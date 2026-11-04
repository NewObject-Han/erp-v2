/**
 * 登录页
 *
 * 左侧品牌区 + 右侧登录卡。演示账号来自系统用户数据，
 * 演示密码统一 erp123；登录后按角色过滤菜单权限。
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntApp, Button, Card, Form, Input, theme as antdTheme } from 'antd';
import { LockOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import useAuthStore from '../../stores/useAuthStore';
import useUiStore from '../../stores/useUiStore';
import { useT } from '../../i18n';
import { users, roles as rolesRepo, permissions as permissionsRepo } from '../../api/repository';

/** 演示环境统一密码 */
export const DEMO_PASSWORD = 'erp123';

const SELLING_POINTS: Record<'zh' | 'en', string[]> = {
  zh: [
    '询盘 → 报价 → PI → 订单 → 退税全流程闭环',
    'AI 智能归类 / 利润模拟 / 单证审核',
    '多币种报价与财务应收管理',
    '库存预警 · 跟单异常 · 应收逾期主动提醒',
  ],
  en: [
    'Inquiry → Quote → PI → Order → Refund, one closed loop',
    'AI HS classification / profit simulation / doc review',
    'Multi-currency quotations & AR management',
    'Stock alerts · tracking exceptions · overdue reminders',
  ],
};

const DEMO_ACCOUNTS = [
  { username: 'admin', name: '李总', role: '系统管理员' },
  { username: 'chen.sales', name: '陈销售', role: '销售' },
  { username: 'zhao.buyer', name: '赵采购', role: '采购' },
  { username: 'wang.doc', name: '王单证', role: '单证' },
];

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { token } = antdTheme.useToken();
  const t = useT();
  const lang = useUiStore((s) => s.lang);
  const login = useAuthStore((s) => s.login);
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const points = SELLING_POINTS[lang];

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const [userList, roleList, permList] = await Promise.all([
        users.all(),
        rolesRepo.all(),
        permissionsRepo.all(),
      ]);
      const user = userList.find((u) => u.username === values.username.trim());
      if (!user) {
        message.error(t('账号不存在'));
        return;
      }
      if (user.status !== 'active') {
        message.error(t('该账号已停用'));
        return;
      }
      if (values.password !== DEMO_PASSWORD) {
        message.error(lang === 'zh' ? `密码错误（演示密码：${DEMO_PASSWORD}）` : `Wrong password (demo: ${DEMO_PASSWORD})`);
        return;
      }
      const lastLoginAt = new Date().toISOString();
      await users.update(user.id, { lastLoginAt });
      login({ ...user, lastLoginAt }, roleList, permList);
      message.success(`${t('欢迎回来，')}${user.displayName}`);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 左侧品牌区 */}
      <div
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(135deg, #0e1c30 0%, #16334f 55%, #1d4a6e 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 56px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 8,
              background: 'rgba(255,255,255,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, flexShrink: 0,
            }}
          >
            贸
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>外贸 ERP V2</div>
            <div style={{ fontSize: 12.5, opacity: 0.72, marginTop: 2 }}>Trade Enterprise Resource Planning</div>
          </div>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 26, opacity: 0.95 }}>
          {t('询盘 · 报价 · 订单 · 退税，全流程数字化')}
        </div>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, fontSize: 13.5, opacity: 0.85 }}>
            <ThunderboltOutlined style={{ color: token.colorPrimary, fontSize: 14 }} />
            <span>{p}</span>
          </div>
        ))}
        <div style={{ marginTop: 40, fontSize: 11.5, opacity: 0.45 }}>
          © 2026 Demo Workspace · Mock 数据仅用于演示
        </div>
      </div>

      {/* 右侧登录卡 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: token.colorBgLayout }}>
        <Card style={{ width: 400, boxShadow: token.boxShadowSecondary }} styles={{ body: { padding: '28px 32px 24px' } }}>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{t('登录')}</div>
          <div style={{ fontSize: 12.5, color: token.colorTextSecondary, marginBottom: 20 }}>{t('使用系统账号登录工作台')}</div>
          <Form<LoginForm> form={form} layout="vertical" size="large" onFinish={handleLogin} initialValues={{ username: 'admin', password: DEMO_PASSWORD }}>
            <Form.Item name="username" rules={[{ required: true, message: t('请输入账号') }]}>
              <Input prefix={<UserOutlined style={{ opacity: 0.4 }} />} placeholder={t('账号，如 admin')} autoFocus />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: t('请输入密码') }]}>
              <Input.Password prefix={<LockOutlined style={{ opacity: 0.4 }} />} placeholder={t('密码')} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 4 }}>
              {t('登 录')}
            </Button>
          </Form>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 8 }}>
              {lang === 'zh'
                ? <>演示账号（密码统一 <b>{DEMO_PASSWORD}</b>，点击填充）：</>
                : <>Demo accounts (password <b>{DEMO_PASSWORD}</b>, click to fill):</>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {DEMO_ACCOUNTS.map((a) => (
                <Button
                  key={a.username}
                  size="small"
                  style={{ fontSize: 12 }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => form.setFieldsValue({ username: a.username, password: DEMO_PASSWORD })}
                >
                  {a.name} · {t(a.role)}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
