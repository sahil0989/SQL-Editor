import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const TYPE_COLOR = {
  INTEGER: "#6366F1",
  "VARCHAR(100)": "#0EA5E9",
  "VARCHAR(150)": "#0EA5E9",
  "VARCHAR(50)": "#0EA5E9",
  "VARCHAR(20)": "#0EA5E9",
  TIMESTAMP: "#8B5CF6",
  DATE: "#8B5CF6",
  "DECIMAL(10,2)": "#F59E0B"
};

const SchemaViewer = ({ db }) => {
  const [expanded, setExpanded] = useState({ users: true, orders: true });

  const toggle = (table) => setExpanded((e) => ({ ...e, [table]: !e?.[table] }));

  return (
    <div className="p-4 md:p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Table" size={15} color="var(--color-primary)" />
        <span
          className="text-xs font-semibold uppercase tracking-wider font-caption"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Table Schema
        </span>
      </div>
      <div className="space-y-3">
        {Object.entries(db)?.map(([tableName, tableData]) => (
          <div
            key={tableName}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--color-border)" }}
          >
            {/* Table header */}
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 transition-standard"
              style={{ backgroundColor: "var(--color-muted)" }}
              onClick={() => toggle(tableName)}
              aria-expanded={expanded?.[tableName]}
            >
              <div className="flex items-center gap-2">
                <Icon name="Table2" size={14} color="var(--color-primary)" />
                <span className="text-sm font-mono font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {tableName}
                </span>
                <span
                  className="text-xs font-caption px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "var(--color-card)", color: "var(--color-muted-foreground)" }}
                >
                  {tableData?.schema?.length} cols
                </span>
              </div>
              <Icon
                name={expanded?.[tableName] ? "ChevronUp" : "ChevronDown"}
                size={14}
                color="var(--color-muted-foreground)"
              />
            </button>

            {/* Columns */}
            {expanded?.[tableName] && (
              <div style={{ backgroundColor: "var(--color-card)" }}>
                {tableData?.schema?.map((col, i) => (
                  <div
                    key={col?.column}
                    className="flex items-center gap-2 px-3 py-2 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {col?.pk ? (
                      <Icon name="Key" size={12} color="#F59E0B" />
                    ) : (
                      <Icon name="Minus" size={12} color="var(--color-muted-foreground)" />
                    )}
                    <span className="text-xs font-mono flex-1" style={{ color: "var(--color-text-primary)" }}>
                      {col?.column}
                    </span>
                    <span
                      className="text-xs font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(99,102,241,0.08)",
                        color: TYPE_COLOR?.[col?.type] || "var(--color-primary)"
                      }}
                    >
                      {col?.type}
                    </span>
                    {!col?.nullable && (
                      <span
                        className="text-xs font-caption"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        NOT NULL
                      </span>
                    )}
                  </div>
                ))}
                {/* Relationship indicator */}
                {tableName === "orders" && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 border-t"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(79,70,229,0.04)" }}
                  >
                    <Icon name="Link" size={12} color="var(--color-primary)" />
                    <span className="text-xs font-caption" style={{ color: "var(--color-primary)" }}>
                      user_id &rarr; users.id (FK)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer;