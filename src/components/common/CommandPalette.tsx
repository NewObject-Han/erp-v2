/**
 * Ctrl+K 全局命令面板
 *
 * 静态命令（页面导航 / 界面动作）由调用方传入，
 * 数据搜索（客户/商品/供应商/单号）内置复用全局搜索数据。
 * 键盘：↑↓ 选择 · Enter 执行 · Esc 关闭。
 */
import { useEffect, useMemo, useState } from 'react';
import { AutoComplete, Input, Modal, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSearchItems } from '../../api/hooks/useSearch';

const { Text } = Typography;

export interface Command {
  id: string;
  label: string;
  /** 分组：页面 / 操作 */
  group: string;
  run: () => void;
}

interface CommandOption {
  value: string;
  label: string;
  /** 静态命令 id（命中则执行 run） */
  cmdId?: string;
  /** 数据条目跳转路径 */
  path?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

export default function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const searchItems = useSearchItems(keyword);

  useEffect(() => {
    if (open) setKeyword('');
  }, [open]);

  const options = useMemo<CommandOption[]>(() => {
    const kw = keyword.trim().toLowerCase();
    const matched = commands
      .filter((c) => !kw || c.label.toLowerCase().includes(kw) || c.group.toLowerCase().includes(kw))
      .map((c) => ({ value: `cmd:${c.id}`, label: `${c.group} · ${c.label}`, cmdId: c.id }));
    const data = searchItems.map((s) => ({
      value: `nav:${s.value}`,
      label: `数据 · ${s.label}`,
      path: s.path,
    }));
    return [...matched, ...data].slice(0, 20);
  }, [keyword, commands, searchItems]);

  const handleSelect = (_value: string, option: unknown) => {
    const o = option as CommandOption;
    if (o.cmdId) {
      commands.find((c) => c.id === o.cmdId)?.run();
    } else if (o.path) {
      navigate(o.path);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      title={null}
      styles={{ content: { padding: 12, borderRadius: 8 }, body: {} }}
    >
      <AutoComplete
        autoFocus
        value={keyword}
        onChange={setKeyword}
        options={options}
        onSelect={handleSelect}
        style={{ width: '100%' }}
        popupMatchSelectWidth
        notFoundContent={null}
      >
        <Input
          size="large"
          placeholder="输入命令或搜索客户 / 商品 / 单号..."
          allowClear
        />
      </AutoComplete>
      <Space size={12} style={{ marginTop: 10 }}>
        <Text type="secondary" style={{ fontSize: 11.5 }}>↑↓ 选择</Text>
        <Text type="secondary" style={{ fontSize: 11.5 }}>Enter 执行</Text>
        <Text type="secondary" style={{ fontSize: 11.5 }}>Esc 关闭</Text>
        <Text type="secondary" style={{ fontSize: 11.5 }}>Ctrl+K 随时唤起</Text>
      </Space>
    </Modal>
  );
}
