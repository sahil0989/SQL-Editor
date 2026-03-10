import React, { useState, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationHeader from "../../components/ui/NavigationHeader";
import QuestionPanel from "./components/QuestionPanel";
import SchemaViewer from "./components/SchemaViewer";
import SampleDataViewer from "./components/SampleDataViewer";
import SqlEditor from "./components/SqlEditor";
import ResultsPanel from "./components/ResultsPanel";
import ResultsTable from "./components/ResultsTable";
import HintPanel from "./components/HintPanel";
import MobileTabBar from "./components/MobileTabBar";
import SuccessBanner from "./components/SuccessBanner";
import StreakWidget from "./components/StreakWidget";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { executeQuery as executeQueryService } from "../../services/queryService";
import { handleHintRequest } from "../../services/hintController";

/* ─── Mock DB ─────────────────────────────────────────────────────────────── */
const MOCK_DB = {
  users: {
    schema: [
      { column: "id", type: "INTEGER", nullable: false, pk: true },
      { column: "name", type: "VARCHAR(100)", nullable: false, pk: false },
      { column: "email", type: "VARCHAR(150)", nullable: false, pk: false },
      { column: "city", type: "VARCHAR(50)", nullable: true, pk: false },
      { column: "created_at", type: "TIMESTAMP", nullable: false, pk: false }
    ],
    rows: [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", city: "USA", created_at: "2024-01-15 09:23:00" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", city: "UK", created_at: "2024-02-03 14:10:00" },
      { id: 3, name: "Carol White", email: "carol@example.com", city: "Canada", created_at: "2024-02-20 11:45:00" },
      { id: 4, name: "David Lee", email: "david@example.com", city: "USA", created_at: "2024-03-05 08:30:00" },
      { id: 5, name: "Eva Martinez", email: "eva@example.com", city: "Spain", created_at: "2024-03-18 16:55:00" }
    ]
  },
  orders: {
    schema: [
      { column: "id", type: "INTEGER", nullable: false, pk: true },
      { column: "user_id", type: "INTEGER", nullable: false, pk: false },
      { column: "product", type: "VARCHAR(100)", nullable: false, pk: false },
      { column: "amount", type: "DECIMAL(10,2)", nullable: false, pk: false },
      { column: "status", type: "VARCHAR(20)", nullable: false, pk: false },
      { column: "order_date", type: "DATE", nullable: false, pk: false }
    ],
    rows: [
      { id: 101, user_id: 1, product: "Laptop Pro", amount: 1299.99, status: "delivered", order_date: "2024-03-01" },
      { id: 102, user_id: 2, product: "Wireless Mouse", amount: 49.99, status: "delivered", order_date: "2024-03-05" },
      { id: 103, user_id: 1, product: "USB-C Hub", amount: 79.99, status: "shipped", order_date: "2024-03-10" },
      { id: 104, user_id: 3, product: "Mechanical Keyboard", amount: 189.99, status: "pending", order_date: "2024-03-12" },
      { id: 105, user_id: 4, product: "Monitor 4K", amount: 599.99, status: "delivered", order_date: "2024-03-15" },
      { id: 106, user_id: 5, product: "Webcam HD", amount: 89.99, status: "shipped", order_date: "2024-03-18" },
      { id: 107, user_id: 2, product: "Desk Lamp", amount: 34.99, status: "delivered", order_date: "2024-03-20" }
    ]
  }
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AssignmentAttempt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const assignment = location?.state?.assignment || {
    id: 1,
    title: "Basic SELECT Queries",
    difficulty: "easy",
    description: "Retrieve data from the users table.",
    tags: ["SELECT", "WHERE", "ORDER BY"],
    estimatedTime: "15 min",
    category: "Fundamentals"
  };

  const [sql, setSql] = useState("SELECT * FROM users\nWHERE city = 'NYC'\nORDER BY name ASC;");
  const [result, setResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [mobileTab, setMobileTab] = useState("question");

  // Supabase query execution state
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);

  // LLM hint state
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState("");

  // Scoring & streak state
  const [successData, setSuccessData] = useState(null);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0, totalCorrect: 0, totalAttempts: 0 });

  // Session ID (persisted in localStorage)
  const sessionIdRef = useRef(null);
  useEffect(() => {
    let sid = localStorage.getItem("sql_sandbox_session_id");
    if (!sid) {
      sid = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random()?.toString(36)?.slice(2) + Date.now()?.toString(36);
      localStorage.setItem("sql_sandbox_session_id", sid);
    }
    sessionIdRef.current = sid;
  }, []);

  const handleExecute = useCallback(async () => {
    if (!sql?.trim()) return;

    setIsQueryExecuting(true);
    setQueryResult(null);
    setQueryError(null);
    setSuccessData(null);
    setIsExecuting(true);
    setResult(null);

    try {
      const res = await executeQueryService(sql, assignment?.id, sessionIdRef?.current);
      if (res?.error) {
        setQueryError(res?.error);
        setResult({ error: res?.error });
      } else {
        setQueryResult(res);
        setResult(res);
        // Extract scoring & streak
        if (res?.isCorrect !== undefined) {
          setSuccessData({
            isCorrect: res?.isCorrect,
            score: res?.score,
            matchType: res?.matchType
          });
        }
        if (res?.streak) {
          setStreakData(res?.streak);
        }
      }
    } catch (err) {
      const msg = err?.message || "Unexpected error";
      setQueryError(msg);
      setResult({ error: msg });
    } finally {
      setIsQueryExecuting(false);
      setIsExecuting(false);
    }
  }, [sql, assignment?.id]);

  const handleGetHint = useCallback(async () => {
    setHintLoading(true);
    setHintError("");
    try {
      const res = await handleHintRequest({
        assignmentId: assignment?.id,
        userQuery: sql
      });
      if (res?.error) {
        setHintError(res?.error);
        setHint("");
      } else {
        setHint(res?.hint || "");
        setHintError("");
      }
    } catch (err) {
      setHintError(err?.message || "Failed to get hint");
      setHint("");
    } finally {
      setHintLoading(false);
    }
  }, [assignment?.id, sql]);

  const handleSqlChange = useCallback((val) => {
    setSql(val);
    // Reset success banner when user modifies query
    if (successData) setSuccessData(null);
  }, [successData]);

  const handleNext = useCallback(() => {
    const nextId = (assignment?.id || 1) + 1;
    // Navigate to next assignment or back to listing if beyond 12
    if (nextId > 12) {
      navigate("/assignment-listing");
    } else {
      navigate("/assignment-attempt", {
        state: { assignment: { ...assignment, id: nextId } }
      });
    }
  }, [assignment, navigate]);

  const handleBack = () => navigate("/assignment-listing");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-background)" }}>
      <NavigationHeader currentAssignment={assignment} onNavigateBack={handleBack} />

      <main className="main-content-offset flex-1 flex flex-col">
        {/* Mobile tab bar */}
        <div className="lg:hidden">
          <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
        </div>

        {/* Desktop: two-column layout */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-screen-2xl mx-auto w-full">
          {/* ── Left Panel ── */}
          <div
            className={`
              lg:w-[420px] xl:w-[460px] flex-shrink-0 flex flex-col border-r overflow-y-auto
              ${mobileTab !== "question" && mobileTab !== "schema" && mobileTab !== "data" ? "hidden lg:flex" : "flex"}
            `}
            style={{
              borderColor: "var(--color-border)",
              maxHeight: "calc(100vh - 64px)",
              position: "sticky",
              top: 64
            }}
          >
            <div className={mobileTab === "question" || mobileTab === "schema" || mobileTab === "data" ? "lg:block" : "hidden lg:block"}>
              <div className={mobileTab === "question" || window.innerWidth >= 1024 ? "block" : "hidden lg:block"}>
                <QuestionPanel assignment={assignment} />
              </div>
              <div className={mobileTab === "schema" ? "block lg:block" : "hidden lg:block"}>
                <SchemaViewer db={MOCK_DB} />
              </div>
              <div className={mobileTab === "data" ? "block lg:block" : "hidden lg:block"}>
                <SampleDataViewer db={MOCK_DB} />
              </div>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div
            className={`
              flex-1 flex flex-col min-w-0
              ${mobileTab === "editor" || mobileTab === "results" ? "flex" : "hidden lg:flex"}
            `}
          >
            {/* Editor area */}
            <div
              className="flex-1 flex flex-col"
              style={{ minHeight: 0 }}
            >
              {/* Editor header with StreakWidget */}
              <div
                className="flex items-center justify-between px-4 md:px-5 py-3 border-b flex-shrink-0"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Code2" size={16} color="var(--color-primary)" />
                  <span className="text-sm font-heading font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    SQL Editor
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{ backgroundColor: "var(--color-muted)", color: "var(--color-muted-foreground)" }}
                  >
                    PostgreSQL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Streak Widget */}
                  <StreakWidget
                    current={streakData?.current}
                    longest={streakData?.longest}
                    totalCorrect={streakData?.totalCorrect}
                    totalAttempts={streakData?.totalAttempts}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={13}
                    onClick={() => setSql("SELECT * FROM users;")}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1" style={{ minHeight: 220 }}>
                <SqlEditor value={sql} onChange={handleSqlChange} onExecute={handleExecute} />
              </div>

              {/* Action bar */}
              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 md:px-5 py-3 border-t flex-shrink-0"
                style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              >
                <Button
                  variant="default"
                  size="default"
                  iconName="Play"
                  iconPosition="left"
                  iconSize={15}
                  loading={isExecuting}
                  onClick={handleExecute}
                  className="sm:w-auto"
                >
                  {isExecuting ? "Executing..." : "Execute Query"}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  iconName="Lightbulb"
                  iconPosition="left"
                  iconSize={15}
                  loading={hintLoading}
                  onClick={handleGetHint}
                  className="sm:w-auto"
                >
                  {hintLoading ? "Thinking..." : "Get Hint"}
                </Button>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Icon name="ShieldCheck" size={14} color="var(--color-success)" />
                  <span className="text-xs font-caption" style={{ color: "var(--color-muted-foreground)" }}>
                    SELECT-only &bull; Secure sandbox
                  </span>
                </div>
              </div>
            </div>

            {/* Hint panel — LLM powered */}
            <HintPanel
              hint={hint}
              isLoading={hintLoading}
              error={hintError}
              onRequestHint={handleGetHint}
            />

            {/* Success Banner — shown when query is correct */}
            <SuccessBanner
              isCorrect={successData?.isCorrect}
              score={successData?.score}
              matchType={successData?.matchType}
              onNext={handleNext}
            />

            {/* Results panel (legacy mock) */}
            <div
              className={mobileTab === "results" || window.innerWidth >= 1024 ? "block" : "hidden lg:block"}
              style={{ minHeight: 200, maxHeight: 340, overflowY: "auto" }}
            >
              <ResultsPanel result={result} isExecuting={isExecuting} />
            </div>

            {/* ResultsTable — Supabase live results */}
            <div
              className={mobileTab === "results" || window.innerWidth >= 1024 ? "block" : "hidden lg:block"}
            >
              <ResultsTable
                columns={queryResult?.columns}
                rows={queryResult?.rows}
                error={queryError}
                isLoading={isQueryExecuting}
                score={successData?.score}
                isCorrect={successData?.isCorrect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignmentAttempt;