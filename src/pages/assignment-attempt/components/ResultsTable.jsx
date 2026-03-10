import React from 'react';

const ResultsTable = ({ columns, rows, error, isLoading, score, isCorrect }) => {
  if (isLoading) {
    return (
      <div className="results-table results-table--loading">
        <div className="results-table__spinner" aria-label="Loading" />
        <p className="results-table__loading-text">Executing query...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-table">
        <div className="results-table__error" role="alert">
          <span className="results-table__error-icon" aria-hidden="true">⚠</span>
          <span className="results-table__error-message">{error}</span>
        </div>
      </div>
    );
  }

  if (!columns || columns?.length === 0) {
    return null;
  }

  // Determine score indicator state
  const showPartial = !isCorrect && score > 0;
  const showNone = !isCorrect && score === 0 && columns?.length > 0;

  return (
    <div className="results-table">
      {/* Score Indicator */}
      {showPartial && (
        <div className="score-indicator score-indicator--partial" role="status">
          <span className="score-indicator__icon" aria-hidden="true">⚡</span>
          Partial match — {score}% overlap
        </div>
      )}
      {showNone && (
        <div className="score-indicator score-indicator--none" role="status">
          <span className="score-indicator__icon" aria-hidden="true">✗</span>
          No matching results
        </div>
      )}

      {/* Row count summary */}
      <p className="results-table__count">
        {rows?.length ?? 0} row{(rows?.length ?? 0) !== 1 ? 's' : ''} returned
      </p>
      {rows?.length === 0 ? (
        <div className="results-table__empty">
          Query executed successfully. No rows returned.
        </div>
      ) : (
        <div className="results-table__scroll-wrapper">
          <table className="results-table__table">
            <thead>
              <tr>
                {columns?.map((col) => (
                  <th key={col} className="results-table__header">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`results-table__row${
                    rowIdx % 2 === 0 ? '' : ' results-table__row--odd'
                  }`}
                >
                  {columns?.map((col) => (
                    <td key={col} className="results-table__cell">
                      {row?.[col] === null || row?.[col] === undefined ? (
                        <span className="results-table__null">NULL</span>
                      ) : (
                        String(row?.[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
