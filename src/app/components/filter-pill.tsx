interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-[14px] font-medium transition-all ${
        active
          ? 'bg-purple-accent-subtle border border-purple-accent text-text-primary'
          : 'bg-surface-1 border border-border-stroke text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  );
}
