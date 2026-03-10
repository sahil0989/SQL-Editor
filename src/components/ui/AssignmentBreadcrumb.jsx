import React from 'react';
import Icon from '../AppIcon';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', className: 'difficulty-badge difficulty-badge-easy' },
  medium: { label: 'Medium', className: 'difficulty-badge difficulty-badge-medium' },
  hard: { label: 'Hard', className: 'difficulty-badge difficulty-badge-hard' },
};

const AssignmentBreadcrumb = ({ assignment = null, onBack }) => {
  if (!assignment) return null;

  const difficulty = (assignment?.difficulty || 'medium')?.toLowerCase();
  const diffConfig = DIFFICULTY_CONFIG?.[difficulty] || DIFFICULTY_CONFIG?.medium;

  const handleBack = (e) => {
    e?.preventDefault();
    if (onBack) onBack();
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' || e?.key === ' ') {
      e?.preventDefault();
      if (onBack) onBack();
    }
  };

  return (
    <nav
      className="assignment-breadcrumb"
      aria-label="Assignment navigation breadcrumb"
    >
      {/* Back link */}
      <button
        className="breadcrumb-back-btn"
        onClick={handleBack}
        onKeyDown={handleKeyDown}
        aria-label="Back to assignments list"
        title="Back to Assignments"
      >
        <Icon name="ArrowLeft" size={14} />
        <span className="hidden sm:inline font-caption">Assignments</span>
      </button>
      {/* Separator */}
      <span className="breadcrumb-separator" aria-hidden="true">
        <Icon name="ChevronRight" size={14} color="var(--color-muted-foreground)" />
      </span>
      {/* Current assignment context */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="breadcrumb-assignment-title"
          title={assignment?.title}
          aria-current="page"
        >
          {assignment?.title}
        </span>

        {/* Difficulty badge */}
        <span className={diffConfig?.className} aria-label={`Difficulty: ${diffConfig?.label}`}>
          {diffConfig?.label}
        </span>
      </div>
    </nav>
  );
};

export default AssignmentBreadcrumb;