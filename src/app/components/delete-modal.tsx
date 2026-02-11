import { X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ isOpen, taskTitle, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-surface-2 border border-border-stroke rounded-[16px] p-6 w-full max-w-md mx-4 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 hover:bg-surface-1 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        <h2 className="text-[20px] font-semibold text-text-primary mb-2">Delete quest?</h2>
        <p className="text-[14px] text-text-secondary mb-6">
          Are you sure you want to delete "<span className="text-text-primary font-medium">{taskTitle}</span>"? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 px-4 rounded-[12px] bg-surface-1 border border-border-stroke text-text-primary text-[14px] font-medium hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 px-4 rounded-[12px] bg-priority-high text-text-primary text-[14px] font-medium hover:bg-priority-high/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
