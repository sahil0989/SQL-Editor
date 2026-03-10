import React from "react";
import Icon from "../../../components/AppIcon";

const ResultsPanel = ({ result, isExecuting }) => {
  if (isExecuting) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 gap-3 border-t"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-caption" style={{ color: "var(--color-muted-foreground)" }}>
          Executing query...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 gap-3 border-t"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
      >
        <Icon name="PlayCircle" size={36} color="var(--color-muted-foreground)" />
        <p className="text-sm font-caption" style={{ color: "var(--color-muted-foreground)" }}>
          Run your query to see results here
        </p>
        <p className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
          Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--color-muted)" }}>Ctrl+Enter</kbd> to execute
        </p>
      </div>
    );
  }

  if (result?.error) {
    return (
      <div
        className="border-t p-4 md:p-5"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
      >
        <div
          className="rounded-lg p-4 border-l-4 flex items-start gap-3"
          style={{
            backgroundColor: "rgba(239,68,68,0.06)",
            borderLeftColor: "var(--color-destructive)"
          }}
        >
          <Icon name="AlertCircle" size={18} color="var(--color-destructive)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-destructive)" }}>
              Query Error
            </p>
            <p className="text-sm font-mono leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
              {result?.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-t flex flex-col"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
    >
      {/* Results header */}
      <div
        className="flex items-center justify-between px-4 md:px-5 py-2.5 border-b flex-shrink-0"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-muted)" }}
      >
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle" size={14} color="var(--color-success)" />
          <span className="text-xs font-semibold font-caption" style={{ color: "var(--color-success)" }}>
            Query Successful
          </span>
        </div>
        <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
          {result?.rowCount} row{result?.rowCount !== 1 ? "s" : ""} returned
        </span>
      </div>
      {result?.message ? (
        <div className="p-4 text-sm font-caption" style={{ color: "var(--color-muted-foreground)" }}>
          {result?.message}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 400 }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-muted)" }}>
                {result?.columns?.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2.5 text-left font-mono font-semibold whitespace-nowrap border-b"
                    style={{ color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result?.rows?.map((row, i) => (
                <tr
                  key={i}
                  className="transition-standard"
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--color-card)" : "var(--color-muted)",
                    borderBottom: `1px solid var(--color-border)`
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(79,70,229,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "var(--color-card)" : "var(--color-muted)")}
                >
                  {result?.columns?.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2.5 font-mono whitespace-nowrap"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {row?.[col] === null || row?.[col] === undefined ? (
                        <span style={{ color: "var(--color-muted-foreground)", fontStyle: "italic" }}>NULL</span>
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

export default ResultsPanel;