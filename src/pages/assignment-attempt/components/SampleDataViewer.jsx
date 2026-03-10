import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const SampleDataViewer = ({ db }) => {
  const [activeTable, setActiveTable] = useState("users");
  const tableData = db?.[activeTable];

  return (
    <div className="p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Database" size={15} color="var(--color-primary)" />
        <span
          className="text-xs font-semibold uppercase tracking-wider font-caption"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Sample Data
        </span>
      </div>
      {/* Table selector */}
      <div
        className="flex gap-1 p-1 rounded-lg border mb-3"
        style={{ backgroundColor: "var(--color-muted)", borderColor: "var(--color-border)" }}
      >
        {Object.keys(db)?.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTable(t)}
            className="flex-1 py-1.5 rounded-md text-xs font-mono font-medium transition-standard"
            style={{
              backgroundColor: activeTable === t ? "var(--color-card)" : "transparent",
              color: activeTable === t ? "var(--color-primary)" : "var(--color-muted-foreground)",
              boxShadow: activeTable === t ? "0 1px 3px rgba(15,23,42,0.08)" : "none"
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Table preview */}
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-xs" style={{ minWidth: 320 }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-muted)" }}>
              {tableData?.schema?.map((col) => (
                <th
                  key={col?.column}
                  className="px-3 py-2 text-left font-mono font-semibold whitespace-nowrap"
                  style={{ color: "var(--color-text-secondary)", borderBottom: `1px solid var(--color-border)` }}
                >
                  {col?.column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.rows?.slice(0, 4)?.map((row, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--color-card)" : "var(--color-muted)",
                  borderBottom: `1px solid var(--color-border)`
                }}
              >
                {tableData?.schema?.map((col) => (
                  <td
                    key={col?.column}
                    className="px-3 py-2 font-mono whitespace-nowrap"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {String(row?.[col?.column] ?? "NULL")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {tableData?.rows?.length > 4 && (
          <div
            className="px-3 py-2 text-xs font-caption text-center border-t"
            style={{ borderColor: "var(--color-border)", color: "var(--color-muted-foreground)", backgroundColor: "var(--color-muted)" }}
          >
            Showing 4 of {tableData?.rows?.length} rows
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleDataViewer;