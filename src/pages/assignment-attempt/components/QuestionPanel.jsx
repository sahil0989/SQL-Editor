import React from "react";
import Icon from "../../../components/AppIcon";

const DIFF_CONFIG = {
  easy: { badge: "difficulty-badge difficulty-badge-easy", icon: "Zap" },
  medium: { badge: "difficulty-badge difficulty-badge-medium", icon: "Flame" },
  hard: { badge: "difficulty-badge difficulty-badge-hard", icon: "Skull" }
};

const QUESTION_DETAILS = {
  1: {
    objective: "Write a SELECT query to retrieve all users from the USA, sorted alphabetically by name.",
    requirements: [
      "Select all columns from the users table",
      "Filter results to show only users where country = 'USA'",
      "Sort the results by name in ascending order",
      "Your query should return exactly 2 rows"
    ],
    expectedOutput: "2 rows with id, name, email, country, created_at columns"
  },
  2: {
    objective: "Use aggregate functions to summarize order data grouped by status.",
    requirements: [
      "Count the total number of orders per status",
      "Calculate the total amount per status using SUM",
      "Group results by the status column",
      "Order results by total amount descending"
    ],
    expectedOutput: "3 rows showing status, count, and total_amount"
  },
  3: {
    objective: "Join the users and orders tables to find all orders with customer names.",
    requirements: [
      "Use INNER JOIN to combine users and orders tables",
      "Select user name, product, amount, and order_date",
      "Match on users.id = orders.user_id",
      "Order by order_date descending"
    ],
    expectedOutput: "7 rows with user names alongside their orders"
  },
  default: {
    objective: "Write a SQL query that satisfies the assignment requirements using the available tables.",
    requirements: [
      "Use only SELECT statements",
      "Reference the correct table and column names from the schema",
      "Apply appropriate filtering and sorting",
      "Ensure your query returns meaningful results"
    ],
    expectedOutput: "Results matching the assignment criteria"
  }
};

const QuestionPanel = ({ assignment }) => {
  const diff = DIFF_CONFIG?.[assignment?.difficulty] || DIFF_CONFIG?.medium;
  const details = QUESTION_DETAILS?.[assignment?.id] || QUESTION_DETAILS?.default;

  return (
    <div className="p-4 md:p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
          style={{ width: 36, height: 36, backgroundColor: "var(--color-muted)" }}
        >
          <Icon name="FileQuestion" size={18} color="var(--color-primary)" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={diff?.badge}>{assignment?.difficulty}</span>
            <span
              className="text-xs font-caption"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {assignment?.estimatedTime}
            </span>
          </div>
          <h2
            className="text-base md:text-lg font-heading font-semibold leading-snug"
            style={{ color: "var(--color-text-primary)" }}
          >
            {assignment?.title}
          </h2>
        </div>
      </div>
      {/* Objective */}
      <div
        className="rounded-lg p-3 mb-4 border-l-4"
        style={{
          backgroundColor: "rgba(79,70,229,0.06)",
          borderLeftColor: "var(--color-primary)"
        }}
      >
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-primary)" }}>
          Objective
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
          {details?.objective}
        </p>
      </div>
      {/* Requirements */}
      <div className="mb-4">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-2 font-caption"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Requirements
        </p>
        <ul className="space-y-2">
          {details?.requirements?.map((req, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold mt-0.5"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  fontSize: 10
                }}
              >
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {req}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Expected output */}
      <div
        className="rounded-lg p-3 flex items-start gap-2"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <Icon name="CheckCircle" size={15} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold mb-0.5 font-caption" style={{ color: "var(--color-muted-foreground)" }}>
            Expected Output
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>
            {details?.expectedOutput}
          </p>
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {assignment?.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md text-xs font-mono font-medium"
            style={{ backgroundColor: "var(--color-muted)", color: "var(--color-primary)" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestionPanel;