import Icon from "../../../components/AppIcon";

const StatsBar = ({ assignments }) => {
  const total = assignments?.length;
  const easy = assignments?.filter((a) => a?.difficulty === "easy")?.length;
  const medium = assignments?.filter((a) => a?.difficulty === "medium")?.length;
  const hard = assignments?.filter((a) => a?.difficulty === "hard")?.length;

  const stats = [
    { label: "Total Assignments", value: total, icon: "BookOpen", color: "var(--color-primary)" },
    { label: "Easy", value: easy, icon: "Zap", color: "#059669" },
    { label: "Medium", value: medium, icon: "Flame", color: "#D97706" },
    { label: "Hard", value: hard, icon: "Skull", color: "#DC2626" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">
      {stats?.map((s) => (
        <div
          key={s?.label}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 36, height: 36, backgroundColor: "var(--color-muted)" }}
          >
            <Icon name={s?.icon} size={16} color={s?.color} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-heading font-bold leading-none" style={{ color: "var(--color-text-primary)" }}>
              {s?.value}
            </p>
            <p className="text-xs font-caption mt-0.5 truncate" style={{ color: "var(--color-muted-foreground)" }}>
              {s?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;