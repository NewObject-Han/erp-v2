/**
 * 看板组件（HTML5 拖拽）
 *
 * 按状态分列展示卡片，卡片可拖拽到其他列并触发 onMove
 * （由调用方发起状态变更），点击卡片可打开详情。
 */
import { useState } from 'react';
import { Tag, theme as antdTheme } from 'antd';
import type { ReactNode } from 'react';

export interface KanbanCardData {
  id: string;
  /** 所属列 key */
  column: string;
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

interface KanbanBoardProps {
  columns: { key: string; title: string; color?: string }[];
  items: KanbanCardData[];
  onMove?: (id: string, from: string, to: string) => void;
  onCardClick?: (id: string) => void;
}

export default function KanbanBoard({ columns, items, onMove, onCardClick }: KanbanBoardProps) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const { token } = antdTheme.useToken();

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8 }}>
      {columns.map((col) => {
        const list = items.filter((it) => it.column === col.key);
        return (
          <div
            key={col.key}
            style={{
              flex: '1 0 200px',
              minWidth: 200,
              maxWidth: 260,
              background: dragOver === col.key ? token.colorPrimaryBg : token.colorFillQuaternary,
              borderRadius: 6,
              padding: 8,
              border: `1px solid ${dragOver === col.key ? token.colorPrimaryBorder : 'transparent'}`,
              transition: 'background 0.15s, border 0.15s',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragOver(col.key)}
            onDragLeave={() => setDragOver((v) => (v === col.key ? null : v))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain');
              const from = e.dataTransfer.getData('application/x-from-col');
              setDragOver(null);
              if (id && onMove && from !== col.key) onMove(id, from, col.key);
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2px 4px 8px',
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                {col.color ? <Tag color={col.color} style={{ marginInlineEnd: 0 }}>{col.title}</Tag> : col.title}
              </span>
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{list.length}</span>
            </div>
            {list.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '18px 0',
                  fontSize: 12,
                  color: token.colorTextQuaternary,
                  border: `1px dashed ${token.colorBorderSecondary}`,
                  borderRadius: 4,
                }}
              >
                拖拽到此处
              </div>
            ) : (
              list.map((it) => (
                <div
                  key={it.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', it.id);
                    e.dataTransfer.setData('application/x-from-col', it.column);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onClick={() => onCardClick?.(it.id)}
                  style={{
                    background: token.colorBgContainer,
                    borderRadius: 4,
                    padding: '8px 10px',
                    marginBottom: 8,
                    cursor: 'grab',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    boxShadow: token.boxShadowTertiary,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{it.title}</div>
                  {it.subtitle && (
                    <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.subtitle}
                    </div>
                  )}
                  {it.extra && <div style={{ marginTop: 6, fontSize: 12 }}>{it.extra}</div>}
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
