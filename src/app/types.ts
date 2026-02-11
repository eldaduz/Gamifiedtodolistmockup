export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  xpReward: number;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'priority' | 'deadline';
