import { supabase } from '../lib/supabase';

/**
 * Get or create a streak record for the given sessionId.
 */
export const getOrCreateStreak = async (sessionId) => {
  try {
    const { data, error } = await supabase?.from('user_streaks')?.upsert(
        { session_id: sessionId },
        { onConflict: 'session_id', ignoreDuplicates: true }
      )?.select()?.single();

    if (error) {
      // Try to fetch existing
      const { data: existing } = await supabase?.from('user_streaks')?.select('*')?.eq('session_id', sessionId)?.single();
      return existing || { current_streak: 0, longest_streak: 0, total_correct: 0, total_attempts: 0 };
    }
    return data;
  } catch {
    return { current_streak: 0, longest_streak: 0, total_correct: 0, total_attempts: 0 };
  }
};

/**
 * Increment streak on correct answer.
 */
export const incrementStreak = async (sessionId) => {
  try {
    // Get current streak
    const current = await getOrCreateStreak(sessionId);
    const newStreak = (current?.current_streak || 0) + 1;
    const newLongest = Math.max(newStreak, current?.longest_streak || 0);
    const newTotalCorrect = (current?.total_correct || 0) + 1;
    const newTotalAttempts = (current?.total_attempts || 0) + 1;

    const { data, error } = await supabase?.from('user_streaks')?.upsert(
        {
          session_id: sessionId,
          current_streak: newStreak,
          longest_streak: newLongest,
          total_correct: newTotalCorrect,
          total_attempts: newTotalAttempts,
          last_attempt_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        },
        { onConflict: 'session_id' }
      )?.select()?.single();

    if (error) throw error;
    return {
      current: data?.current_streak,
      longest: data?.longest_streak,
      totalCorrect: data?.total_correct,
      totalAttempts: data?.total_attempts
    };
  } catch {
    return { current: 0, longest: 0, totalCorrect: 0, totalAttempts: 0 };
  }
};

/**
 * Break streak on incorrect answer.
 */
export const breakStreak = async (sessionId) => {
  try {
    const current = await getOrCreateStreak(sessionId);
    const newTotalAttempts = (current?.total_attempts || 0) + 1;

    const { data, error } = await supabase?.from('user_streaks')?.upsert(
        {
          session_id: sessionId,
          current_streak: 0,
          longest_streak: current?.longest_streak || 0,
          total_correct: current?.total_correct || 0,
          total_attempts: newTotalAttempts,
          last_attempt_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        },
        { onConflict: 'session_id' }
      )?.select()?.single();

    if (error) throw error;
    return {
      current: data?.current_streak,
      longest: data?.longest_streak,
      totalCorrect: data?.total_correct,
      totalAttempts: data?.total_attempts
    };
  } catch {
    return { current: 0, longest: 0, totalCorrect: 0, totalAttempts: 0 };
  }
};

const streakService = {
  getOrCreateStreak,
  incrementStreak,
  breakStreak
};

export default streakService;