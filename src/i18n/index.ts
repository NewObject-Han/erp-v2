/**
 * 轻量 i18n：中文原文作为 key，英文命中字典则翻译，未命中回退原文。
 * 页面级深层文案可渐进接入，不影响未接入部分。
 */
import useUiStore from '../stores/useUiStore';

const EN_DICT: Record<string, string> = {
  // ===== 菜单分组 =====
  '总览': 'Overview',
  '业务': 'Business',
  '财务': 'Finance',
  '基础': 'Master',
  '平台': 'Platform',
  // ===== 菜单项 =====
  '工作台': 'Dashboard',
  '销售管理': 'Sales',
  '采购管理': 'Purchase',
  '订单跟单': 'Order Tracking',
  '物流单证': 'Logistics & Docs',
  '仓储管理': 'Warehouse',
  '财务管理': 'Finance',
  '税务外汇': 'Tax & FX',
  '主数据': 'Master Data',
  '客户与供应商': 'Customers & Suppliers',
  'AI 中心': 'AI Center',
  '开放平台': 'Open Platform',
  '系统管理': 'System',
  // ===== Header =====
  '全局搜索：客户/商品/单号...': 'Search customer / product / doc no...',
  '通知中心': 'Notifications',
  '暂无待处理提醒': 'Nothing to process',
  '点击前往处理': 'Click to open',
  '退出登录': 'Sign out',
  '未登录': 'Not signed in',
  '库存预警': 'Stock alert',
  '跟单异常': 'Tracking exception',
  '应收逾期': 'Overdue receivable',
  // ===== 403 =====
  '抱歉，当前角色没有访问该页面的权限': 'Sorry, your role has no access to this page',
  '返回工作台': 'Back to Dashboard',
  // ===== 登录页 =====
  '登录': 'Sign in',
  '使用系统账号登录工作台': 'Sign in with your system account',
  '账号，如 admin': 'Username, e.g. admin',
  '密码': 'Password',
  '登 录': 'Sign in',
  '请输入账号': 'Please enter username',
  '请输入密码': 'Please enter password',
  '账号不存在': 'Account not found',
  '该账号已停用': 'This account is disabled',
  '欢迎回来，': 'Welcome back, ',
  '询盘 · 报价 · 订单 · 退税，全流程数字化': 'Inquiry · Quote · Order · Tax refund — fully digital',
  '系统管理员': 'Admin',
  '销售': 'Sales',
  '采购': 'Buyer',
  '单证': 'Documentation',
  // ===== 工作台 =====
  '外贸 ERP 工作台': 'Foreign Trade ERP Workspace',
  'B2B 贸易全流程管理 · 询价 → 报价 → 订单 → 采购 → 跟单 → 出货 → 收款 → 退税': 'B2B trade end-to-end: RFQ → Quote → Order → Purchase → Tracking → Shipment → Payment → Refund',
  '订单总额 (USD)': 'Order Total (USD)',
  '应收余额 (CNY)': 'Receivable Balance (CNY)',
  '待处理询价': 'Pending Inquiries',
  '笔逾期': 'overdue',
  '月度销售趋势': 'Monthly Sales Trend',
  '订单状态分布': 'Order Status Distribution',
  '订单转化漏斗': 'Conversion Funnel',
  '客户 TOP 5（订单金额）': 'Top 5 Customers (Order Amount)',
  '国家 / 地区分布': 'By Country / Region',
};

/** 返回翻译函数：zh 原样返回，en 查字典（未命中回退原文） */
export function useT() {
  const lang = useUiStore((s) => s.lang);
  return (text: string) => (lang === 'zh' ? text : EN_DICT[text] ?? text);
}
