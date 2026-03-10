import React from "react";
import Icon from "../../../components/AppIcon";

const TABS = [
  { id: "question", label: "Question", icon: "FileText" },
  { id: "schema", label: "Schema", icon: "Table" },
  { id: "data", label: "Data", icon: "Database" },
  { id: "editor", label: "Editor", icon: "Code2" },
  { id: "results", label: "Results", icon: "BarChart2" }
];

const MobileTabBar = ({ activeTab, onTabChange }) => {
  return (
    <div
      className="flex overflow-x-auto border-b"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      {TABS?.map((tab) => {
        const active = activeTab === tab?.id;
        return (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className="flex flex-col items-center gap-1 px-4 py-2.5 flex-shrink-0 border-b-2 transition-standard"
            style={{
              borderBottomColor: active ? "var(--color-primary)" : "transparent",
              color: active ? "var(--color-primary)" : "var(--color-muted-foreground)"
            }}
            aria-selected={active}
          >
            <Icon name={tab?.icon} size={16} color={active ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
            <span className="text-xs font-caption whitespace-nowrap">{tab?.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileTabBar;