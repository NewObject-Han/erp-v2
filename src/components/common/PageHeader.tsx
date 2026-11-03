import { Space, Typography, type SpaceProps } from 'antd';

const { Text } = Typography;

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <Text strong style={{ fontSize: 17, lineHeight: '24px' }}>{title}</Text>
        {subtitle && (
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions && <Space size={8}>{actions}</Space>}
    </div>
  );
}

export type PageHeaderProps = SpaceProps & { title: string; subtitle?: string; actions?: React.ReactNode };
