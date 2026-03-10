import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const DIFFICULTY_STYLES = {
  easy: {
    badge: "difficulty-badge difficulty-badge-easy",
    icon: "Zap",
    iconColor: "#059669",
    border: "rgba(16,185,129,0.2)",
    glow: "rgba(16,185,129,0.06)"
  },
  medium: {
    badge: "difficulty-badge difficulty-badge-medium",
    icon: "Flame",
    iconColor: "#D97706",
    border: "rgba(245,158,11,0.2)",
    glow: "rgba(245,158,11,0.06)"
  },
  hard: {
    badge: "difficulty-badge difficulty-badge-hard",
    icon: "Skull",
    iconColor: "#DC2626",
    border: "rgba(239,68,68,0.2)",
    glow: "rgba(239,68,68,0.06)"
  }
};

const AssignmentCard = ({ assignment, onStart }) => {
  const diff = DIFFICULTY_STYLES?.[assignment?.difficulty] || DIFFICULTY_STYLES?.medium;

  return (
    <div
      className="rounded-xl border flex flex-col transition-standard hover-lift cursor-pointer group"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: diff?.border,
        boxShadow: `0 0 0 1px ${diff?.border}`
      }}
      onClick={() => onStart(assignment)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e?.key === "Enter" || e?.key === " ") && onStart(assignment)}
      aria-label={`Start assignment: ${assignment?.title}`}
    >
      {/* Card header */}
      <div
        className="px-5 pt-5 pb-4 rounded-t-xl"
        style={{ backgroundColor: diff?.glow }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: 38,
              height: 38,
              backgroundColor: "var(--color-card)",
              border: `1px solid ${diff?.border}`
            }}
          >
            <Icon name={diff?.icon} size={18} color={diff?.iconColor} />
          </div>
          <span className={diff?.badge}>{assignment?.difficulty}</span>
        </div>
        <h3
          className="text-base md:text-lg font-heading font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {assignment?.title}
        </h3>
      </div>
      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-4">
        <p
          className="text-sm line-clamp-3 leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {assignment?.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {assignment?.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs font-mono font-medium"
              style={{
                backgroundColor: "var(--color-muted)",
                color: "var(--color-primary)"
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-auto pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-1.5">
            <Icon name="Clock" size={13} color="var(--color-muted-foreground)" />
            <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
              {assignment?.estimatedTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Users" size={13} color="var(--color-muted-foreground)" />
            <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
              {assignment?.completions?.toLocaleString()} completed
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Icon name="Tag" size={13} color="var(--color-muted-foreground)" />
            <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
              {assignment?.category}
            </span>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="px-5 pb-5">
        <Button
          variant="default"
          fullWidth
          iconName="Play"
          iconPosition="left"
          iconSize={15}
          onClick={(e) => { e?.stopPropagation(); onStart(assignment); }}
        >
          Start Assignment
        </Button>
      </div>
    </div>
  );
};

export default AssignmentCard;