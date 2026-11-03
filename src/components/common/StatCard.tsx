import { Card } from 'antd';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  color?: string;
}

export default function StatCard({ title, value, icon, trend, color = '#1668dc' }: StatCardProps) {
  return (
    <Card size="small" styles={{ body: { padding: 12 } }} style={{ borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{title}</span>
        {icon && (
          <span style={{ width: 28, height: 28, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}15`, color }}>
            {icon}
          </span>
        )}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, lineHeight: '26px' }}>{value}</div>
      {typeof trend === 'number' && (
        <div style={{ fontSize: 11, color: trend >= 0 ? '#52c41a' : '#ff4d4f', marginTop: 2 }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </Card>
  );
}
