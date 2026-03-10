import React from 'react';

const StreakWidget = ({ current = 0, longest = 0, totalCorrect = 0, totalAttempts = 0 }) => {
  const isHot = current >= 3;

  return (
    <div className="streak-widget" title={`Longest streak: ${longest}`}>
      <div className="streak-widget__streak">
        <span
          className={`streak-widget__flame${isHot ? ' streak-widget__flame--hot' : ''}`}
          aria-hidden="true"
        >
          🔥
        </span>
        <span className="streak-widget__streak-value">{current}</span>
        <span className="streak-widget__streak-label">streak</span>
      </div>
      <div className="streak-widget__divider" aria-hidden="true" />
      <div className="streak-widget__score">
        <span className="streak-widget__check" aria-hidden="true">✓</span>
        <span className="streak-widget__score-value">
          {totalCorrect}/{totalAttempts}
        </span>
        <span className="streak-widget__score-label">correct</span>
      </div>
    </div>
  );
};

export default StreakWidget;
