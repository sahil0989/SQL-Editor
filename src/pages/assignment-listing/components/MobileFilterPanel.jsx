import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const TOPICS = ['All Topics', 'Joins', 'Aggregations', 'Subqueries', 'Filtering', 'Sorting', 'Window Functions', 'CTEs'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'difficulty_asc', label: 'Easiest First' },
  { value: 'difficulty_desc', label: 'Hardest First' },
  { value: 'popularity', label: 'Most Popular' },
];

const MobileFilterPanel = ({ open, onClose, difficulty, onDifficulty, topic, onTopic, sort, onSort, onReset }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      {/* Panel */}
      <div className="relative ml-auto w-full max-w-xs bg-[var(--color-card)] h-full flex flex-col shadow-elevation-5 animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-heading text-base font-semibold text-[var(--color-text-primary)]">Filters</h2>
          <button onClick={onClose} className="nav-icon-btn" aria-label="Close filters">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Difficulty */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2 font-caption">Difficulty</p>
            <div className="space-y-1">
              {DIFFICULTIES?.map(d => (
                <button
                  key={d}
                  onClick={() => onDifficulty(d)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-standard flex items-center justify-between ${difficulty === d ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-muted)]'}`}
                >
                  {d}
                  {difficulty === d && <Icon name="Check" size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2 font-caption">Topic</p>
            <div className="space-y-1">
              {TOPICS?.map(t => (
                <button
                  key={t}
                  onClick={() => onTopic(t)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-standard flex items-center justify-between ${topic === t ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-muted)]'}`}
                >
                  {t}
                  {topic === t && <Icon name="Check" size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2 font-caption">Sort By</p>
            <div className="space-y-1">
              {SORT_OPTIONS?.map(s => (
                <button
                  key={s?.value}
                  onClick={() => onSort(s?.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-standard flex items-center justify-between ${sort === s?.value ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-muted)]'}`}
                >
                  {s?.label}
                  {sort === s?.value && <Icon name="Check" size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-[var(--color-border)] flex gap-2">
          <Button variant="outline" size="sm" fullWidth onClick={onReset}>Reset</Button>
          <Button variant="default" size="sm" fullWidth onClick={onClose}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterPanel;