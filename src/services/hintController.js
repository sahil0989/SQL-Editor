import { supabase } from "../lib/supabase";
import { getHint } from "./llmService";

/**
 * Handle a hint request.
 * Fetches the assignment question from Supabase, calls the LLM service,
 * logs the result, and returns { hint } or { error }.
 *
 * @param {Object} params
 * @param {string|number} params.assignmentId
 * @param {string} params.userQuery
 * @returns {Promise<{ hint?: string, error?: string, status?: number }>}
 */
export const handleHintRequest = async ({ assignmentId, userQuery }) => {
  if (!assignmentId) {
    return { error: "assignmentId is required", status: 400 };
  }

  try {
    // 1. Fetch assignment question from Supabase
    const { data: assignment, error: fetchError } = await supabase?.from("assignments")?.select("id, title, description")?.eq("id", assignmentId)?.single();

    if (fetchError || !assignment) {
      return {
        error: `Assignment not found for id: ${assignmentId}`,
        status: 404
      };
    }

    const assignmentQuestion = assignment?.description || assignment?.title || "";

    // 2. Call LLM service
    const hint = await getHint({ assignmentQuestion, userQuery: userQuery || "" });

    // 3. Log to hint_logs table
    try {
      await supabase?.from("hint_logs")?.insert({
        assignment_id: Number(assignmentId),
        user_query: userQuery || "",
        hint,
        created_at: new Date()?.toISOString()
      });
    } catch (_logErr) {
      // Logging failure should not break the user experience
    }

    return { hint };
  } catch (err) {
    return {
      error: err?.message || "Failed to generate hint",
      status: 500
    };
  }
};

export default handleHintRequest;
