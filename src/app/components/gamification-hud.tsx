import { Flame, User } from 'lucide-react';

interface GamificationHUDProps {
  level: number;
  title: string;
  currentXP: number;
  maxXP: number;
  streak: number;
}

export function GamificationHUD({ level, title, currentXP, maxXP, streak }: GamificationHUDProps) {
  const xpPercentage = (currentXP / maxXP) * 100;

  return (
    <div className="bg-surface-2 border border-border-stroke rounded-[16px] p-4 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between gap-6">
        {/* Left cluster - User info */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-surface-1 border border-border-stroke flex items-center justify-center">
            <User className="w-5 h-5 text-purple-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-text-primary">Level {level}</span>
            <span className="text-[12px] text-text-secondary">{title}</span>
          </div>
        </div>

        {/* Center cluster - XP Progress */}
        <div className="flex flex-col gap-1 flex-1 max-w-md">
          <span className="text-[12px] text-text-secondary">
            XP {currentXP} / {maxXP}
          </span>
          <div className="h-[10px] rounded-full bg-surface-1 overflow-hidden">
            <div
              className="h-full bg-purple-accent rounded-full transition-all duration-300"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* Right cluster - Streak */}
        <div className="flex items-center gap-2 bg-surface-1 border border-border-stroke rounded-full px-3 py-2">
          <Flame className="w-4 h-4 text-overdue-warning" />
          <span className="text-[12px] font-medium text-text-primary">{streak} Day Streak</span>
        </div>
      </div>
    </div>
  );
}
