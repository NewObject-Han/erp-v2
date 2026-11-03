/**
 * 种子数据：客户与供应商
 */

import type {
  Customer,
  FollowUp,
  Opportunity,
  CustomerCredit,
  Supplier,
  SupplierQualification,
} from '../../types';

export const seedCustomers: Customer[] = [
  {
    id: 'cus_abc',
    code: 'C001',
    name: 'ABC Trading Co., Ltd.',
    country: 'USA',
    contactPerson: 'John Smith',
    email: 'john.smith@abctrading.com',
    phone: '+1-213-555-0100',
    address: '1234 Wilshire Blvd, Los Angeles, CA 90017',
    paymentTerms: 'T/T',
    creditLimit: 500000,
    creditDays: 30,
    status: 'active',
    level: 'A',
    source: '展会',
    website: 'www.abctrading.com',
    tags: ['大客户', '灯具', '美国市场', '返单'],
    remark: '长期合作客户，主要采购 LED 面板灯与球泡',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'cus_global',
    code: 'C002',
    name: 'Global Lighting GmbH',
    country: 'Germany',
    contactPerson: 'Hans Müller',
    email: 'h.mueller@global-lighting.de',
    phone: '+49-30-555-0200',
    address: 'Friedrichstr 42, 10117 Berlin',
    paymentTerms: 'L/C',
    creditLimit: 300000,
    creditDays: 45,
    status: 'active',
    level: 'B',
    source: 'B2B 平台',
    website: 'www.global-lighting.de',
    tags: ['欧洲市场', '质量要求高', '认证齐全'],
    remark: '偏好 CIF 条款，需 CE/REACH 认证',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'cus_aladdin',
    code: 'C003',
    name: 'Aladdin Import & Export',
    country: 'UAE',
    contactPerson: 'Ahmed Al-Rashid',
    email: 'ahmed@aladin.ae',
    phone: '+971-4-555-0300',
    address: 'Deira, Dubai, UAE',
    paymentTerms: 'OA',
    creditLimit: 200000,
    creditDays: 60,
    status: 'active',
    level: 'B',
    source: '客户转介绍',
    website: 'www.aladin-import.com',
    tags: ['中东市场', '价格敏感', '新客户'],
    remark: '中东市场，首次合作需谨慎',
    createdAt: '',
    updatedAt: '',
  },
];

export const seedFollowUps: FollowUp[] = [
  {
    id: 'fu_1', customerId: 'cus_abc', type: 'email',
    content: '发送 LED 面板灯最新目录与报价单', at: '2026-09-20T10:00:00.000Z',
    user: '王芳', createdAt: '', updatedAt: '',
  },
  {
    id: 'fu_2', customerId: 'cus_abc', type: 'call',
    content: '电话沟通确认 Q4 采购计划约 5000 件', at: '2026-10-05T15:00:00.000Z',
    user: '王芳', createdAt: '', updatedAt: '',
  },
  {
    id: 'fu_3', customerId: 'cus_global', type: 'visit',
    content: '广交会面谈，客户对台灯新品感兴趣', at: '2026-10-12T09:30:00.000Z',
    user: '李明', createdAt: '', updatedAt: '',
  },
];

export const seedOpportunities: Opportunity[] = [
  {
    id: 'opp_1', customerId: 'cus_abc', inquiryId: 'inq_1', title: 'Q4 LED 面板灯批量订单',
    estimatedAmount: 82000, currency: 'USD', stage: 'won', expectedClose: '2026-11-15',
    probability: 100, remark: '已确认订单', createdAt: '', updatedAt: '',
  },
  {
    id: 'opp_2', customerId: 'cus_global', inquiryId: 'inq_2', title: 'LED 护眼台灯新项目',
    estimatedAmount: 45000, currency: 'EUR', stage: 'negotiation', expectedClose: '2026-12-01',
    probability: 60, remark: '样品已确认，价格谈判中', createdAt: '', updatedAt: '',
  },
  {
    id: 'opp_3', customerId: 'cus_aladdin', title: '中东 LED 球泡首单',
    estimatedAmount: 28000, currency: 'USD', stage: 'sample', expectedClose: '2026-12-20',
    probability: 40, remark: '样品已寄送，等待反馈', createdAt: '', updatedAt: '',
  },
];

