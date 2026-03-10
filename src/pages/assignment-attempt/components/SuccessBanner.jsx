import React from 'react';

const SuccessBanner = ({ isCorrect, score, matchType, onNext }) => {
  if (!isCorrect) return null;

  const matchLabel =
    matchType === 'exact' ?'Perfect Match'
      : matchType === 'unordered' ?'Correct (any order)' :'Correct';

  return (
    <div className="success-banner" role="alert" aria-live="polite">
      <div className="success-banner__icon-wrap">
        <span className="success-banner__icon" aria-hidden="true">✓</span>
      </div>
      <div className="success-banner__body">
        <h3 className="success-banner__heading">Correct! 🎉</h3>
        <div className="success-banner__meta">
          <span className="success-banner__score">Score: {score}/100</span>
          <span className="success-banner__match">{matchLabel}</span>
        </div>
      </div>
      <button
        className="success-banner__next-btn"
        onClick={onNext}
        type="button"
      >
        Next Assignment →
      </button>
    </div>
  );
};

export default SuccessBanner;
