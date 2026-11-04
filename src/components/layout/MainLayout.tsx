import { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Input, Space, Typography, Button, Result, theme as antdTheme, AutoComplete, Popover, List, Empty } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  ShoppingOutlined,
  ProfileOutlined,
  CarOutlined,
  HddOutlined,
  AccountBookOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  TeamOutlined,
  RobotOutlined,
  SettingOutlined,
  ApiOutlined,
  SearchOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
  WarningOutlined,
  ExceptionOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { useStockAlerts, useTrackingExceptions, useReceivables, useSearchItems } from '../../api/hooks';
import type { SearchItem } from '../../api/hooks';
import CommandPalette, { type Command } from '../common/CommandPalette';
import useAuthStore from '../../stores/useAuthStore';
import useUiStore from '../../stores/useUiStore';
import { useT } from '../../i18n';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface NavItem {
  label: string;
  key: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  key: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '总览',
    key: 'group-overview',
    items: [{ label: '工作台', key: '/', icon: <DashboardOutlined /> }],
  },
  {
    title: '业务',
    key: 'group-business',
    items: [
      { label: '销售管理', key: '/sales', icon: <ShopOutlined /> },
      { label: '采购管理', key: '/purchase', icon: <ShoppingOutlined /> },
      { label: '订单跟单', key: '/tracking', icon: <ProfileOutlined /> },
      { label: '物流单证', key: '/logistics', icon: <CarOutlined /> },
      { label: '仓储管理', key: '/warehouse', icon: <HddOutlined /> },
    ],
  },
  {
    title: '财务',
    key: 'group-finance',
    items: [
      { label: '财务管理', key: '/finance', icon: <AccountBookOutlined /> },
      { label: '税务外汇', key: '/tax', icon: <FileTextOutlined /> },
    ],
  },
  {
    title: '基础',
    key: 'group-master',
    items: [
      { label: '主数据', key: '/master', icon: <AppstoreOutlined /> },
      { label: '客户与供应商', key: '/crm', icon: <TeamOutlined /> },
    ],
  },
  {
    title: '平台',
    key: 'group-platform',
    items: [
      { label: 'AI 中心', key: '/ai', icon: <RobotOutlined /> },
      { label: '开放平台', key: '/open', icon: <ApiOutlined /> },
      { label: '系统管理', key: '/system', icon: <SettingOutlined /> },
    ],
  },
];

/** 角色菜单授权（角色 code → 允许访问的路由 key；undefined = 全部）。工作台始终可见 */
const ROLE_MENUS: Record<string, string[] | undefined> = {
  admin: undefined,
  sales: ['/sales', '/tracking', '/logistics', '/master', '/crm', '/ai'],
  buyer: ['/purchase', '/warehouse', '/master', '/crm'],
  doc: ['/logistics', '/tax', '/master'],
};

function buildMenuItems(allowed?: Set<string>, t: (s: string) => string = (s) => s) {
  const groups = allowed
    ? NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((it) => it.key === '/' || allowed.has(it.key)) }))
        .filter((g) => g.items.length > 0)
    : NAV_GROUPS;
  return groups.map((group) => ({
    key: group.key,
    type: 'group' as const,
    label: t(group.title),
    children: group.items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: <Link to={item.key}>{t(item.label)}</Link>,
    })),
  }));
}

// ===== 全局搜索 =====

function GlobalSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const t = useT();
  const items = useSearchItems(keyword);

  return (
    <AutoComplete
      value={keyword}
      onChange={setKeyword}
      options={items}
      onSelect={(_value, option) => {
        const item = option as unknown as SearchItem;
        if (item.path) navigate(item.path);
        setKeyword('');
      }}
      style={{ width: 260 }}
      popupMatchSelectWidth={320}
    >
      <Input
        prefix={<SearchOutlined style={{ color: 'inherit', opacity: 0.45 }} />}
        placeholder={t('全局搜索：客户/商品/单号...')}
        style={{ height: 30, fontSize: 12.5 }}
        allowClear
      />
    </AutoComplete>
  );
}

// ===== 通知中心 =====

