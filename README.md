# 外贸 ERP V2

高密度专业风格的外贸 ERP 前端系统，覆盖外贸业务全流程：获客 → 询盘 → 报价 → 样品 → PI → 订单 → 采购 → 物流 → 退税 → 财务。

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript 5 |
| UI | Ant Design 5（自定义 ERP 主题） |
| 构建 | Vite 5 |
| 数据层 | TanStack Query（React Query）+ Zustand |
| 路由 | React Router v6 |
| 图表 | ECharts 5 |
| 数据持久化 | localStorage（Mock Repository 模式，可无缝切换真实 API） |

## 功能模块

### 业务模块（13 个）

- **工作台**（Dashboard）：经营概览、核心指标、图表看板
- **销售**（Sales）：询盘 / 报价 / 样品单 / PI / 销售订单 5 个子单据，完整新增、编辑、删除、状态流转
- **采购**（Purchase）：采购订单、供应商对单
- **客户管理**（CRM）：客户档案、跟进记录、商机
- **物流**（Logistics）：订舱、头程/尾程物流单
- **跟单**（Tracking）：订单生产进度、异常预警
- **仓库**（Warehouse）：入库、出库、库存与预警
- **财务**（Finance）：收款、付款、应收应付、对账
- **退税**（Tax）：退税申报、单证管理
- **主数据**（MasterData）：客户、供应商、商品、币种、汇率
- **开放平台**（OpenPlatform）：API 集成配置
- **系统**（System）：用户、角色、权限、操作日志

### AI 中心

- HS 编码智能归类
- 利润模拟器
- 装箱计算器
- 单证智能审核
- 邮件解析（询盘识别）
- OCR 发票提取

### 全局能力

- **全局搜索**：顶栏跨模块搜索客户、商品、供应商、订单，直达详情
- **通知中心**：库存预警、跟单异常、应收逾期聚合提醒
- **CSV 导出**：所有业务页表格一键导出
- **状态流转**：单据状态徽章 + 流程指引

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 类型检查
npm run typecheck

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

> 要求 Node.js >= 18

## 项目结构

```
src/
├── api/            # 数据层：client / repository（localStorage 持久化）/ hooks
│   └── hooks/      # 各模块 React Query hooks + 下拉选项 useLookups
├── ai/             # AI 模拟能力（HS 归类、利润模拟、单证审核等）
├── components/
│   ├── common/     # DataTable、FormDialog、PageHeader、StatCard 等通用组件
│   └── layout/     # MainLayout（侧边导航 + 全局搜索 + 通知中心）
├── data/
│   └── seed/       # Mock 种子数据
├── pages/          # 13 个业务页面（按模块分目录）
├── stores/         # Zustand 全局状态（UI / 认证）
├── theme/          # Ant Design ERP 密度主题
├── types/          # 各模块 TypeScript 类型定义
└── utils/          # CSV 导出、格式化、ID 生成等工具
```
