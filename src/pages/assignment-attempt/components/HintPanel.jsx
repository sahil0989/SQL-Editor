import React from "react";

const HintPanel = ({ hint, isLoading, error, onRequestHint }) => {
  return (
    <div className="hint-panel">
      <div className="hint-panel__header">
        <span className="hint-panel__icon">💡</span>
        <span className="hint-panel__title">Hint</span>
      </div>

      <div className="hint-panel__content">
        {isLoading ? (
          <div className="hint-panel__loading" aria-label="Loading hint">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : error ? (
          <p className="hint-panel__error">{error}</p>
        ) : hint ? (
          <p className="hint-panel__text">{hint}</p>
        ) : (
          <p className="hint-panel__placeholder">
            Stuck? Click &lsquo;Get Hint&rsquo; for a nudge in the right direction.
          </p>
        )}
      </div>

      <button
        className="hint-panel__button"
        onClick={onRequestHint}
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "Thinking..." : "Get Hint"}
      </button>
    </div>
  );
};

export default HintPanel;