interface NoticeItem {
  key: string;
  icon: React.ReactNode;
  text: string;
  sub: string;
  path: string;
}

function NotificationBell() {
  const navigate = useNavigate();
  const { token } = antdTheme.useToken();
  const t = useT();
  const { data: alertData } = useStockAlerts();
  const { data: exceptionData } = useTrackingExceptions();
  const { data: arData } = useReceivables();

  const notices = useMemo(() => {
    const items: NoticeItem[] = [];
    ((alertData as { status?: string; message?: string }[] | undefined) ?? [])
      .filter((a) => a.status === 'open')
      .forEach((a, i) => {
        items.push({ key: `alert-${i}`, icon: <AlertOutlined style={{ color: token.colorWarning }} />, text: String(a.message ?? t('库存预警')), sub: t('仓储管理'), path: '/warehouse' });
      });
    (((exceptionData as { list?: Record<string, unknown>[] })?.list) ?? [])
      .filter((e) => e.status === 'open' || e.status === 'processing')
      .forEach((e, i) => {
        items.push({ key: `exc-${i}`, icon: <ExceptionOutlined style={{ color: token.colorError }} />, text: `${t('跟单异常')}：${String(e.description ?? '')}`, sub: t('订单跟单'), path: '/tracking' });
      });
    (((arData as unknown as { list?: Record<string, unknown>[] })?.list) ?? [])
      .filter((a) => a.status === 'overdue')
      .forEach((a, i) => {
        items.push({ key: `ar-${i}`, icon: <WarningOutlined style={{ color: token.colorError }} />, text: `${t('应收逾期')}：${String(a.code ?? '')}`, sub: t('财务管理'), path: '/finance' });
      });
    return items;
  }, [alertData, exceptionData, arData, token, t]);

  const content = notices.length === 0
    ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('暂无待处理提醒')} style={{ margin: '12px 0' }} />
    : (
      <div style={{ width: 320, maxHeight: 360, overflow: 'auto' }}>
        <List
          size="small"
          dataSource={notices}
          renderItem={(item) => (
            <List.Item
              style={{ padding: '8px 4px', cursor: 'pointer' }}
              onClick={() => navigate(item.path)}
            >
              <List.Item.Meta
                avatar={item.icon}
                title={<Text style={{ fontSize: 12.5 }}>{item.text}</Text>}
                description={<Text type="secondary" style={{ fontSize: 11 }}>{item.sub} · {t('点击前往处理')}</Text>}
              />
            </List.Item>
          )}
        />
      </div>
    );

  return (
    <Popover content={content} title={<Text strong style={{ fontSize: 13 }}>{t('通知中心')}</Text>} trigger="click" placement="bottomRight">
      <Badge count={notices.length} size="small">
        <BellOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antdTheme.useToken();
  const t = useT();
  const lang = useUiStore((s) => s.lang);
  const themeMode = useUiStore((s) => s.themeMode);
  const setLang = useUiStore((s) => s.setLang);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const currentUser = useAuthStore((s) => s.currentUser);
  const roleList = useAuthStore((s) => s.roles);
  const logout = useAuthStore((s) => s.logout);

  const allowedKeys = useMemo(() => {
    if (!currentUser) return undefined;
    const codes = roleList
      .filter((r) => (currentUser.roleIds ?? []).includes(r.id))
      .map((r) => r.code);
    if (codes.includes('admin')) return undefined;
    const keys = new Set<string>();
    codes.forEach((c) => (ROLE_MENUS[c] ?? []).forEach((k) => keys.add(k)));
    keys.add('/');
    return keys;
  }, [currentUser, roleList]);

  const visibleGroups = useMemo(
    () =>
      (allowedKeys
        ? NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((it) => it.key === '/' || allowedKeys.has(it.key)) }))
            .filter((g) => g.items.length > 0)
        : NAV_GROUPS),
    [allowedKeys],
  );

  // Ctrl+K / Cmd+K 唤起命令面板
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 命令面板：页面导航 + 界面动作
  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = visibleGroups.flatMap((g) =>
      g.items.map((it) => ({ id: `nav-${it.key}`, label: it.label, group: '页面', run: () => navigate(it.key) })),
    );
    const actions: Command[] = [
      { id: 'theme', label: themeMode === 'dark' ? '切换浅色模式' : '切换深色模式', group: '操作', run: toggleTheme },
      { id: 'lang', label: lang === 'zh' ? '切换英文界面' : '切换中文界面', group: '操作', run: () => setLang(lang === 'zh' ? 'en' : 'zh') },
      { id: 'collapse', label: collapsed ? '展开侧边栏' : '收起侧边栏', group: '操作', run: () => setCollapsed((c) => !c) },
    ];
    return [...nav, ...actions];
  }, [visibleGroups, themeMode, lang, collapsed, navigate, toggleTheme, setLang]);

  /** 直接输入 URL 访问无权页面时拦截展示 403 */
  const forbidden =
    allowedKeys != null &&
    !(location.pathname === '/' ||
      [...allowedKeys].some((k) => k !== '/' && location.pathname.startsWith(k)));

  const selectedKey =
    visibleGroups.find((g) =>
      g.items.some((item) => (item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key))),
    )?.items.find((item) =>
      item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key),
    )?.key ?? '/';

  const roleNames =
    (currentUser?.roleIds ?? [])
      .map((id) => roleList.find((r) => r.id === id)?.name)
      .filter(Boolean)
      .join('、') || '—';

  const userMenu = {
    items: [
      {
        key: 'who',
        disabled: true,
        label: (
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{currentUser?.displayName ?? t('未登录')}</div>
            <Text type="secondary" style={{ fontSize: 11.5 }}>{roleNames}</Text>
          </div>
        ),
      },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: t('退出登录') },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout();
        navigate('/login', { replace: true });
      }
    },
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        collapsedWidth={60}
        theme={themeMode}
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}`, overflow: 'auto', height: '100vh' }}
      >
        <div style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: collapsed ? '0' : '0 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          flexShrink: 0,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 4,
            background: token.colorPrimary, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>
            贸
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>外贸 ERP V2</span>
          )}
        </div>
        <Menu
          mode="inline"
          theme={themeMode}
          selectedKeys={[selectedKey]}
          items={buildMenuItems(allowedKeys ?? undefined, t)}
          style={{ borderRight: 0, paddingTop: 4 }}
        />
      </Sider>
      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header style={{
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          height: 48,
        }}>
          <Space size={8} align="center">
            <span style={{ cursor: 'pointer', fontSize: 16 }} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <GlobalSearch />
            <Button
              size="small"
              style={{ fontSize: 11, padding: '0 8px', height: 24, color: 'inherit', opacity: 0.55 }}
              onClick={() => setCmdOpen(true)}
              title="打开命令面板 (Ctrl+K)"
            >
              Ctrl K
            </Button>
          </Space>
          <Space size={12} align="center">
            <NotificationBell />
            <Button
              type="text"
              size="small"
              icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              title={themeMode === 'dark' ? '切换浅色模式' : '切换深色模式'}
            />
            <Button
              type="text"
              size="small"
              icon={<GlobalOutlined style={{ fontSize: 13 }} />}
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </Button>
            <Dropdown menu={userMenu} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }} size={6}>
                <Avatar size={26} style={{ background: token.colorPrimary, fontSize: 12 }}>
                  {(currentUser?.displayName ?? '未')[0]}
                </Avatar>
                <Text style={{ fontSize: 13 }}>{currentUser?.displayName ?? '未登录'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          flex: 1,
          overflow: 'auto',
          background: token.colorBgLayout,
          padding: 16,
        }}>
          {forbidden ? (
            <Result
              status="403"
              title="403"
              subTitle={t('抱歉，当前角色没有访问该页面的权限')}
              extra={<Button type="primary" onClick={() => navigate('/')}>{t('返回工作台')}</Button>}
            />
          ) : (
            <div key={location.pathname} className="page-transition">
              <Outlet />
            </div>
          )}
        </Content>
      </Layout>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} commands={commands} />
    </Layout>
  );
}
