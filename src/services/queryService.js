import { supabase } from '../lib/supabase';
import { validateQuery } from '../utils/validateQuery';
import { compareResults } from './scoringService';
import { incrementStreak, breakStreak } from './streakService';

/**
 * Execute a validated SELECT query against Supabase sandbox tables.
 * Logs the attempt, scores the result, and updates streaks.
 *
 * @param {string} query - The SQL query string
 * @param {string|number} assignmentId - The assignment ID
 * @param {string} sessionId - The session ID for streak tracking
 * @returns {{ columns, rows, rowCount, isCorrect, score, matchType, streak } | { error: string }}
 */
export const executeQuery = async (query, assignmentId, sessionId) => {
  const timestamp = new Date()?.toISOString();

  // 1. Validate
  const validation = validateQuery(query);
  if (!validation?.valid) {
    await logAttempt({ query, assignmentId, success: false, error: validation?.error, rowCount: 0, timestamp, isCorrect: false, score: 0 });
    return { error: validation?.error };
  }

  try {
    // 2. Execute via Supabase RPC
    const { data, error } = await supabase?.rpc('execute_sandbox_query', {
      sql_query: query
    });

    if (error) {
      const errMsg = error?.message || 'Query execution failed';
      await logAttempt({ query, assignmentId, success: false, error: errMsg, rowCount: 0, timestamp, isCorrect: false, score: 0 });
      return { error: errMsg };
    }

    const rows = Array.isArray(data) ? data : [];
    const columns = rows?.length > 0 ? Object.keys(rows?.[0]) : [];
    const rowCount = rows?.length;

    // 3. Fetch expected_result for this assignment
    let scoringResult = { isCorrect: false, score: 0, matchType: 'none' };
    let streakData = { current: 0, longest: 0, totalCorrect: 0, totalAttempts: 0 };

    if (assignmentId) {
      try {
        const { data: assignmentData } = await supabase?.from('assignments')?.select('expected_result')?.eq('id', assignmentId)?.single();

        if (assignmentData?.expected_result) {
          scoringResult = compareResults(rows, columns, assignmentData?.expected_result);
        }
      } catch {
        // Scoring failure should not break the user experience
      }
    }

    // 4. Update streak
    if (sessionId) {
      try {
        if (scoringResult?.isCorrect) {
          streakData = await incrementStreak(sessionId);
        } else {
          streakData = await breakStreak(sessionId);
        }
      } catch {
        // Streak failure should not break the user experience
      }
    }

    // 5. Log attempt with scoring
    await logAttempt({
      query,
      assignmentId,
      success: true,
      error: null,
      rowCount,
      timestamp,
      isCorrect: scoringResult?.isCorrect,
      score: scoringResult?.score
    });

    return {
      columns,
      rows,
      rowCount,
      isCorrect: scoringResult?.isCorrect,
      score: scoringResult?.score,
      matchType: scoringResult?.matchType,
      streak: streakData
    };
  } catch (err) {
    const errMsg = err?.message || 'Unexpected error during query execution';
    await logAttempt({ query, assignmentId, success: false, error: errMsg, rowCount: 0, timestamp, isCorrect: false, score: 0 });
    return { error: errMsg };
  }
};

/**
 * Log a query attempt to the query_attempts table.
 */
const logAttempt = async ({ query, assignmentId, success, error, rowCount, timestamp, isCorrect, score }) => {
  try {
    await supabase?.from('query_attempts')?.insert({
      query,
      assignment_id: assignmentId ? String(assignmentId) : null,
      success,
      error_message: error || null,
      row_count: rowCount,
      attempted_at: timestamp,
      is_correct: isCorrect || false,
      score: score || 0
    });
  } catch (_) {
    // Logging failure should not break the user experience
  }
};

export default executeQuery;
