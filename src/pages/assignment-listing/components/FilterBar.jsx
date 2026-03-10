import Icon from "../../../components/AppIcon";

const DIFFICULTIES = [
  { value: "all", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

const FilterBar = ({ filter, setFilter, search, setSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={16} color="var(--color-muted-foreground)" />
        </span>
        <input
          type="text"
          placeholder="Search assignments, tags..."
          value={search}
          onChange={(e) => setSearch(e?.target?.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-standard font-body"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)"
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <Icon name="X" size={14} color="var(--color-muted-foreground)" />
          </button>
        )}
      </div>
      {/* Difficulty filter */}
      <div
        className="flex items-center gap-1 p-1 rounded-lg border"
        style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        {DIFFICULTIES?.map((d) => (
          <button
            key={d?.value}
            onClick={() => setFilter(d?.value)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-standard whitespace-nowrap font-caption"
            style={{
              backgroundColor: filter === d?.value ? "var(--color-primary)" : "transparent",
              color: filter === d?.value ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)"
            }}
          >
            {d?.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;