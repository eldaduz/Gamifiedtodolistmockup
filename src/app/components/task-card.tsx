import { Calendar, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge } from './priority-badge';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`bg-surface-1 border border-border-stroke rounded-[14px] p-3 min-h-[72px] transition-all hover:border-purple-accent/50 ${
        isOverdue ? 'border-l-4 border-l-overdue-warning' : ''
      }`}
    >
      {/* Top row: checkbox + content */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            task.completed
              ? 'bg-purple-accent border-purple-accent'
              : 'border-border-stroke hover:border-purple-accent'
          }`}
          aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-[14px] font-normal mb-2 line-clamp-2 ${
              task.completed ? 'text-text-secondary line-through' : 'text-text-primary'
            }`}
          >
            {task.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} />

            {task.dueDate && (
              <div
                className={`flex items-center gap-1 text-[12px] ${
                  isOverdue ? 'text-overdue-warning' : 'text-text-secondary'
                }`}
              >
                {isOverdue && <AlertCircle className="w-3 h-3" />}
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row (mobile-friendly): XP + actions */}
      <div className="mt-3 flex items-center justify-between gap-3 pl-8">
        <span className="text-[12px] font-medium text-purple-accent">+{task.xpReward} XP</span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task.id)}
            className="p-1 hover:bg-surface-2 rounded transition-colors"
            aria-label="Edit task"
          >
            <Pencil className="w-4 h-4 text-text-secondary hover:text-text-primary" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-surface-2 rounded transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4 text-text-secondary hover:text-priority-high" />
          </button>
        </div>
      </div>
    </div>
  );
}
