// FILE: src/app/App.tsx

import { useState, useEffect, useMemo } from 'react';
import { GamificationHUD } from './components/gamification-hud';
import { FilterPill } from './components/filter-pill';
import { TaskCard } from './components/task-card';
import { EmptyState } from './components/empty-state';
import { DeleteModal } from './components/delete-modal';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { Task, FilterType, SortType } from './types';

const STORAGE_KEY = 'gamified-todo-tasks';
const USER_DATA_KEY = 'gamified-todo-user';

interface UserData {
  level: number;
  currentXP: number;
  maxXP: number;
  streak: number;
}

const initialUserData: UserData = {
  level: 5,
  currentXP: 350,
  maxXP: 500,
  streak: 3,
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const savedUserData = localStorage.getItem(USER_DATA_KEY);

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Initialize with sample tasks for demo
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Complete project documentation and update README with installation instructions',
          completed: false,
          priority: 'medium',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          xpReward: 50,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Fix critical bug in authentication module',
          completed: false,
          priority: 'high',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          xpReward: 100,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Review pull requests from team members',
          completed: true,
          priority: 'low',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          xpReward: 30,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          title:
            'This is a very long quest title that demonstrates how the task card handles text wrapping when the title exceeds the available space and needs to wrap to multiple lines',
          completed: false,
          priority: 'low',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          xpReward: 25,
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(sampleTasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
    }

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    } else {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(initialUserData));
    }
  }, []);

  // Save to localStorage whenever tasks or userData change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }, [userData]);

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      setError("Quest name can't be empty.");
      return;
    }

    const xpReward = newTaskPriority === 'high' ? 100 : newTaskPriority === 'medium' ? 50 : 25;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      xpReward,
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setError('');
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newCompleted = !task.completed;

          // Award XP when completing a task
          if (newCompleted && !task.completed) {
            const newXP = userData.currentXP + task.xpReward;
            let newLevel = userData.level;
            let newMaxXP = userData.maxXP;
            let remainingXP = newXP;

            // Check for level up
            if (newXP >= userData.maxXP) {
              remainingXP = newXP - userData.maxXP;
              newLevel += 1;
              newMaxXP = userData.maxXP + 100; // Increase max XP for next level
            }

            setUserData({
              ...userData,
              level: newLevel,
              currentXP: remainingXP,
              maxXP: newMaxXP,
            });
          }

          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const openDeleteModal = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    // For demo purposes, we'll just focus on the task
    // In a real app, this would open an edit modal
    console.log('Edit task:', id);
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'deadline') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return sorted;
  }, [tasks, filter, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-app-background py-6">
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
        {/* Gamification HUD */}
        <GamificationHUD
          level={userData.level}
          title="Task Master"
          currentXP={userData.currentXP}
          maxXP={userData.maxXP}
          streak={userData.streak}
        />

        {/* Add Quest Section */}
        <div className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {/* Title input (full width) */}
            <div className="w-full sm:flex-1">
              <input
                type="text"
                placeholder="What is your next quest?"
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                }}
                className="w-full h-11 px-3 rounded-[12px] bg-surface-1 border border-border-stroke text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-accent transition-colors"
              />
              {error && <p className="text-[12px] text-overdue-warning mt-2">{error}</p>}
            </div>

            {/* Priority + Due date (2 columns on mobile, inline on sm+) */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="h-11 px-3 rounded-[12px] bg-surface-1 border border-border-stroke text-text-primary focus:outline-none focus:border-purple-accent transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="h-11 px-3 rounded-[12px] bg-surface-1 border border-border-stroke text-text-primary focus:outline-none focus:border-purple-accent transition-colors"
              />
            </div>

            {/* Add button (full width on mobile) */}
            <button
              onClick={addTask}
              className="h-11 w-full sm:w-auto sm:px-6 rounded-[12px] bg-purple-accent text-text-primary text-[14px] font-medium hover:bg-purple-accent/90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Quest
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Filter Pills (scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <FilterPill label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterPill label="Active" active={filter === 'active'} onClick={() => setFilter('active')} />
            <FilterPill
              label="Completed"
              active={filter === 'completed'}
              onClick={() => setFilter('completed')}
            />
          </div>

          {/* Sort & Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="h-11 w-full sm:w-auto pl-3 pr-8 rounded-[12px] bg-surface-1 border border-border-stroke text-text-secondary text-[14px] focus:outline-none focus:border-purple-accent transition-colors appearance-none cursor-pointer"
              >
                <option value="priority">Sort: Priority</option>
                <option value="deadline">Sort: Deadline</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full pl-10 pr-3 rounded-[12px] bg-surface-1 border border-border-stroke text-text-primary placeholder:text-text-muted text-[14px] focus:outline-none focus:border-purple-accent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="mt-4 space-y-3">
          {filteredAndSortedTasks.length === 0 ? (
            <EmptyState />
          ) : (
            filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={openDeleteModal}
              />
            ))
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        taskTitle={taskToDelete?.title || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
}

export default App;