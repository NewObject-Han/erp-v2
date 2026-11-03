import { Link } from 'react-router-dom';

export interface WorkflowStep {
  label: string;
  to?: string;
}

export default function WorkflowGuide({
  steps,
  current,
}: {
  steps: WorkflowStep[];
  current: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 16,
        padding: '4px 12px',
        background: '#f5f5f5',
        borderRadius: 4,
      }}
    >
      {steps.map((step, i) => {
        const isCurrent = step.label === current;
        const prevIsCurrent = i > 0 && steps[i - 1].label === current;
        return (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span style={{ color: '#d9d9d9', fontSize: 12 }}>→</span>}
            {isCurrent || prevIsCurrent ? (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  background: isCurrent ? '#1668dc' : '#4096ff',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            ) : step.to ? (
              <Link
                to={step.to}
                style={{
                  padding: '2px 8px',
                  fontSize: 12,
                  color: '#6b7280',
                  textDecoration: 'none',
                  borderRadius: 4,
                }}
              >
                {step.label}
              </Link>
            ) : (
              <span style={{ padding: '2px 8px', fontSize: 12, color: '#bfbfbf', whiteSpace: 'nowrap' }}>
                {step.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
