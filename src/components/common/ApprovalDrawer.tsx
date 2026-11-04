/**
 * 审批工作流抽屉
 *
 * 发起审批 → 指定审批人 → 通过 / 驳回，全过程时间线留痕。
 * 业务单据状态回写通过 onBizAction 回调由调用方处理。
 */
import { useEffect, useState } from 'react';
import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Input,
  Select,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd';
import { CheckOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { useApprovals, useCreateApproval, useUpdateApproval } from '../../api/hooks';
import useAuthStore from '../../stores/useAuthStore';
import type { ApprovalBizType, ApprovalRecord } from '../../types';

const { Text } = Typography;
const { TextArea } = Input;

const APPROVER_OPTIONS = [
  { label: '销售总监', value: '销售总监' },
  { label: '财务总监', value: '财务总监' },
  { label: '总经理', value: '总经理' },
];

const STATUS_TAGS: Record<ApprovalRecord['status'], { color: string; label: string }> = {
  pending: { color: 'processing', label: '审批中' },
  approved: { color: 'success', label: '已通过' },
  rejected: { color: 'error', label: '已驳回' },
};

const ACTION_LABELS: Record<string, string> = {
  apply: '发起审批',
  approve: '审批通过',
  reject: '审批驳回',
};

const ACTION_COLORS: Record<string, string> = {
  apply: 'blue',
  approve: 'green',
  reject: 'red',
};

const fmtTime = (iso: string) => iso.slice(0, 16).replace('T', ' ');

type Phase = 'init' | 'pending' | 'approved' | 'rejected';

interface ApprovalDrawerProps {
  open: boolean;
  bizType: ApprovalBizType;
  bizId: string;
  bizCode: string;
  /** 单据类型名，如：报价单 / 付款单 */
  docLabel: string;
  amount: number;
  currency: string;
  /** 申请人（单据跟进人） */
  applicant?: string;
  /** 审批动作回写业务单据（由调用方实现） */
  onBizAction?: (phase: 'apply' | 'approve' | 'reject', comment: string, operator: string) => void;
  onClose: () => void;
}

export default function ApprovalDrawer({
  open,
  bizType,
  bizId,
  bizCode,
  docLabel,
  amount,
  currency,
  applicant,
  onBizAction,
  onClose,
}: ApprovalDrawerProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const operator = currentUser?.displayName ?? currentUser?.username ?? '当前用户';
  const defaultApplicant = applicant && applicant !== '—' ? applicant : operator;

  const { data, isLoading } = useApprovals({ bizId, bizType });
  const createApproval = useCreateApproval();
  const updateApproval = useUpdateApproval();

  const record = data?.list[0] ?? null;

  const [approver, setApprover] = useState('销售总监');
  const [comment, setComment] = useState('');

  // 单据打开时回填默认审批人
  useEffect(() => {
    if (record?.approver) setApprover(record.approver);
    setComment('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id, open]);

  const phase: Phase = !record ? 'init' : (record.status as Phase);
  const busy = createApproval.isPending || updateApproval.isPending;

  const nowIso = () => new Date().toISOString();

  /** 首次发起 / 驳回后重新发起 */
  const handleInitiate = () => {
    const text = comment.trim();
    const node = { at: nowIso(), action: 'apply' as const, operator: defaultApplicant, comment: text || '发起审批' };
    if (!record) {
      createApproval.mutate(
        {
          bizType,
          bizId,
          bizCode,
          title: `${docLabel} ${bizCode}`,
          amount,
          currency,
          applicant: defaultApplicant,
          approver,
          status: 'pending',
          remark: text || '发起审批',
          timeline: [node],
        },
        {
          onSuccess: () => {
            message.success('审批已发起');
            onBizAction?.('apply', text, defaultApplicant);
          },
        },
      );
      return;
    }
    updateApproval.mutate(
      {
        id: record.id,
        data: {
          status: 'pending',
          approver,
          remark: text || '重新发起审批',
          timeline: [...(record.timeline ?? []), node],
        },
      },
      {
        onSuccess: () => {
          message.success('审批已重新发起');
          onBizAction?.('apply', text, defaultApplicant);
        },
      },
    );
  };

  const handleDecide = (action: 'approve' | 'reject') => {
    if (!record) return;
    const text = comment.trim() || (action === 'approve' ? '同意，审批通过' : '不同意，驳回');
    updateApproval.mutate(
      {
        id: record.id,
        data: {
          status: action === 'approve' ? 'approved' : 'rejected',
          remark: text,
          timeline: [
            ...(record.timeline ?? []),
            { at: nowIso(), action, operator: record.approver, comment: text },
          ],
        },
      },
      {
        onSuccess: () => {
          message.success(action === 'approve' ? '已通过审批' : '已驳回审批');
          onBizAction?.(action, text, record.approver);
        },
      },
    );
  };

  const statusTag = record ? (
    <Tag color={STATUS_TAGS[record.status].color}>{STATUS_TAGS[record.status].label}</Tag>
  ) : (
    <Tag>未发起</Tag>
  );

  const timelineItems = (record?.timeline ?? []).map((node, i) => ({
    color: ACTION_COLORS[node.action] ?? 'blue',
    children: (
      <div style={{ fontSize: 12.5 }}>
        <Space size={6}>
          <Text strong>{ACTION_LABELS[node.action] ?? node.action}</Text>
          <Text type="secondary">{node.operator}</Text>
          <Text type="secondary" style={{ fontSize: 11.5 }}>{fmtTime(node.at)}</Text>
        </Space>
        <div style={{ color: 'rgba(0,0,0,0.55)', marginTop: 2 }}>{node.comment}</div>
      </div>
    ),
    key: i,
  }));

  return (
    <Drawer
      open={open}
      title={`${docLabel}审批 · ${bizCode}`}
      width={520}
      onClose={onClose}
      styles={{ body: { padding: '16px 20px' } }}
      footer={
        <Space style={{ float: 'right' }}>
          <Button size="small" onClick={onClose}>关闭</Button>
          {(phase === 'init' || phase === 'rejected') && (
            <Button
              type="primary"
              size="small"
              icon={<SendOutlined />}
              loading={busy}
              onClick={handleInitiate}
            >
              {phase === 'init' ? '发起审批' : '重新发起'}
            </Button>
          )}
          {phase === 'pending' && (
            <>
              <Button danger size="small" icon={<CloseOutlined />} loading={busy} onClick={() => handleDecide('reject')}>
                驳回
              </Button>
              <Button type="primary" size="small" icon={<CheckOutlined />} loading={busy} onClick={() => handleDecide('approve')}>
                通过
              </Button>
            </>
          )}
        </Space>
      }
    >
      <Spin spinning={isLoading}>
        <Descriptions size="small" bordered column={1}>
          <Descriptions.Item label="单据">{docLabel} {bizCode}</Descriptions.Item>
          <Descriptions.Item label="金额">{Number(amount).toLocaleString()} {currency}</Descriptions.Item>
          <Descriptions.Item label="申请人">{record?.applicant ?? defaultApplicant}</Descriptions.Item>
          <Descriptions.Item label="审批人">
            {(phase === 'init' || phase === 'rejected') ? (
              <Select
                size="small"
                style={{ width: 160 }}
                value={approver}
                onChange={setApprover}
                options={APPROVER_OPTIONS}
              />
            ) : (
              record?.approver ?? '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="状态">{statusTag}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, margin: '16px 0 8px' }}>
          审批时间线
        </Divider>
        {timelineItems.length === 0 ? (
          <Text type="secondary" style={{ fontSize: 12.5 }}>暂无审批记录，发起后在此留痕</Text>
        ) : (
          <Timeline items={timelineItems} style={{ marginBottom: 0 }} />
        )}

        {(phase === 'init' || phase === 'pending' || phase === 'rejected') && (
          <>
            <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, margin: '8px 0 12px' }}>
              {phase === 'pending' ? '审批意见' : phase === 'rejected' ? '重新发起说明' : '发起说明'}
            </Divider>
            <TextArea
              rows={3}
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={phase === 'pending' ? '填写审批意见（可选）' : '填写说明（可选）'}
              style={{ fontSize: 12.5 }}
            />
          </>
        )}
        {phase === 'approved' && (
          <Text type="success" style={{ fontSize: 12.5 }}>该单据审批已通过，记录已归档。</Text>
        )}
      </Spin>
    </Drawer>
  );
}
