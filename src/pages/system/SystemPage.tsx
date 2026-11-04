import { useState } from 'react';
import { Card, Tabs, Button, Form, Row, Col, Input, Switch, Form as AntForm, Space, theme as antdTheme } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { useUsers, useRoles, usePermissions, useCreateUser, useCreateRole } from '../../api/hooks';
import DataTable from '../../components/common/DataTable';
import { exportTableCsv } from '../../utils/exportCsv';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import FormDialog from '../../components/common/FormDialog';
import type { TableProps } from 'antd';

type AnyRow = Record<string, unknown>;

export default function SystemPage() {
  const { token } = antdTheme.useToken();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form] = AntForm.useForm();

  const { data: userData } = useUsers();
  const { data: roleData } = useRoles();
  const { data: permData } = usePermissions();
  const createUser = useCreateUser();
  const createRole = useCreateRole();

  const users = (userData as unknown[]) ?? [];
  const roles = (roleData as AnyRow[]) ?? [];
  const permissions = (permData as unknown[]) ?? [];

  const roleNameMap = new Map(roles.map((r) => [String(r.id), String(r.name ?? r.code ?? r.id)]));
  const roleNames = (v: unknown) => {
    const ids = Array.isArray(v) ? v : [];
    if (ids.length === 0) return '—';
    return ids.map((id) => roleNameMap.get(String(id)) ?? String(id)).join('、');
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    if (tab === 0) createUser.mutate({ ...values, id: `usr_${Date.now()}`, createdAt: new Date().toISOString() } as never);
    else createRole.mutate({ ...values, id: `role_${Date.now()}`, createdAt: new Date().toISOString() } as never);
    setDialogOpen(false);
    form.resetFields();
  };

  const userCols: TableProps<AnyRow>['columns'] = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '姓名', dataIndex: 'displayName', width: 100 },
    { title: '邮箱', dataIndex: 'email', width: 180 },
    { title: '角色', dataIndex: 'roleIds', width: 120, render: (v) => roleNames(v) },
    { title: '管理员', dataIndex: 'isAdmin', width: 70, render: (v) => v ? '是' : '否' },
    { title: '状态', dataIndex: 'status', width: 70, render: (v) => <StatusBadge status={String(v)} label={String(v)} /> },
  ];
  const roleCols: TableProps<AnyRow>['columns'] = [
    { title: '编码', dataIndex: 'code', width: 120 },
    { title: '名称', dataIndex: 'name', width: 120 },
    { title: '说明', dataIndex: 'description', width: 200 },
    { title: '权限数', dataIndex: 'permissionIds', width: 80, render: (v) => (Array.isArray(v) ? v.length : 0) },
    { title: '内置', dataIndex: 'builtin', width: 60, render: (v) => v ? '是' : '否' },
  ];
  const permCols: TableProps<AnyRow>['columns'] = [
    { title: '模块', dataIndex: 'module', width: 120 },
    { title: '操作', dataIndex: 'action', width: 100 },
    { title: '说明', dataIndex: 'description', width: 200 },
  ];

  const colsMap = [userCols, roleCols, permCols];
  const rowsMap = [users, roles, permissions];
  const tabLabels = ['用户', '角色', '权限'];

  const handleExport = () => {
    exportTableCsv(`系统管理-${tabLabels[tab]}-${new Date().toISOString().slice(0, 10)}`, colsMap[tab], rowsMap[tab]);
  };

  return (
    <div>
      <PageHeader title="系统管理" subtitle="用户 · 角色 · 权限" actions={<Space><Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button><Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => { form.resetFields(); form.setFieldsValue({ status: 'active', isAdmin: false }); setDialogOpen(true); }}>新增</Button></Space>} />
      <Card size="small" style={{ borderRadius: 4 }} styles={{ body: { padding: '0 12px 12px' } }}>
        <Tabs activeKey={String(tab)} onChange={(k) => setTab(Number(k))} items={tabLabels.map((label, i) => ({ key: String(i), label }))} style={{ minHeight: 36 }} />
        <DataTable columns={colsMap[tab]} rows={rowsMap[tab]} />
      </Card>
      <FormDialog open={dialogOpen} title="新增" onClose={() => setDialogOpen(false)} onSave={handleSave} width={560}>
        <AntForm form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
          <Row gutter={12}>
            <Col span={12}><AntForm.Item name="username" label="用户名"><Input size="small" /></AntForm.Item></Col>
            <Col span={12}><AntForm.Item name="displayName" label="姓名"><Input size="small" /></AntForm.Item></Col>
            <Col span={24}><AntForm.Item name="email" label="邮箱"><Input size="small" /></AntForm.Item></Col>
            <Col span={24}><AntForm.Item name="isAdmin" label="管理员" valuePropName="checked"><Switch size="small" /></AntForm.Item></Col>
          </Row>
        </AntForm>
      </FormDialog>
    </div>
  );
}
