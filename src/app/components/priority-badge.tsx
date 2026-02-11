interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles = {
    high: {
      bg: 'bg-priority-high-bg',
      border: 'border-priority-high',
      text: 'text-priority-high',
      label: 'High',
    },
    medium: {
      bg: 'bg-priority-medium-bg',
      border: 'border-priority-medium',
      text: 'text-priority-medium',
      label: 'Medium',
    },
    low: {
      bg: 'bg-priority-low-bg',
      border: 'border-priority-low',
      text: 'text-priority-low',
      label: 'Low',
    },
  };

  const style = styles[priority];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full border text-[12px] font-medium ${style.bg} ${style.border} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