export const seedCustomerCredits: CustomerCredit[] = [
  {
    id: 'credit_1', customerId: 'cus_abc', creditLimit: 500000, usedAmount: 82000,
    availableAmount: 418000, creditDays: 30, status: 'normal',
    lastUpdated: '2026-10-20T00:00:00.000Z', createdAt: '', updatedAt: '',
  },
  {
    id: 'credit_2', customerId: 'cus_global', creditLimit: 300000, usedAmount: 245000,
    availableAmount: 55000, creditDays: 45, status: 'warning',
    lastUpdated: '2026-10-22T00:00:00.000Z', createdAt: '', updatedAt: '',
  },
  {
    id: 'credit_3', customerId: 'cus_aladdin', creditLimit: 200000, usedAmount: 0,
    availableAmount: 200000, creditDays: 60, status: 'normal',
    lastUpdated: '2026-10-15T00:00:00.000Z', createdAt: '', updatedAt: '',
  },
];

export const seedSuppliers: Supplier[] = [
  {
    id: 'sup_huayi',
    code: 'S001',
    name: '深圳市华艺照明有限公司',
    country: 'China',
    contactPerson: '陈志强',
    email: 'chen.zq@huayi-lighting.cn',
    phone: '+86-755-2788-1000',
    address: '深圳市宝安区福永街道华艺工业园',
    mainCategory: 'LED 灯具',
    level: 'strategic',
    status: 'active',
    qualifications: [],
    onTimeRate: 98,
    remark: '战略供应商，主供 LED 面板灯与球泡',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'sup_zhongke',
    code: 'S002',
    name: '东莞中科电子科技有限公司',
    country: 'China',
    contactPerson: '刘伟',
    email: 'liu.wei@zhongke-elec.cn',
    phone: '+86-769-8555-2000',
    address: '东莞市虎门镇中科电子大厦',
    mainCategory: '电子线材 / 驱动电源',
    level: 'preferred',
    status: 'active',
    qualifications: [],
    onTimeRate: 95,
    remark: '优选供应商，供电源与线材',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'sup_mingzhu',
    code: 'S003',
    name: '中山市明竹家居有限公司',
    country: 'China',
    contactPerson: '黄敏',
    email: 'huang.min@mingzhu-home.cn',
    phone: '+86-760-8666-3000',
    address: '中山市古镇镇明竹工业区',
    mainCategory: '灯具 / 家居',
    level: 'regular',
    status: 'active',
    qualifications: [],
    onTimeRate: 88,
    remark: '普通供应商，供 LED 台灯',
    createdAt: '',
    updatedAt: '',
  },
];

export const seedSupplierQualifications: SupplierQualification[] = [
  {
    id: 'supq_1', supplierId: 'sup_huayi', type: 'ISO9001', certNo: 'CN-2023-001234',
    validTo: '2027-06-30', fileUrl: '', status: 'valid', createdAt: '', updatedAt: '',
  },
  {
    id: 'supq_2', supplierId: 'sup_huayi', type: 'CE', certNo: 'CE-2024-5678',
    validTo: '2026-12-31', fileUrl: '', status: 'valid', createdAt: '', updatedAt: '',
  },
  {
    id: 'supq_3', supplierId: 'sup_zhongke', type: 'ISO9001', certNo: 'CN-2024-005678',
    validTo: '2028-03-31', fileUrl: '', status: 'valid', createdAt: '', updatedAt: '',
  },
  {
    id: 'supq_4', supplierId: 'sup_mingzhu', type: 'BSCI', certNo: 'BSCI-2024-9900',
    validTo: '2026-08-31', fileUrl: '', status: 'expired', createdAt: '', updatedAt: '',
  },
];
