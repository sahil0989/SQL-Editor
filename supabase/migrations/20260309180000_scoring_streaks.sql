-- 1. Add expected_result column to assignments
ALTER TABLE public.assignments
  ADD COLUMN IF NOT EXISTS expected_result JSONB;

-- 2. Create user_streaks table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  total_attempts INT DEFAULT 0,
  last_attempt_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add is_correct and score columns to query_attempts
ALTER TABLE public.query_attempts
  ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT false;
ALTER TABLE public.query_attempts
  ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_user_streaks_session_id ON public.user_streaks(session_id);
CREATE INDEX IF NOT EXISTS idx_query_attempts_is_correct ON public.query_attempts(is_correct);

-- 5. RLS for user_streaks
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sandbox_open_user_streaks" ON public.user_streaks;
CREATE POLICY "sandbox_open_user_streaks" ON public.user_streaks
  FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. Update assignments with expected_result values
DO $$
BEGIN
  -- Assignment 1: Select All Users
  UPDATE public.assignments
  SET expected_result = '{"columns":["id","name","age","city"],"rows":[[1,"Alice",28,"NYC"],[2,"Bob",34,"LA"],[3,"Carol",22,"Chicago"],[4,"David",45,"NYC"],[5,"Eva",31,"Houston"],[6,"Frank",27,"LA"],[7,"Grace",38,"Chicago"],[8,"Henry",52,"NYC"],[9,"Iris",29,"Seattle"],[10,"James",41,"Houston"]]}'
  WHERE id = 1 AND expected_result IS NULL;

  -- Assignment 2: Filter by City (NYC)
  UPDATE public.assignments
  SET expected_result = '{"columns":["id","name","age","city"],"rows":[[1,"Alice",28,"NYC"],[4,"David",45,"NYC"],[8,"Henry",52,"NYC"]]}'
  WHERE id = 2 AND expected_result IS NULL;

  -- Assignment 3: Sort Users by Age
  UPDATE public.assignments
  SET expected_result = '{"columns":["id","name","age","city"],"rows":[[3,"Carol",22,"Chicago"],[6,"Frank",27,"LA"],[1,"Alice",28,"NYC"],[9,"Iris",29,"Seattle"],[5,"Eva",31,"Houston"],[2,"Bob",34,"LA"],[7,"Grace",38,"Chicago"],[10,"James",41,"Houston"],[4,"David",45,"NYC"],[8,"Henry",52,"NYC"]]}'
  WHERE id = 3 AND expected_result IS NULL;

  -- Assignment 4: Count Users
  UPDATE public.assignments
  SET expected_result = '{"columns":["count"],"rows":[[10]]}'
  WHERE id = 4 AND expected_result IS NULL;

  -- Assignment 5: Select Specific Columns (name and city)
  UPDATE public.assignments
  SET expected_result = '{"columns":["name","city"],"rows":[["Alice","NYC"],["Bob","LA"],["Carol","Chicago"],["David","NYC"],["Eva","Houston"],["Frank","LA"],["Grace","Chicago"],["Henry","NYC"],["Iris","Seattle"],["James","Houston"]]}'
  WHERE id = 5 AND expected_result IS NULL;

  -- Assignment 6: Orders Above Threshold (amount > 200)
  UPDATE public.assignments
  SET expected_result = '{"columns":["id","user_id","amount"],"rows":[[4,2,450.75],[7,4,999.00],[8,4,150.00],[10,5,620.00],[11,6,310.00],[13,8,800.00],[15,10,270.50],[3,2,340.00]]}'
  WHERE id = 6 AND expected_result IS NULL;

  -- Assignment 7: Users with Orders (JOIN)
  UPDATE public.assignments
  SET expected_result = '{"columns":["name","amount"],"rows":[["Alice",120.50],["Alice",340.00],["Bob",89.99],["Bob",450.75],["Carol",200.00],["Carol",55.25],["David",999.00],["David",150.00],["Eva",75.50],["Eva",620.00],["Frank",310.00],["Grace",44.99],["Henry",800.00],["Iris",130.00],["James",270.50]]}'
  WHERE id = 7 AND expected_result IS NULL;

  -- Assignment 8: Total Orders per User
  UPDATE public.assignments
  SET expected_result = '{"columns":["user_id","total"],"rows":[[1,460.50],[2,540.74],[3,255.25],[4,1149.00],[5,695.50],[6,310.00],[7,44.99],[8,800.00],[9,130.00],[10,270.50]]}'
  WHERE id = 8 AND expected_result IS NULL;

  -- Assignment 9: Average Order Amount
  UPDATE public.assignments
  SET expected_result = '{"columns":["avg"],"rows":[[369.09]]}'
  WHERE id = 9 AND expected_result IS NULL;

  -- Assignment 10: Top Spenders (top 3 by total)
  UPDATE public.assignments
  SET expected_result = '{"columns":["name","total"],"rows":[["David",1149.00],["Eva",695.50],["Bob",540.74]]}'
  WHERE id = 10 AND expected_result IS NULL;

  -- Assignment 11: Users Without Orders
  UPDATE public.assignments
  SET expected_result = '{"columns":["id","name","age","city"],"rows":[]}'
  WHERE id = 11 AND expected_result IS NULL;

  -- Assignment 12: Orders Above User Average
  UPDATE public.assignments
  SET expected_result = '{"columns":["id","user_id","amount"],"rows":[[2,1,340.00],[4,2,450.75],[5,3,200.00],[7,4,999.00],[10,5,620.00],[11,6,310.00],[13,8,800.00],[15,10,270.50]]}'
  WHERE id = 12 AND expected_result IS NULL;
END $$;
