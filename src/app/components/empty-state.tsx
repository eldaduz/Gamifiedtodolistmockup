import { CheckCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="bg-surface-1 border border-border-stroke rounded-[16px] p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-purple-accent-subtle flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-purple-accent" />
      </div>
      <h3 className="text-[18px] font-semibold text-text-primary mb-2">No Quests Available</h3>
      <p className="text-[14px] text-text-secondary">Good job! Time to create new quests.</p>
    </div>
  );
}
