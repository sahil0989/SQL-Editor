import { getChatCompletion } from "./aiIntegrations/chatCompletion";

const FALLBACK_HINT =
  "Think about which SQL clause would help you filter or retrieve the data you need. Start simple — try a basic SELECT first, then build from there.";

/**
 * Generate a SQL hint using OpenAI without revealing the full answer.
 *
 * @param {Object} params
 * @param {string} params.assignmentQuestion - The assignment question text
 * @param {string} params.userQuery - The current SQL query the user has written
 * @returns {Promise<string>} The hint string
 */
export const getHint = async ({ assignmentQuestion, userQuery }) => {
  const prompt = `You are a SQL tutor helping a student.
Rules:
- Do NOT give the final SQL query under any circumstances
- Only provide hints — suggest SQL concepts, clauses, or strategies
- Keep hints short (2-4 sentences max)
- Be encouraging and Socratic in tone
- If the user query is empty or blank, give a gentle nudge toward the right starting concept

Question: ${assignmentQuestion}
User Query: ${userQuery || "(empty)"}

Provide a short hint that helps the student think in the right direction without revealing the solution.`;

  try {
    const response = await getChatCompletion(
      "OPEN_AI",
      "gpt-4o-mini",
      [
        {
          role: "user",
          content: prompt
        }
      ],
      {
        max_tokens: 200,
        temperature: 0.7
      }
    );

    // getChatCompletion returns the full SDK response object
    const hint =
      response?.choices?.[0]?.message?.content?.trim() ||
      FALLBACK_HINT;

    return hint;
  } catch (err) {
    console.warn("LLM hint generation failed, using fallback:", err?.message);
    return FALLBACK_HINT;
  }
};

export default getHint;
