import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "../../components/ui/NavigationHeader";
import AssignmentCard from "./components/AssignmentCard";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import Icon from "../../components/AppIcon";

const ASSIGNMENTS = [
  {
    id: 1,
    title: "Basic SELECT Queries",
    difficulty: "easy",
    description: "Learn the fundamentals of SELECT statements by retrieving data from a users table. Practice filtering rows with WHERE clauses and sorting results.",
    tags: ["SELECT", "WHERE", "ORDER BY"],
    estimatedTime: "15 min",
    completions: 1240,
    category: "Fundamentals"
  },
  {
    id: 2,
    title: "Aggregate Functions",
    difficulty: "easy",
    description: "Use COUNT, SUM, AVG, MIN, and MAX to summarize data from an orders table. Understand how to group results with GROUP BY.",
    tags: ["COUNT", "SUM", "GROUP BY"],
    estimatedTime: "20 min",
    completions: 980,
    category: "Fundamentals"
  },
  {
    id: 3,
    title: "JOIN Operations",
    difficulty: "medium",
    description: "Master INNER JOIN, LEFT JOIN, and RIGHT JOIN by combining data from users and orders tables. Understand relationship navigation.",
    tags: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN"],
    estimatedTime: "30 min",
    completions: 756,
    category: "Joins"
  },
  {
    id: 4,
    title: "Subqueries & Nested SELECT",
    difficulty: "medium",
    description: "Write subqueries to filter data based on results from another query. Practice correlated subqueries and EXISTS clauses.",
    tags: ["Subquery", "EXISTS", "IN"],
    estimatedTime: "35 min",
    completions: 512,
    category: "Advanced"
  },
  {
    id: 5,
    title: "Window Functions",
    difficulty: "hard",
    description: "Explore RANK, ROW_NUMBER, LEAD, and LAG window functions to perform calculations across related rows without collapsing them.",
    tags: ["RANK", "ROW_NUMBER", "OVER"],
    estimatedTime: "45 min",
    completions: 289,
    category: "Advanced"
  },
  {
    id: 6,
    title: "CTEs & Recursive Queries",
    difficulty: "hard",
    description: "Use Common Table Expressions (WITH clause) to simplify complex queries and write recursive CTEs for hierarchical data traversal.",
    tags: ["WITH", "CTE", "RECURSIVE"],
    estimatedTime: "50 min",
    completions: 178,
    category: "Advanced"
  },
  {
    id: 7,
    title: "String Functions & Pattern Matching",
    difficulty: "easy",
    description: "Apply LIKE, ILIKE, CONCAT, UPPER, LOWER, and TRIM to manipulate and search string data in a products table.",
    tags: ["LIKE", "CONCAT", "TRIM"],
    estimatedTime: "20 min",
    completions: 890,
    category: "Fundamentals"
  },
  {
    id: 8,
    title: "Date & Time Operations",
    difficulty: "medium",
    description: "Work with DATE_PART, EXTRACT, AGE, and date arithmetic to analyze time-based data in an events and orders dataset.",
    tags: ["DATE_PART", "EXTRACT", "AGE"],
    estimatedTime: "30 min",
    completions: 634,
    category: "Intermediate"
  }
];

const AssignmentListing = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ASSIGNMENTS?.filter((a) => {
    const matchesDiff = filter === "all" || a?.difficulty === filter;
    const matchesSearch =
      a?.title?.toLowerCase()?.includes(search?.toLowerCase()) ||
      a?.description?.toLowerCase()?.includes(search?.toLowerCase()) ||
      a?.tags?.some((t) => t?.toLowerCase()?.includes(search?.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

  const handleStart = (assignment) => {
    navigate("/assignment-attempt", { state: { assignment } });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <NavigationHeader />
      <main className="main-content-offset">
        {/* Hero */}
        <div
          className="border-b"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
        >
          <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 44, height: 44, backgroundColor: "rgba(79,70,229,0.12)" }}
              >
                <Icon name="Database" size={22} color="var(--color-primary)" />
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-widest font-caption"
                style={{ color: "var(--color-primary)" }}
              >
                SQL Practice Lab
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              SQL Assignments
            </h1>
            <p
              className="text-sm md:text-base max-w-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Practice real SQL queries against live schemas. Select an assignment to start writing
              queries with instant feedback and AI-powered hints.
            </p>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <StatsBar assignments={ASSIGNMENTS} />
          <FilterBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />

          {filtered?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Icon name="SearchX" size={48} color="var(--color-muted-foreground)" />
              <p className="text-base font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                No assignments match your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered?.map((assignment) => (
                <AssignmentCard
                  key={assignment?.id}
                  assignment={assignment}
                  onStart={handleStart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer
        className="border-t mt-12"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
            &copy; {new Date()?.getFullYear()} SQLab. All rights reserved.
          </span>
          <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
            SELECT-only queries &bull; Secure sandbox environment
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AssignmentListing;