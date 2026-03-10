const BLOCKED_KEYWORDS = [
  "drop", "delete", "update", "insert", "alter", "truncate",
  "create", "grant", "revoke", "exec", "execute"
];

/**
 * Validates that a SQL query is SELECT-only.
 * Returns { valid: true } or { valid: false, error: '...' }
 */
export const validateQuery = (sql) => {
  if (!sql || typeof sql !== "string") {
    return { valid: false, error: "Only SELECT queries are allowed" };
  }

  // Strip single-line comments (-- ...) and multi-line comments (/* ... */)
  const stripped = sql?.replace(/--[^\n]*/g, "")?.replace(/\/\*[\s\S]*?\*\//g, "")?.trim();

  const lower = stripped?.toLowerCase();

  // Must start with SELECT
  if (!lower?.startsWith("select")) {
    return { valid: false, error: "Only SELECT queries are allowed" };
  }

  // Check for blocked keywords as whole words
  for (const kw of BLOCKED_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, "i");
    if (regex?.test(lower)) {
      return { valid: false, error: "Only SELECT queries are allowed" };
    }
  }

  return { valid: true };
};

export default validateQuery;
