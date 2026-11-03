import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Input, Space, Typography, theme as antdTheme } from 'antd';
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
} from '@ant-design/icons';

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

function buildMenuItems() {
  return NAV_GROUPS.map((group) => ({
    key: group.key,
    type: 'group' as const,
    label: group.title,
    children: group.items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: <Link to={item.key}>{item.label}</Link>,
    })),
  }));
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antdTheme.useToken();

  const selectedKey = NAV_GROUPS.find((g) =>
    g.items.some((item) => item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key)),
  )?.items.find((item) =>
    item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key),
  )?.key ?? '/';

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
    ],
  };

  const onUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') navigate('/');
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        collapsedWidth={60}
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}`, overflow: 'auto', height: '100vh' }}
        theme="light"
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
          selectedKeys={[selectedKey]}
          items={buildMenuItems()}
          style={{ borderRight: 0, paddingTop: 4 }}
        />
      </Sider>
      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header style={{
          background: '#fff',
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
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
              placeholder="全局搜索..."
              style={{ width: 260, height: 30, fontSize: 12.5 }}
              variant="borderless"
            />
          </Space>
          <Space size={12} align="center">
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
            </Badge>
            <GlobalOutlined style={{ fontSize: 15, color: token.colorTextSecondary, cursor: 'pointer' }} />
            <Dropdown menu={userMenu} onOpenChange={(open) => { if (!open) { /* closed */ } }} onClick={onUserMenuClick} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }} size={6}>
                <Avatar size={26} style={{ background: token.colorPrimary, fontSize: 12 }}>
                  李
                </Avatar>
                <Text style={{ fontSize: 13 }}>李经理</Text>
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
